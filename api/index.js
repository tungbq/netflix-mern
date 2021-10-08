const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const authRoute = require('./routes/auth.js');

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful!'))
	.catch((err) => console.log(err));

app.use(express.json())

app.use('/api/auth', authRoute);

app.listen(8800, () => {
	console.log('Backend server is running!');
});
