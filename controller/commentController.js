asyncHandler = require('express-async-handler');
const Post = require('../models/post');

exports.create_comment = asyncHandler(async( req, res, next ) => {
	res.send(`create comment for ${req.params.post}`);
});

exports.delete_comment = asyncHandler(async( req, res, next ) => {
	res.send(`delete commentId ${req.params.comment} for postId ${req.params.post}`);
});