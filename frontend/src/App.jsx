import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Movies from './pages/Movies.jsx';
import Booking from './pages/Booking.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <Link className="navbar-brand text-warning" to="/">🎬 IMovies</Link>
        <div className="ms-auto d-flex align-items-center gap-3">
          {user ? (
            <>
              <Link className="nav-link text-light" to="/my-bookings">My Bookings</Link>
              <span className="text-secondary small">Hi, {user.name}</span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => { logout(); navigate('/'); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link text-light" to="/login">Login</Link>
              <Link className="btn btn-warning btn-sm" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<Protected><Booking /></Protected>} />
          <Route path="/my-bookings" element={<Protected><MyBookings /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
