# IMovies - Movie Ticket Booking

MERN stack app: browse movies, pick a showtime, select seats with live availability, and manage bookings. JWT authentication.

## Tech
- Frontend: React (Vite), React Router, Bootstrap, Axios
- Backend: Node.js, Express.js, JWT, bcryptjs
- Database: MongoDB (Mongoose)

## Features
- Register / login with JWT
- Browse and search movies
- Multiple showtimes per movie
- Seat map with booked / selected / available states
- Atomic seat reservation (double booking is blocked server-side)
- My Bookings page with cancel (seats are freed)

## Setup

Requirements: Node.js 16+, MongoDB running locally (or a MongoDB Atlas URI).

### Backend
```
cd backend
npm install
cp .env.example .env     # edit JWT_SECRET and MONGO_URI if needed
npm run seed             # adds sample movies
npm run dev              # http://localhost:5000
```

### Frontend
```
cd frontend
npm install
npm run dev              # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`.
For production, set `VITE_API_URL` to your deployed backend URL (e.g. `https://your-api.onrender.com/api`).

## API
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/movies?search= | No | List / search movies |
| GET | /api/movies/:id | No | Movie with shows and booked seats |
| POST | /api/bookings | Yes | Book seats `{ movieId, showId, seats[] }` |
| GET | /api/bookings/mine | Yes | My bookings |
| DELETE | /api/bookings/:id | Yes | Cancel booking |

## Project Structure
```
imovies/
  backend/   server.js, models/, routes/, middleware/, seed.js
  frontend/  src/pages, src/api.js, src/AuthContext.jsx
```
