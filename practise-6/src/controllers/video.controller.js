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
})

export {
    getAllVideos,
}