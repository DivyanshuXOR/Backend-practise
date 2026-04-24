import express from "express";

const app = express();

app.use(express.static('public'))

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));

})

app.get('/github',(req, res) => {
    res.send("My GitHub page");

})

app.get('/',(req, res) => {
    res.send("See NEXT");

})

app.get('/linkdin/profile',(req,res) => {
    res.send("<title>These are the profiles</title>")
})



app.listen(3000, () => {
    console.log("server is running on the port 3000");
})