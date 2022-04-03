import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRoutes from './routes/posts.js';
import usersRoutes from './routes/users.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

const origin =
	process.env.NODE_ENV === 'dev'
		? 'http://localhost:3000'
		: 'http://example.com';

const corsConfig = {
	credentials: true,
	origin,
};

app.use(cors(corsConfig));

app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);

const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.DB_CONNECTION_URL)
	.then(() => {
		app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
	})
	.catch((error) => console.log(error.message));
