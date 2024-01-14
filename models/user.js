const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
	username: {
		type:String,
		minLength:6,
		maxLength:30,
		unique:true,
	},
	first_name: { type:String, required: true },
	last_name: { type: String, required:true },
	password: { type:String, required:true, minLength:8 },
});

userSchema.statics.isUsernameTaken = async function isUsernameTaken (username) {
	return this.exists({username})
		.collation({ locale:'en', strength:2 })
		.exec();
};

userSchema.virtual('url').get( function getUrl(){
	return `/account/${this._id}`;
});

userSchema.pre('save', async function (next) {
	const user = this;
	if (!user.isModified('password')) {return next();}

	bcrypt.hash(user.password, 10).then((hashedPassword)=> {
		user.password = hashedPassword;
		next();
	}).catch((err)=> next(err));
});

userSchema.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);
  
	return compare;
};

module.exports = mongoose.model('User', userSchema);