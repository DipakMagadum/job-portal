import React, { useEffect, useState } from 'react';
import { fetchAdminStats } from '../api/endpoints';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats().then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard…</div>;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin · Overview</span>
          <h1>Platform Dashboard</h1>
          <p className="subtitle">A bird's-eye view of activity across the portal.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="value">{stats.total_students}</div><div className="label">Students</div></div>
        <div className="stat-card"><div className="value">{stats.total_recruiters}</div><div className="label">Recruiters</div></div>
        <div className="stat-card"><div className="value">{stats.total_companies}</div><div className="label">Companies</div></div>
        <div className="stat-card"><div className="value">{stats.pending_companies}</div><div className="label">Pending approval</div></div>
        <div className="stat-card"><div className="value">{stats.total_jobs}</div><div className="label">Jobs posted</div></div>
        <div className="stat-card"><div className="value">{stats.open_jobs}</div><div className="label">Currently open</div></div>
        <div className="stat-card"><div className="value">{stats.total_applications}</div><div className="label">Applications</div></div>
      </div>

      <div className="card">
        <h3>Applications by status</h3>
        {stats.applications_by_status.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No applications submitted yet.</p>
        ) : (
          <table>
            <thead><tr><th>Status</th><th>Count</th></tr></thead>
            <tbody>
              {stats.applications_by_status.map((row) => (
                <tr key={row.status}><td><span className={`status-pill status-${row.status}`}>{row.status}</span></td><td>{row.count}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
