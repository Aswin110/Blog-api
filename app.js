/* eslint-disable no-undef */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./models/user');

var catalogRouter = require('./routes/catalog');
var usersRouter = require('./routes/users');

dotenv.config();
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
console.log(process.env.SESSION_SECRET);
// app.use(session({}))
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