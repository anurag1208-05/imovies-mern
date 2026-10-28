const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  time: { type: String, required: true },
  date: { type: String, required: true },
  price: { type: Number, default: 200 },
  rows: { type: Number, default: 6 },
  cols: { type: Number, default: 10 },
  bookedSeats: { type: [String], default: [] },
});

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    genre: String,
    language: String,
    duration: Number,
    rating: Number,
    poster: String,
    shows: [showSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
