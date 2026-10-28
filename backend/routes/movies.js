const express = require('express');
const Movie = require('../models/Movie');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: 'Invalid movie id' });
  }
});

module.exports = router;
