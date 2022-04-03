import Post from '../models/post.js';

const isCreator = async (req, res, next) => {
	let userId = req.user._id;
	let postId = req.params.id;

	let post = await Post.findById(postId);

	if (userId != post.creator) {
		return res.status(403).json({ message: 'Unauthorized action' });
	}

	next();
};

export default isCreator;
