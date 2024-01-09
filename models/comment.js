const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	author: { type:Schema.Types.ObjectId, ref:'User', required:true },
	content: { type:String, required:true },
	date : { type:Date, default: () => Date.now()}
});

commentSchema.virtual('formatted_date').get(function() {
	return DateTime.fromJSDate(this.date).toFormat('LLL dd yyyy HH:mm:ss');
});

module.exports = mongoose.model('Comment', commentSchema);