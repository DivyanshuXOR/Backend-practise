import express from "express";

const app = express();

app.get('/', (req, res) =>{
    res.send("Server is ready");
});

const jokes = [{
    id:1,
    title: "Rohan is Kala",
    content: "Upesh is Ledaa"
},{
   id:2,
    title: "Rohan is more Kala",
    content: "Upesh is more Ledaa" 
},{
   id:3,
    title: "Rohan is most Kala",
    content: "Upesh is most Ledaa" 
}]

const port = process.env.PORT || 3000;

app.get('/api/jokes',(req, res) => {
    res.json(jokes);
}) 

app.listen(port, () =>{
    console.log(`Serve at http://localhost:${port}`);
});