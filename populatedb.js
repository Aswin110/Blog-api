#! /usr/bin/env node
/* eslint-disable no-undef */

console.log(
	'This script populates some users, posts and comments to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/Blog_api?retryWrites=true&w=majority"'
);
  
// Get arguments passed on command line
const userArgs = process.argv.slice(2);
  
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
  
const users = [];
const posts = [];
const comments = [];
  
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
  
const mongoDB = userArgs[0];
  
main().catch((err) => console.log(err));
  
async function main() {
	console.log('Debug: About to connect');
	await mongoose.connect(mongoDB);
	console.log('Debug: Should be connected?');
	await createUsers();
	await createComments();
	await createPosts();
	
	console.log('Debug: Closing mongoose');
	mongoose.connection.close();
}

async function userCreate(index, first_name, last_name, username, password) {
	const userDetail = { 
		first_name: first_name, 
		last_name: last_name, 
		username: username, 
		password:password, 
	};
  
	const user = new User(userDetail);
  
	await user.save();
	users[index] = user;
	console.log(`Added user: ${first_name} ${last_name}`);
}
  
async function postCreate(index, title, content, author, comment) {
	const postDetail = {
		title: title,
		content: content,
		author: author,
	};
    
	if (comment != false ) postDetail.comment = comment;
	const post = new Post(postDetail);
	await post.save();
	posts[index] = post;
	console.log(`Added post: ${title}`);
}


async function commentCreate(index, author, content) {
	const commentDetails = {
		author: author,
		content: content,
	};

	const comment = new Comment(commentDetails);
	await comment.save();
	comments[index] = comment;
	console.log(`Added comment: ${content}`);
}

async function createUsers() {
	console.log('Adding users');
	await Promise.all([
		userCreate(0, 'Aswin', 'Ashok', 'AswinAshok', 'Password@123'),
		userCreate(1, 'Ben', 'Bova', 'BenBova', 'Password@123'),
		userCreate(2, 'John', 'Wick', 'JohnWick', 'Password@123'),
	]);
}

async function createComments() {
	console.log('Adding comments');
	await Promise.all([
		commentCreate(0, users[0], 'Great article!' ),
		commentCreate(1, users[0], 'i love it!'),
		commentCreate(2, users[1], 'very good' ),
		commentCreate(3, users[1], 'nice'),
		commentCreate(4, users[2], 'wonderful!' ),
		commentCreate(5, users[2], 'Great.'),
	]);
}
  
async function createPosts() {
	console.log('Adding posts');
	await Promise.all([
		postCreate(0,
			'Holding onto God\'s Promises',
			'My family and I went to Missouri over the summer to visit my mom. Misery you say? Yes, that’s what I said. The weather was very hot and humid. My mom lives about 30 miles from Branson. If you have\'t been to Branson—it\'s like Disneyland for people who love Jesus. There are a lot of entertainment shows and family attractions. You know how families go to Disneyland with matching t-shirts? Well, Branson...same…except they all have Bible verses on the back instead of Mickey Mouse.On this trip, my kids wanted to try another mountain coaster. I say another because there are 3 mountain coasters in Branson and the last time we visited my mom, they LOVED the mountain coaster we went on. When they found out there were 2 more of them, they came up with their own “mountain coaster bucket list” of sorts. So, for 2023, we decided to conquer the Copperhead Mountain Coaster which is at the top of Shepherd of the Hills, the highest point in Southwest Missouri.',
			users[0],
			[comments[0], comments[1], comments[3]]
		),
		postCreate(1,
			'The Serious Business of Heaven',
			'This Christmas, learn how to find and share contagious joy with your friends, family, and neighbors in and around Newbreak Church.I recently had the privilege of surprising both of my nephews at one of their weekday events. I was so excited to see them, and I got there early because I didn\'t want to miss anything. As I waited in my car, my mind was going through all of the memories that I have with them and some of the funny things that they say. For instance, my nephew Joshua recently said, “The world would be a whole lot better if everyone thought like me.” Kids truly do say some of the funniest things. The time finally came, the wait was over, and both boys hopped out of the car and were so excited to see that I was there. The hugs, the laughs, and the walk to the event filled us all with enough joy to start an engine. Then the most beautiful moment happened. My nephew Johnny (12) is currently in Tae Kwon Do, and while he was practicing his moves, he would look over to see if I was still looking at him. Of course, I was, those boys are precious to me. It reminded me of how it must have felt for Mary, the mother of Jesus, when she was reminded that God looked at her. Mary, after she is told that she would be the Magnificent Mother of the Messiah, she breaks out into song. It was like High School Musical, but much better of course. She sings, “My soul magnifies the Lord, and my spirit rejoices in God my Savior, because he has looked with favor on the humble condition of his servant. Surely from now on all generations will call me blessed…” - Luke 1:46-48 (CSB). Mary magnifies God, she zooms in on all that God is and all that He has done, and then she shares why. Mary says, “Because He has looked with favor…” God sees you. God sees me. The same way that my eyes were locked in on my nephews as I saw them enjoying life, playing in the sand, and practicing Tae Kwon Do. God\'s eyes are on you. He is not looking with anger or with frustration, God is looking with favor!',
			users[1],
			[comments[1], comments[2]]
		),
		postCreate(2,
			'Be Busy, Not Hurried',
			'Think about what the word “disorder” even means. It is literally when things are out of order. The quality of our life is diminished when we lose the proper order of things. Cosmologists revel at the fine tuning and order we find in the universe. What would happen if the universe became disordered overnight? Our cosmos would become a chaos and all life would cease to be! That\'s how important order is… our very existence depends on order. Disorder is no joking matter! Yet, often we try to learn to cope with our disordered lives instead of having a severe wake-up call to re-order them so that we can thrive again.The solution isn\'t to stop, the solution is to simplify. So, what does it mean to simplify? It means putting our focus on the right things instead of just on more things. Part of the work of the gospel in our lives, according to Paul, is that the light of Christ “produces only what is good and right and true” (Ephesians 5:9). God\'s values will always follow suit with what is good, right, and true. When Paul is speaking of what pleases the Lord (verse 10), he is not simply saying what makes God happy. He is saying what God is truly looking for and what He values. Spoiler alert: Living hurried and disordered lives isn\'t it! ',
			users[2],
			[comments[1]]
		),
	]);
}