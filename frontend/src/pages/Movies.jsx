import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/movies', { params: { search } });
        setMovies(data);
        setError('');
      } catch (e) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h3 className="m-0">Now Showing</h3>
        <input
          className="form-control w-auto"
          style={{ minWidth: 240 }}
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-secondary">Loading...</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-secondary">No movies found. Run <code>npm run seed</code> in the backend.</p>
      )}

      <div className="row g-4">
        {movies.map((m) => (
          <div className="col-6 col-md-4 col-lg-3" key={m._id}>
            <div className="card movie-card h-100 text-light">
              <img src={m.poster} className="card-img-top" alt={m.title} />
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">{m.title}</h6>
                <p className="small text-secondary mb-1">
                  {m.genre} • {m.language} • {m.duration} min
                </p>
                <p className="small mb-3">⭐ {m.rating}</p>
                <Link to={`/movie/${m._id}`} className="btn btn-warning btn-sm mt-auto">
                  Book Tickets
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
