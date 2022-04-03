import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import mongoose from 'mongoose';
import { TOKEN_KEY } from '../constants/index.js';

export const signup = async (req, res) => {
	let { email, password, confirmPassword, firstName, lastName } = req.body;

	try {
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: 'User already exists!' });

		if (password != confirmPassword)
			return res.status(400).json({ message: "Passwords don't match!" });

		password = await bcrypt.hash(password, 12);
		user = await User.create({ email, password, firstName, lastName });

		let token = jwt.sign(
			{ email: user.email, _id: user._id },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.TOKEN_DURATION,
			}
		);

		delete user.password;
		res.cookie(TOKEN_KEY, token, { httpOnly: true }).status(200).send(user);
	} catch (error) {
		res.status(500).send({ message: 'Something went wrong!' });
	}
};

export const signin = async (req, res) => {
	let { email, password } = req.body;

	try {
		let user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: 'User not found!' });

		let isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect)
			return res.status(400).json({ message: 'Wrong email or password' });

		let token = jwt.sign(
			{ email: user.email, _id: user._id },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.TOKEN_DURATION,
			}
		);

		delete user.password;
		res.cookie(TOKEN_KEY, token, { httpOnly: true }).status(200).send(user);
	} catch (error) {
		res.status(500).send({ message: 'Something went wrong!' });
	}
};

export const googleSignin = async (req, res) => {
	let { email } = req.body;

	// TODO: delete this line
	await new Promise((r) => setTimeout(r, 3000));

	try {
		let user = await User.findOne({ email });
		if (!user) {
			// user does not exist => create user and return it
			user = await User.create(req.body);
		}
		let token = jwt.sign(
			{ email: user.email, _id: user._id },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.TOKEN_DURATION,
			}
		);

		delete user.password;
		res.cookie(TOKEN_KEY, token, { httpOnly: true }).status(200).send(user);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Something went wrong!' });
	}
};

export const logout = async (req, res) => {
	return res
		.status(200)
		.clearCookie(TOKEN_KEY)
		.send({ message: 'User logged out' });
};
