const router = require('express').Router();
const Movie = require('../models/Movie.js');
const verify = require('../utils/verifyToken.js');

// Create
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

// Create
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
		res.status(403).json('You are not allowed to update new movie!');
	}
});

// Delete
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

// Get
router.get('/find/:id', verify, async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id);
		res.status(200).json(movie);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get random
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

// Get all
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
