const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// const Post = require('./models/post');

const postRoutes = require('./routes/posts');

const app = express();

mongoose.connect("mongodb+srv://ron:QmHLHAKmVVynx6dj@cluster0-kiy3p.mongodb.net/node-angular?retryWrites=true&w=majority",{
    useNewUrlParser : true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to database!");
}).catch(() => {
    console.log("Connection failed!");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("backend/images")));

// app.use((req, res, next) => {
//     console.log("Middleware");
//     next();
// });

//     QmHLHAKmVVynx6dj

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postRoutes);

// app.post('/api/posts',(req, res, next)=> {
//     const post = new Post({
//         title: req.body.title,
//         content: req.body.content
//     });
//     post.save().then(createdPost => {
//         res.status(201).json({
//             message: "Post added successfully",
//             postId: createdPost._id
//         });
//     });
    
// });

// app.put("/api/posts/:id", (req, res,next)=> {
//     const post = new Post({
//         _id: req.body.id,
//         title: req.body.title,
//         content: req.body.content
//     });
//     Post.updateOne({_id: req.params.id},post).then(result => {
//         console.log(result);
//         res.status(200).json({
//             message: 'Post updated successfuly',
//         });
//     })
// })

// app.get('/api/posts',(req, res, next) => {
//     // const posts = [
//     //     {id: 'abc123', title: 'title', content: 'this is the content'},
//     //     {id: 'abc124', title: 'tictle', content: 'this is the covzntent'},
//     //     {id: 'abc1234', title: 'titcle', content: 'this is the conavvxvvtent'},
//     //     {id: 'abc123r', title: 'title', content: 'this is the conxvxtent'},
//     //     {id: 'abc1r23', title: 'titcle', content: 'this is the ccsontent'},
//     // ];

//     Post.find().then(documents => {
//         res.status(200).json({
//             message: 'Posts fetched successfuly',
//             posts: documents
//         });
//     });

//     // res.status(200).json({
//     //     message: 'Posts fetched successfuly',
//     //     posts: posts
//     // });
// });

// app.get("/api/posts/:id", (req, res, next) => {
//     Post.findById(req.params.id).then(post => {
//         if(post){
//             res.status(200).json(post);
//         }else{
//             res.status(404).json({message: 'Post not found'});
//         }
//     })
// })

// app.delete("/api/posts/:id", (req, res, next) => {
//     //console.log(req.params.id);

//     Post.deleteOne({_id: req.params.id}).then(result => {
//         console.log(result);
//         res.status(200).json({
//             message: 'Post deleted successfuly',
//         });
//     })
    
// })

module.exports = app;