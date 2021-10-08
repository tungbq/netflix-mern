const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// Register
router.post('/register', async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY),
		email: req.body.email,
	});

	try {
		const user = await newUser.save();
		res.status(201).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		!user && res.status(401).json('Wrong password or username!');

		const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
		const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

		originalPassword !== req.body.password &&
			res.status(401).json('Wrong password or username!');

		const { password, ...info } = user._doc;
		res.status(200).json(info);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
