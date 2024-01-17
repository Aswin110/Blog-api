/* eslint-disable no-undef */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

var catalogRouter = require('./routes/catalog');
var usersRouter = require('./routes/users');

dotenv.config();

passport.use('login', 
	new LocalStrategy(
		{
			usernameField: 'username', 
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				const user = await User.findOne({username});
				if(!user) {
					return done(null, false, {message:'User not found'});
				}
				const validate = await user.isValidPassword(password);
				if(!validate) {
					return done(null, false, {message:'Wrong password'});
				}
				return done(null, user, {message:'Logged in successfully'});
			} catch(err) {
				return done(err);
			}
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			secretOrKey: process.env.SECRET,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (error) {
				done(error);
			}
		}
	)
);
  
passport.use(
	'signup',
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				return done(null, {});
			} catch (error) {
				done(error);
			}
		}
	)
);
  

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(mongoDB);
	console.log('connected to mongodb');
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', catalogRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;