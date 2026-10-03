import mongoose, { isValidObjectId, mongo } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query

    const matchCondition = {
        isPublished: true
    }
    if (query) {
        matchCondition.title = {
            $regex: query,
            $options: "i"
        }
    }

    if (userId && isValidObjectId(userId)) {
        matchCondition.owner = new mongoose.Types.ObjectId(userId)
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1

    const Video = await Video.aggregate([
        {
            $match: matchCondition
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foriegnField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addField: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $sort: sortOptions
        },
        {
            $skip: (Number(page) - 1) * Number(limit)
        },
        {
            $limit: Number(limit)
        }
    ])
     const totalVideos = await Video.countDocuments(matchCondition)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                videos,
                totalVideos,
                currentPage: Number(page),
                totalPages: Math.ceil(totalVideos / limit)
            },
            "Videos fetched successfully"
        )
    )
})

const publishAVideo = asyncHandler(async(req, res) => {
    const {title, description} = req.body
    const videoFile = req.files?.videoFile?.[0]
    const thumbnail = req.files?.videoFile?.[0]

    if(!title || !description || !videoFile || !thumbnail){
        throw new ApiError(400, "Title, description, video and thumbnail are required")
    }

    const uploadedVideo = await uploadOnCloudinary(videoFile.path)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnail.path)

    if(!uploadedVideo || !uploadedThumbnail){
        throw new ApiError(500, "Video or thumbnail upload failed")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        duration: uploadedVideo.duration || 0 ,
        owner: req.user?._id,
        isPublished: true
    })
    
    return res
    .status(200)
    .json(
        new ApiResponse(
        201,
        video,
        "Video published Successfully"
    )
    )
})

export {
    getAllVideos,
}