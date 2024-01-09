const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

userSchema.static.isUsernameTaken = async function isUsernameTaken (username) {
	return this.exists({username})
		.collation({ locale:'en', strength:2 })
		.exec();
};

module.exports = mongoose.model('User', userSchema);