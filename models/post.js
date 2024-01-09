const mongoose = require('mongoose');
const {DateTime} = require('luxon');
const Schema = mongoose.Schema;

const postSchema = new Schema({
	date: { type:Date, default:()=>Date.now() },
	title: { type:String, required:true },
	content: { type:String, required:true },
	author: { type:Schema.Types.ObjectId, ref:'User'},
	comment: [{ type:Schema.Types.ObjectId, ref:'Comment', required:false}]
});

postSchema.virtual('formatted_date').get(function(){
	return DateTime.fromJSDate(this.date).toFormat('LLL dd yyyy HH:mm:ss');
});

postSchema.virtual('url').get( function getUrl(){
	return `/post/${this._id}`;
});


module.exports = mongoose.model('Post', postSchema);