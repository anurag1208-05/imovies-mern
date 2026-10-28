const express = require('express');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a booking (atomic seat reservation so two users can't take the same seat)
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, showId, seats } = req.body;
    if (!movieId || !showId || !Array.isArray(seats) || seats.length === 0)
      return res.status(400).json({ message: 'movieId, showId and seats are required' });

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    const show = movie.shows.id(showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    const updated = await Movie.findOneAndUpdate(
      {
        _id: movieId,
        shows: { $elemMatch: { _id: showId, bookedSeats: { $nin: seats } } },
      },
      { $addToSet: { 'shows.$.bookedSeats': { $each: seats } } },
      { new: true }
    );

    if (!updated)
      return res.status(409).json({ message: 'One or more seats are already booked' });

    const booking = await Booking.create({
      user: req.userId,
      movie: movieId,
      showId,
      showTime: show.time,
      showDate: show.date,
      seats,
      totalPrice: seats.length * show.price,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logged-in user's bookings
router.get('/mine', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('movie', 'title poster')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking and free the seats
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ message: 'Already cancelled' });

    await Movie.updateOne(
      { _id: booking.movie, 'shows._id': booking.showId },
      { $pull: { 'shows.$.bookedSeats': { $in: booking.seats } } }
    );
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
