const express = require('express');


const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');
const extractFileInfo = require('../middleware/file');

const postController = require('../controllers/post')


const router = express.Router();



router.post('', checkAuth, extractFileInfo, postController.CreatePost);

router.put("/:id", checkAuth, extractFileInfo, postController.updatePost)

router.get('', postController.getPosts);

router.get("/:id", postController.getPostById);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports =router;