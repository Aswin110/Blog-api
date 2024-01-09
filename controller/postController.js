asyncHandler = require('express-async-handler');
const Post = require('../models/post');

exports.post_list = asyncHandler(async(req, res, next)=> {
	res.send('GET all posts');
});

exports.create_post_get = asyncHandler(async( req, res, next )=> {
	res.send('GET create post form');
});

exports.create_post_post = asyncHandler(async( req, res, next )=> {
	res.send('POST post form');
});

exports.post_details = asyncHandler(async( req, res, next ) => {
	res.send(`post details of ${req.params.post} with comments`);
});

exports.delete_post_get = asyncHandler(async( req, res, next ) => {
	res.send(`GET delete post and comments of ${req.params.post}`);
});

exports.delete_post_post = asyncHandler(async( req, res, next ) => {
	res.send(`POST delete post and comments of ${req.params.post}`);
});