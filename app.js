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

passport.use(
	new JWTStrategy(
		{
			secretOrKey: process.env.SECRET,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			issuer: process.env.SERVER_URL,
			audience: process.env.CLIENT_URL,
		},
		async (jwt_payload, done) => {
			console.log('jwt_payload', jwt_payload);
			User.findOne({username: jwt_payload.username}, function(err, user) {
				console.log('user',user);
				if (err) {
					return done(err, false);
				}
				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
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