asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

exports.home_page = asyncHandler(async(req, res, next)=> {
	res.send('Home Page');
});

exports.post_list = asyncHandler(async(req, res, next)=> {
	const posts = await Post.find({}).populate('author').sort({date:1}).exec();
	if ( posts === null ) {
		const err = new Error('User not found');
		err.status = 400;
		next(err);
	}
	const formattedPosts = posts.map(post => ({
		_id: post._id,
		title: post.title,
		author: post.author.username,
		formatted_date: post.formatted_date,
		url: post.url,
	}));
	res.json(formattedPosts);
});

exports.create_post_get = asyncHandler(async( req, res, next )=> {
	res.send('GET create post form');
});

exports.create_post_post = asyncHandler(async( req, res, next )=> {
	jwt.verify(req.token,'secretkey',(err, authData)=> {
		if(err) {
			res.sendStatus(403);
		} else {
			res.json({
				message: 'Post created...',
				authData
			});
		}
	});
});

exports.post_details = asyncHandler(async( req, res, next ) => {
	const post = await Post.findById(req.params.post)
		.populate('author')
		.populate('comment')
		.populate({
			path:'comment',
			populate: {path: 'author'}
		})
		.exec();

	const formattedPost = {
		_id: post._id,
		title: post.title,
		content: post.content,
		author: post.author.username,
		authorUrl:post.author.url,
		formatted_date: post.formatted_date,
		comments : post.comment.map(comment=>({
			_id:comment._id,
			author:comment.author.username,
			authorUrl:comment.author.url,
			content: comment.content,
			time: comment.formatted_date
		}))
	};
	
	res.json(formattedPost);


});

exports.delete_post_get = asyncHandler(async( req, res, next ) => {
	res.send(`GET delete post and comments of ${req.params.post}`);
});

exports.delete_post_post = asyncHandler(async( req, res, next ) => {
	res.send(`POST delete post and comments of ${req.params.post}`);
});