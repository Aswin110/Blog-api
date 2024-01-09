asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');

exports.login_get = asyncHandler(async(req, res, next)=> {
	res.send('login page GET');
});

exports.login_post = asyncHandler(async(req, res, next)=> {
	res.send('login page POST');
});

exports.signup_get = asyncHandler(async(req, res, next)=> {
	res.send('signup page GET');
});

exports.signup_post = asyncHandler(async(req, res, next)=> {
	res.send('signup page POST');
});

exports.logout_get = asyncHandler(async(req, res, next)=> {
	res.send('logout page GET');
});