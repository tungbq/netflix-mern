const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js')

// Register
router.post('/register', async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		password: CryptoJS.AES.encrypt(req.body.username, process.env.SECRET_KEY),
		email: req.body.email,
	});

	try {
		const user = await newUser.save();
		res.status(201).json(user);
	} catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
