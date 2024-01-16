asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const bcrypt =require('bcryptjs');

exports.login_get = asyncHandler(async(req, res, next)=> {
	res.send('login page GET');
});

exports.login_post = asyncHandler(async(req, res, next)=> {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if (err || !user) {
				const error = new Error('An error occurred.');
	
				return next(error);
			}
	
			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);
	
				const body = { _id: user._id, username: user.username };
				const token = jwt.sign({ user: body }, process.env.SECRET, {
					expiresIn: '1d',
				});
	
				return res.json({ token });
			});
		} catch (error) {
			return next(error);
		}
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

exports.signup_success = asyncHandler(async (req, res, next) => {
	const body = { _id: req.user._id, username: req.user.username };
	const token = jwt.sign({ user: body }, process.env.SECRET, {
		expiresIn: '1d',
	});
	res.json({ token });
});

exports.signup_get = asyncHandler( async (req, res, next) => {
	res.send('Signup page GET');
});

exports.signup_post =[
	body('first_name')
		.trim()
		.isString()
		.isLength({ min: 1 })
		.withMessage('First name is required'),

	body('last_name')
		.trim()
		.isString()
		.isLength({ min: 1 })
		.withMessage('Last name is required'),

	body('username')
		.trim()
		.isLength({ min: 1, max: 25 })
		.withMessage('Username must be between 1 and 25 characters'),

	body('password')
		.isLength({ min: 1 })
		.withMessage('Password is too short'),

	body('confirmPassword')
		.isLength({ min: 1 })
		.withMessage('Passwords do not match'),
		
	asyncHandler(async(req, res, next)=>{
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors.array());
		} else {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);

			const user = new User({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				username: req.body.username,
				password: hashedPassword,
			});

			await user.save();
			next();
		}
	}),

	passport.authenticate(
		'signup', { session: false }),
]; 

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



// exports.logout_in = asyncHandler(async(req, res, next)=> {
// 	const user = {
// 		id: 1,
// 		username:'AswinAshok',
// 		email:'brad@gmail.com',
// 	};
// 	jwt.sign({user},'secretkey',{expiresIn:'30s'},(err, token) => {
// 		res.json({token});
// 	});
// });