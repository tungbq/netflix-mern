const router = require('express').Router();
const Movie = require('../models/Movie.js');
const verify = require('../utils/verifyToken.js');

// @desc    Create new movie
// @route   POST /api/movies/
// @access  Private/Admin
router.post('/', verify, async (req, res) => {
	if (req.user.isAdmin) {
		const newMovie = new Movie(req.body);

		try {
			const savedMovie = await newMovie.save();
			res.status(200).json(savedMovie);
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json('You are not allowed to create new movie!');
	}
});

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
router.put('/:id', verify, async (req, res) => {
	if (req.user.isAdmin) {
		try {
			const updatedMovie = await Movie.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true }
			);
			res.status(200).json(updatedMovie);
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json('You are not allowed to update movie!');
	}
});

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
router.delete('/:id', verify, async (req, res) => {
	if (req.user.isAdmin) {
		try {
			const updatedMovie = await Movie.findByIdAndDelete(req.params.id);
			res.status(200).json('The movie has been deleted!');
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json('You are not allowed to delete movie!');
	}
});

// @desc    Find movie by ID
// @route   GET /api/movies/find/:id
// @access  Public
router.get('/find/:id', verify, async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id);
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});

// @desc    Find random movies
// @route   GET /api/movies/random || GET /api/movies/random?type=series
// @access  Public
router.get('/random', verify, async (req, res) => {
	const type = req.query.type;
	try {
		if (type === 'series') {
			movie = await Movie.aggregate([
				{ $match: { isSeries: true } },
				{ $sample: { size: 1 } },
			]);
		} else {
			movie = await Movie.aggregate([
				{ $match: { isSeries: false } },
				{ $sample: { size: 1 } },
			]);
		}
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});

// @desc    Find all movies and return from latest
// @route   GET /api/movies/
// @access  Private/Admin
router.get('/', verify, async (req, res) => {
	if (req.user.isAdmin) {
		try {
			const movies = await Movie.find({});
			res.status(200).json(movies.reverse());
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json('You are not allowed to get all movies!');
	}
});

module.exports = router;
