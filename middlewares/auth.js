import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../constants/index.js';

export const auth = (req, res, next) => {
	let token = req.cookies[TOKEN_KEY];

	if (token) {
		// there is a token => verify if valid
		try {
			let decodedData = jwt.verify(token, process.env.JWT_SECRET);

			// token is valid && data is decoded
			// grab user data
			req.user = decodedData;
			next();
		} catch (error) {
			console.error(error);
			res.clearCookie(TOKEN_KEY).status(400).send('Invalid token provided');
		}
	} else {
		// no token => send 401
		res.status(401).send('Access denied, No token provided');
	}
};

export const unauth = (req, res, next) => {
	let token = req.cookies[TOKEN_KEY];

	if (token) {
		// there is a token => invalid action
		res.status(400).send(`Unexpected  ${TOKEN_KEY} cookie`);
	} else {
		// no token
		next();
	}
};
