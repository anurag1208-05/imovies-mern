import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/bookings/mine');
      setBookings(data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <>
      <h3 className="mb-4">My Bookings</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-secondary">Loading...</p>}
      {!loading && bookings.length === 0 && <p className="text-secondary">No bookings yet.</p>}

      <div className="d-flex flex-column gap-3">
        {bookings.map((b) => (
          <div key={b._id} className="panel d-flex flex-wrap gap-3 align-items-center">
            <img
              src={b.movie?.poster}
              alt=""
              style={{ width: 70, height: 100, objectFit: 'cover', borderRadius: 8 }}
            />
            <div className="flex-grow-1">
              <h6 className="mb-1">{b.movie?.title}</h6>
              <div className="small text-secondary">
                {b.showDate} • {b.showTime}
              </div>
              <div className="small">Seats: {b.seats.join(', ')}</div>
              <div className="small">Total: ₹{b.totalPrice}</div>
            </div>
            <div className="text-end">
              <span className={`badge ${b.status === 'confirmed' ? 'bg-success' : 'bg-secondary'}`}>
                {b.status}
              </span>
              {b.status === 'confirmed' && (
                <div>
                  <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => cancel(b._id)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
