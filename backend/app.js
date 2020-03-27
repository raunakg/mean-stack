const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// app.use((req, res, next) => {
//     console.log("Middleware");
//     next();
// });

//     Q1yYsg1XhEd2XOSX

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/posts',(req, res, next)=> {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: "Post added successfully"
    });
});

app.get('/api/posts',(req, res, next) => {
    const posts = [
        {id: 'abc123', title: 'title', content: 'this is the content'},
        {id: 'abc124', title: 'tictle', content: 'this is the covzntent'},
        {id: 'abc1234', title: 'titcle', content: 'this is the conavvxvvtent'},
        {id: 'abc123r', title: 'title', content: 'this is the conxvxtent'},
        {id: 'abc1r23', title: 'titcle', content: 'this is the ccsontent'},
    ];

    res.status(200).json({
        message: 'Posts fetched successfuly',
        posts: posts
    });
});

module.exports = app;