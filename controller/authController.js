asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.login_get = asyncHandler(async(req, res, next)=> {
	res.send('login page GET');
});

exports.login_post = asyncHandler(async(req, res, next)=> {
	const user = {
		id: 1,
		username:'AswinAshok',
		email:'brad@gmail.com',
	};
	jwt.sign({user},'secretkey',{expiresIn:'30s'},(err, token) => {
		res.json({token});
	});
});
// FORMAT of token
// Authorization: Bearer <access_token>
exports.verifyToken = (req, res, next)=> {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
};

exports.signup_get = asyncHandler(async(req, res, next)=> {
	res.send('signup page GET');
});

exports.signup_post = asyncHandler(async(req, res, next)=> {
	res.send('signup page POST');
});

exports.logout_get = asyncHandler(async(req, res, next)=> {
	res.send('logout page GET');
});

exports.Check_username = asyncHandler(async(req, res, next)=>{	
	try {
		const { username } = req.body;
		const usernameTaken = await User.isUsernameTaken(username);
		res.json({ usernameTaken });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

