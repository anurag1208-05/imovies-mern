const mongoose = require('mongoose');
require('dotenv').config();
const Movie = require('./models/Movie');

const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const shows = () => [
  { date: day(0), time: '10:00 AM', price: 180 },
  { date: day(0), time: '02:30 PM', price: 220 },
  { date: day(0), time: '07:00 PM', price: 250 },
  { date: day(1), time: '06:30 PM', price: 250 },
];

const movies = [
  { title: 'Orbit Run', genre: 'Sci-Fi', language: 'English', duration: 128, rating: 8.1,
    description: 'A rookie pilot races against time to save a failing space station.',
    poster: 'https://placehold.co/300x450/1a1a2e/ffffff?text=Orbit+Run' },
  { title: 'Chai Aur Chaos', genre: 'Comedy', language: 'Hindi', duration: 116, rating: 7.4,
    description: 'Three roommates, one tea stall and a very bad business idea.',
    poster: 'https://placehold.co/300x450/e94560/ffffff?text=Chai+Aur+Chaos' },
  { title: 'The Last Signal', genre: 'Thriller', language: 'English', duration: 134, rating: 8.4,
    description: 'A radio engineer picks up a transmission that should not exist.',
    poster: 'https://placehold.co/300x450/16213e/ffffff?text=The+Last+Signal' },
  { title: 'Monsoon Diaries', genre: 'Drama', language: 'Hindi', duration: 122, rating: 7.9,
    description: 'A heartfelt story of family, distance and one rainy season.',
    poster: 'https://placehold.co/300x450/0f3460/ffffff?text=Monsoon+Diaries' },
  { title: 'Dragon Peak', genre: 'Action', language: 'English', duration: 140, rating: 7.6,
    description: 'An ex-soldier guides a team through a deadly mountain expedition.',
    poster: 'https://placehold.co/300x450/533483/ffffff?text=Dragon+Peak' },
  { title: 'Pixel Pals', genre: 'Animation', language: 'English', duration: 98, rating: 7.8,
    description: 'Arcade characters go on a quest to save their game world.',
    poster: 'https://placehold.co/300x450/2b9348/ffffff?text=Pixel+Pals' },
].map((m) => ({ ...m, shows: shows() }));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies');
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log(`Seeded ${movies.length} movies`);
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
