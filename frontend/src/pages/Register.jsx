import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="panel form-card" onSubmit={submit}>
      <h4 className="mb-3">Create account</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        className="form-control mb-3"
        placeholder="Full name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="form-control mb-3"
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="form-control mb-3"
        type="password"
        placeholder="Password (min 6 characters)"
        minLength={6}
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="btn btn-warning w-100">Sign up</button>
      <p className="small text-secondary mt-3 mb-0">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
