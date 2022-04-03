import mongoose from 'mongoose';
import Joi from 'joi';
import objectId from 'joi-objectid';
Joi.objectId = objectId(Joi);

const schema = mongoose.Schema({
	title: { type: String, minlength: 1, maxlength: 100, required: true },
	message: { type: String, maxlength: 250 },
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	tags: [{ type: String, minlength: 1, maxlength: 50 }],
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	selectedFile: String,
	createdAt: {
		type: Date,
		default: () => new Date(),
	},
});

export const validatePost = (post) => {
	const schema = Joi.object({
		title: Joi.string().min(1).max(100).required(),
		message: Joi.string().allow('').max(250),
		creator: Joi.objectId().required(),
		tags: Joi.array().min(0).items(Joi.string().min(1).max(100)),
		selectedFile: Joi.string().allow(''),
	});

	return schema.validate(post);
};

const model = mongoose.model('Post', schema);

export default model;
