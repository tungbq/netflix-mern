const router = require('express').Router();
const List = require('../models/List.js');
const verify = require('../utils/verifyToken.js');

// @desc    Create new movie list
// @route   POST /api/lists/
// @access  Private/Admin
router.post('/', verify, async (req, res) => {
	if (req.user.isAdmin) {
		const newList = new List(req.body);

		try {
			const savedList = await newList.save();
			res.status(200).json(savedList);
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json('You are not allowed to create new movie list!');
	}
});

// @desc    Delete movie list by ID
// @route   DELETE /api/lists/:id
// @access  Private/Admin
router.delete('/:id', verify, async (req, res) => {
	if (req.user.isAdmin) {
		try {
			await List.findByIdAndDelete(req.params.id);
			res.status(200).json('This list has been deleted!');
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json('You are not allowed to delete movie list!');
	}
});

// @desc    Get all lists
// @route   GET /api/lists/
// @access  Private
router.get('/', verify, async (req, res) => {
	const typeQuery = req.query.type;
	const genreQuery = req.query.genre;

	let list = [];

	try {
		if (typeQuery) {
			if (genreQuery) {
				list = await List.aggregate([
					{ $sample: { size: 10 } },
					{
						$match: { type: typeQuery, genre: genreQuery },
					},
				]);
			} else {
				list = await List.aggregate([
					{ $sample: { size: 10 } },
					{
						$match: { type: typeQuery },
					},
				]);
			}
		} else {
			// Get random 10 items
			list = await List.aggregate([{ $sample: { size: 10 } }]);
		}

		res.status(200).json(list);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
