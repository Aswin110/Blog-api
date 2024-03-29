const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const bcrypt =require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

exports.login_get = asyncHandler(async(req, res, next)=> {
	res.send('login page GET');
});

exports.login_post = asyncHandler(async (req, res, next) => {
	try {
		const {username, password} = req.body;
		const user = await User.findOne({username}).exec();
		// console.log(user);
		// res.send(user);

		if(!user) {
			return res.status(200).json({message:'invalid username and password'});
		}

		const isValidPassword = await user.isValidPassword(password);

		if (!isValidPassword) {
			return res.status(200).json({message:'invalid username and password'});
		} else {
			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);	  
				const body = { _id: user._id, username: user.username };
				const token = jwt.sign({ user: body }, 'secretkey', {
					expiresIn: '1d',
				});	  
				return res.json({ token });
			});
			// res.send('logged in');
		}  
	} catch (error)	{
		console.log(error);
		next(error);
	}
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

exports.signup_get = asyncHandler( async (req, res, next) => {
	res.send('Signup page GET');
});

exports.signup_post = asyncHandler(async (req, res, next) => {
	const { first_name, last_name, username, password, confirmPassword } = req.body;

	// Check if passwords match
	if (password !== confirmPassword) {
		return res.json({ message: 'Passwords do not match' });
	}

	try {
		const existingUser = await User.findOne({ username });

		if (existingUser) {
			return res.json({ message: 'User already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({
			first_name,
			last_name,
			username,
			password:hashedPassword,
		});
		console.log(newUser);
		const body = { 
			_id: newUser._id,
			username: newUser.username, 
			first_name: newUser.first_name,
			last_name: newUser.last_name
		};
		const token = jwt.sign({ user: body }, process.env.SECRET, {
			expiresIn: '1d',
		});
		return res.json({ token });
	} catch (error) {
		console.error(error);
		return next(error);
	}
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





// passport.authenticate('jwt', async (err, user, info) => {
	// 	try {
	// 		if (err || !user) {
				
	// 			console.error('err',err);
	// 			console.log(info);
	// 			const error = new Error('An error occurred.');
	// 			return next(error);
	// 		}


// } catch (error) {
	// 	console.error(error);
	// 	return next(error);
	// }
	// })(req, res, next);