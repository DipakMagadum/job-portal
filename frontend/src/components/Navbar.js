import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linksByRole = {
    STUDENT: [
      { to: '/jobs', label: 'Browse Jobs' },
      { to: '/my-applications', label: 'My Applications' },
      { to: '/profile', label: 'Profile' },
    ],
    RECRUITER: [
      { to: '/recruiter/dashboard', label: 'Dashboard' },
      { to: '/recruiter/company', label: 'Company' },
      { to: '/recruiter/jobs', label: 'My Jobs' },
    ],
    ADMIN: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/companies', label: 'Companies' },
      { to: '/admin/users', label: 'Users' },
    ],
  };

  const links = linksByRole[user.role] || [];

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <span className="mark" />
        JobPortal
      </div>
      <div className="navbar-links">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
      <div className="navbar-right">
        <span className="role-badge">{user.role}</span>
        <span style={{ fontSize: 13, opacity: 0.85 }}>{user.username}</span>
        <button className="btn-ghost-nav" onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}
