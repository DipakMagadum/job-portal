import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      if (user.role === 'STUDENT') navigate('/jobs');
      else if (user.role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand"><span className="mark" />JobPortal</div>
        <p className="auth-sub">Sign in to continue your job search or hiring pipeline.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} required autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
