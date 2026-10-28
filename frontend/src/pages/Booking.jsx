import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';

const rowLetter = (i) => String.fromCharCode(65 + i);

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showId, setShowId] = useState('');
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/movies/${id}`);
      setMovie(data);
      setShowId((cur) => cur || data.shows?.[0]?._id || '');
    } catch (e) {
      setError(errMsg(e));
    }
  };

  useEffect(() => { load(); }, [id]);

  const show = movie?.shows.find((s) => s._id === showId);

  const toggle = (seat) =>
    setSelected((prev) => (prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]));

  const pickShow = (sid) => { setShowId(sid); setSelected([]); setError(''); };

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await api.post('/bookings', { movieId: id, showId, seats: selected });
      navigate('/my-bookings');
    } catch (e) {
      setError(errMsg(e));
      setSelected([]);
      await load(); // refresh seat availability
    } finally {
      setBusy(false);
    }
  };

  if (!movie) return error ? <div className="alert alert-danger">{error}</div> : <p>Loading...</p>;

  return (
    <div className="row g-4">
      <div className="col-md-4">
        <img src={movie.poster} alt={movie.title} className="img-fluid rounded mb-3" />
        <h4>{movie.title}</h4>
        <p className="text-secondary small">
          {movie.genre} • {movie.language} • {movie.duration} min • ⭐ {movie.rating}
        </p>
        <p>{movie.description}</p>
      </div>

      <div className="col-md-8">
        <div className="panel mb-3">
          <h6>Select showtime</h6>
          <div className="d-flex flex-wrap gap-2">
            {movie.shows.map((s) => (
              <button
                key={s._id}
                className={`btn btn-sm ${s._id === showId ? 'btn-warning' : 'btn-outline-light'}`}
                onClick={() => pickShow(s._id)}
              >
                {s.date} • {s.time} • ₹{s.price}
              </button>
            ))}
          </div>
        </div>

        {show && (
          <div className="panel">
            <div className="screen" />
            <p className="text-center text-secondary small">SCREEN THIS WAY</p>

            {Array.from({ length: show.rows }).map((_, r) => (
              <div className="seat-row" key={r}>
                <span className="row-label">{rowLetter(r)}</span>
                {Array.from({ length: show.cols }).map((__, c) => {
                  const seat = `${rowLetter(r)}${c + 1}`;
                  const booked = show.bookedSeats.includes(seat);
                  const isSel = selected.includes(seat);
                  return (
                    <button
                      key={seat}
                      disabled={booked}
                      className={`seat ${booked ? 'booked' : ''} ${isSel ? 'selected' : ''}`}
                      onClick={() => toggle(seat)}
                      title={seat}
                    >
                      {c + 1}
                    </button>
                  );
                })}
              </div>
            ))}

            <div className="legend text-center small text-secondary mt-3">
              <span style={{ background: '#2f3350' }} />Available
              <span style={{ background: '#20c997' }} />Selected
              <span style={{ background: '#7a2e3a' }} />Booked
            </div>

            {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <div className="small text-secondary">
                  {selected.length ? `Seats: ${selected.join(', ')}` : 'No seats selected'}
                </div>
                <div className="fs-5">Total: ₹{selected.length * show.price}</div>
              </div>
              <button
                className="btn btn-warning"
                disabled={!selected.length || busy}
                onClick={confirm}
              >
                {busy ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
