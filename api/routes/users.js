const router = require('express').Router();
const User = require('../models/User.js');
const CryptoJS = require('crypto-js');
const verify = require('../utils/verifyToken.js');

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', verify, async (req, res) => {
	if (req.user.id === req.params.id || req.user.isAdmin) {
		if (req.body.password) {
			req.body.password = CryptoJS.AES.encrypt(
				req.body.password,
				process.env.SECRET_KEY
			).toString();
		}

		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				// Use new : true to return new updated user
				{ new: true }
			);

			// Skip sending password back to client
			const { password, ...info } = updatedUser._doc;
			res.status(200).json(info);
		} catch (error) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('You can update only your account!');
	}
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
router.delete('/:id', verify, async (req, res) => {
	if (req.user.id === req.params.id || req.user.isAdmin) {
		try {
			const updatedUser = await User.findByIdAndDelete(req.params.id);
			res.status(200).json('User has been deleted!');
		} catch (error) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('You can delete only your account!');
	}
});

// @desc    Get user by ID
// @route   GET /api/users/find/:id
// @access  Public
router.get('/find/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		// Skip sending password back to client
		const { password, ...info } = user._doc;
		res.status(200).json(info);
	} catch (error) {
		res.status(500).json(err);
	}
});

// @desc    Get all users
// @route   GET /api/users/
// @access  Private
router.get('/', verify, async (req, res) => {
	const query = req.query.new;
	if (req.user.id === req.params.id || req.user.isAdmin) {
		try {
			const users = query
				? await User.find().sort({ _id: -1 }).limit(2)
				: await User.find();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('You are not allowed to see all users!');
	}
});

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Public
router.get('/stats', verify, async (req, res) => {
	const today = new Date();
	const lastYear = today.setFullYear(today.setFullYear() - 1);

	const monthsArray = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	try {
		const data = await User.aggregate([
			{
				$project: {
					month: { $month: '$createdAt' },
				},
			},
			{
				$group: {
					_id: '$month',
					total: { $sum: 1 },
				},
			},
		]);

		res.status(200).json(data);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
