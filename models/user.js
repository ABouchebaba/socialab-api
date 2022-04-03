import mongoose from 'mongoose';
import Joi from 'joi';
import { joiPassword } from 'joi-password';

const schema = mongoose.Schema({
	firstName: { type: String, minlength: 2, maxlength: 50, required: true },
	lastName: { type: String, minlength: 2, maxlength: 50, required: true },
	email: { type: String, unique: true, required: true },
	password: {
		type: String,
		minlength: 8,
		validate: {
			validator: function (v) {
				const up = v.match(/.*[A-Z]+.*/);
				const low = v.match(/.*[a-z]+.*/);
				const num = v.match(/.*[0-9]+.*/);
				return up && low && num;
			},
			message:
				'Password must contain an uppercase letter, a lowercase letter and a number',
		},
	},
	googleId: { type: String },
	imageUrl: { type: String },
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

export const validateUser = (user) => {
	const schema = Joi.object({
		firstName: Joi.string().min(2).max(50).required(),
		lastName: Joi.string().min(2).max(50).required(),
		email: Joi.string().email().required(),
		password: joiPassword
			.string()
			.min(8)
			.minOfLowercase(1)
			.minOfUppercase(1)
			.minOfNumeric(1),
		confirmPassword: Joi.ref('password'),
		googleId: Joi.string(),
		imageUrl: Joi.string(),
	});

	return schema.validate(user);
};

export const validateLoginCredentials = (loginInfo) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: joiPassword
			.string()
			.min(8)
			.minOfLowercase(1)
			.minOfUppercase(1)
			.minOfNumeric(1)
			.required(),
	});
	return schema.validate(loginInfo);
};

const model = mongoose.model('User', schema);

export default model;
