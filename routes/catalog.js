const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const commentController = require('../controller/commentController');
const authController = require('../controller/authController');

router.get('/', postController.home_page);

router.get('/posts', postController.post_list);

router.get('/post/new', postController.create_post_get);

router.post('/post/new', authController.verifyToken, postController.create_post_post);

router.get('/post/:post', postController.post_details);

router.post('/post/:post', commentController.create_comment);

router.get('/post/:post/comment/:comment', commentController.delete_comment);

router.get('/post/:post/delete', postController.delete_post_get);

router.post('/post/:post/delete', postController.delete_post_post);

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

router.get('/signup', authController.signup_get);

router.post('/signup', authController.signup_post);

router.post('/signup/check-username', authController.Check_username);

router.get('/logout', authController.logout_get);

module.exports = router;
