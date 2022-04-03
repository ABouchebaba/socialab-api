import express from 'express';
import { signin, signup, googleSignin, logout } from '../controllers/users.js';
import { auth, unauth } from '../middlewares/auth.js';
import parseUser from '../middlewares/parseUser.js';
import validate from '../middlewares/validate.js';
import { validateLoginCredentials, validateUser } from '../models/user.js';

const router = express.Router();

router.post(
	'/signin/google',
	unauth,
	parseUser,
	validate(validateUser),
	googleSignin
);
router.post('/signin', unauth, validate(validateLoginCredentials), signin);
router.post('/signup', unauth, validate(validateUser), signup);
router.post('/logout', auth, logout);

export default router;
