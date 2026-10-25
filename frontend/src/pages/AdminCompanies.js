import React, { useEffect, useState } from 'react';
import { fetchCompanies, approveCompany } from '../api/endpoints';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    fetchCompanies().then(({ data }) => setCompanies(data.results || data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = async (id) => {
    await approveCompany(id);
    load();
  };

  const filtered = companies.filter((c) => {
    if (filter === 'pending') return !c.is_approved;
    if (filter === 'approved') return c.is_approved;
    return true;
  });

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin · Companies</span>
          <h1>Company Approvals</h1>
          <p className="subtitle">Review and approve recruiter-submitted companies before their jobs go live.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="all">All companies</option>
          <option value="pending">Pending only</option>
          <option value="approved">Approved only</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card"><h3>No companies found</h3></div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>Name</th><th>Industry</th><th>Location</th><th>Submitted by</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.industry || '—'}</td>
                  <td>{c.location || '—'}</td>
                  <td>{c.created_by_username}</td>
                  <td>
                    <span className={`status-pill ${c.is_approved ? 'status-OPEN' : ''}`} style={!c.is_approved ? { background: 'var(--amber-tint)', color: '#96660E' } : {}}>
                      {c.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {!c.is_approved && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleApprove(c.id)}>Approve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
