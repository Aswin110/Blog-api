const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.create_comment = asyncHandler(async( req, res, next ) => {
	const {author, content} = req.body;
	const authorDetail = await User.findById(author);
	const postDetail = await Post.findById(req.params.post)
		.populate('author')
		.populate('comment')
		.populate({
			path:'comment',
			populate: {path: 'author'}
		});
	console.log('authorDetail', authorDetail);
	if (!authorDetail) {
		res.status(200).json({message:'author not found'});
		return;
	}
	if (!content) {
		res.status(200).json({message:'Comment required'});
		return;
	}

	const comment = new Comment ({
		author: authorDetail,
		content: content
	});

	await comment.save();
	postDetail.comment.push(comment);

	const formattedPost = {
		_id: postDetail._id,
		title: postDetail.title,
		content: postDetail.content,
		author: postDetail.author.username,
		authorUrl:postDetail.author.url,
		formatted_date: postDetail.formatted_date,
		comments : postDetail.comment.map(comment=>({
			_id:comment._id,
			author:comment.author.username,
			authorUrl:comment.author.url,
			content: comment.content,
			time: comment.formatted_date
		}))
	};
	// await Post.findByIdAndUpdate(req.params.post, postDetail);
	res.status(200).json(formattedPost);
});

exports.delete_comment = asyncHandler(async( req, res, next ) => {
	res.send(`delete commentId ${req.params.comment} for postId ${req.params.post}`);
});