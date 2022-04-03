import express from 'express';
import {
	getPosts,
	createPost,
	updatePost,
	deletePost,
	likePost,
} from '../controllers/posts.js';
import { auth } from '../middlewares/auth.js';
import isCreator from '../middlewares/isCreator.js';
import validate from '../middlewares/validate.js';
import { validatePost } from '../models/post.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', auth, validate(validatePost), createPost);
router.patch('/:id', auth, validate(validatePost), isCreator, updatePost);
router.delete('/:id', auth, isCreator, deletePost);
router.patch('/:id/like', auth, likePost);

export default router;
