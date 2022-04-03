const { auth, unauth } = require('../../../middlewares/auth.js');
const User = require('../../../models/user.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = require('../../../constants/index.js');

describe('Auth middleware', () => {
	test("should set req.user to user's _id and token", () => {
		// prepare
		const user = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			email: 'A@gmail.com',
		};
		let token = jwt.sign(user, process.env.JWT_SECRET, {
			expiresIn: process.env.TOKEN_DURATION,
		});

		const req = {
			cookies: {
				[TOKEN_KEY]: token,
			},
		};

		let next = jest.fn();
		let res = {};

		// execute
		auth(req, res, next);

		// test
		expect(req.user).toMatchObject(user);
	});

	test('should call next function', () => {
		// prepare

		const req = {
			cookies: {},
		};

		let next = jest.fn();
		let res = {};

		// execute
		unauth(req, res, next);

		// test
		expect(next.mock.calls.length).toBe(1);
	});
});
