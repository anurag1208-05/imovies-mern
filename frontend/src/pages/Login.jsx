import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="panel form-card" onSubmit={submit}>
      <h4 className="mb-3">Login</h4>
      {error && <div className="alert alert-danger">{error}</div>}
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
        placeholder="Password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="btn btn-warning w-100">Login</button>
      <p className="small text-secondary mt-3 mb-0">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
