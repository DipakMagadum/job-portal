import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('STUDENT');
  const [form, setForm] = useState({
    username: '', email: '', password: '', first_name: '', last_name: '', phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      if (user.role === 'STUDENT') navigate('/jobs');
      else navigate('/recruiter/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const msg = data ? Object.values(data).flat().join(' ') : 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand"><span className="mark" />JobPortal</div>
        <p className="auth-sub">Create an account to get started.</p>

        <div className="role-toggle">
          <button type="button" className={role === 'STUDENT' ? 'active' : ''} onClick={() => setRole('STUDENT')}>
            I'm a Student
          </button>
          <button type="button" className={role === 'RECRUITER' ? 'active' : ''} onClick={() => setRole('RECRUITER')}>
            I'm a Recruiter
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First name</label>
              <input type="text" name="first_name" value={form.first_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last name</label>
              <input type="text" name="last_name" value={form.last_name} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account…' : `Create ${role === 'STUDENT' ? 'student' : 'recruiter'} account`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
