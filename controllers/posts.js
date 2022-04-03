import Post from '../models/post.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
	try {
		let posts = await Post.find()
			.populate('creator', '_id firstName lastName')
			.sort('-createdAt');

		res.status(200).send(posts);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};

export const createPost = async (req, res) => {
	let postData = req.body;
	let newPost = new Post(postData);

	try {
		newPost = await newPost.save();
		newPost = await Post.findById(newPost._id).populate(
			'creator',
			'_id firstName lastName'
		);
		res.status(201).send(newPost);
	} catch (error) {
		res.status(409).send({ message: error.message });
	}
};

export const updatePost = async (req, res) => {
	let { id: _id } = req.params;
	let postData = req.body;

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send({ message: 'Post not found' });
	}

	try {
		let updatedPost = await Post.findByIdAndUpdate(
			_id,
			{ ...postData, _id },
			{
				new: true,
			}
		).populate('creator', '_id firstName lastName');
		return res.status(200).send(updatedPost);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};

export const deletePost = async (req, res) => {
	let { id: _id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(404).send({ message: 'Post not found' });
	}

	try {
		await Post.findByIdAndDelete(_id);
		return res.status(200).send({ message: 'Post successfully deleted' });
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};

export const likePost = async (req, res) => {
	let { id: _id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		return res.status(400).send({ message: 'Invalid post id' });
	}

	try {
		let userId = req.user._id;
		let post = await Post.findById(_id);
		let userLikedPost = post.likes.find((uid) => uid == userId);

		let newLikers = [];
		if (userLikedPost) {
			// remove user from the list of likers
			newLikers = post.likes.filter((uid) => uid != userId);
		} else {
			// add user to the list of likers
			newLikers = [...post.likes, userId];
		}

		let updatedPost = await Post.findByIdAndUpdate(
			_id,
			{ likes: newLikers },
			{
				new: true,
			}
		).populate('creator', '_id firstName lastName');
		return res.status(200).send(updatedPost);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
};
