
const Post = require('../models/post');


exports.CreatePost = (req, res, next)=> {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id,
                // title: createdPost.title,
                // content: createdPost.console,
                // imagePath: createdPost.imagePath
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: "Creating a Post failed!"
        })
    })
    
}


exports.updatePost =  (req, res,next)=> {
    let imagePath= req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath= url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId},post).then(result => {
        if(result.n>0){
            res.status(200).json({
                message: 'Post updated successfuly',
            });
        } else{
            res.status(401).json({
                message: 'Not Authorized!',
            });
        }
        
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        })
    })
}

exports.getPosts = (req, res, next) => {
    //console.log(req.query);
    const pageSize= +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery =Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
        postQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize);
    }

    postQuery.then(documents => {
        fetchedPosts =documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: 'Posts fetched successfuly',
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        })
    });


}

exports.getPostById =(req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'Post not found'});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        })
    });
}

exports.deletePost = (req, res, next) => {

    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        //console.log(result);
        if(result.n>0){
            res.status(200).json({
                message: 'Post deleted successfuly',
            });
        } else{
            res.status(401).json({
                message: 'Not Authorized!',
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Deleting post failed!"
        })
    });
    
}

