import mongoose from 'mongoose';
import isCreator from '../../../middlewares/isCreator.js';
import Post from '../../../models/post.js';

jest.mock('../../../models/post.js');

describe('isCreator middleware', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('should call next function', () => {
		let userId = new mongoose.Types.ObjectId().toHexString();
		let postId = new mongoose.Types.ObjectId().toHexString();

		let req = {
			user: { _id: userId },
			params: { id: postId },
		};

		let next = jest.fn(() => console.log('next'));
		let res = {};

		// mock Post model
		Post.findById.mockImplementation(() =>
			Promise.resolve({ creator: userId })
		);

		// execute
		isCreator(req, res, next);

		// test
		expect(next.mock.calls.length).toBe(1);
	});
});
