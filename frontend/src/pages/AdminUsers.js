import React, { useEffect, useState } from 'react';
import { fetchAdminUsers, toggleUserActive } from '../api/endpoints';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  const load = () => {
    setLoading(true);
    fetchAdminUsers(role).then(({ data }) => setUsers(data.results || data)).finally(() => setLoading(false));
  };

  useEffect(load, [role]);

  const handleToggle = async (id) => {
    await toggleUserActive(id);
    load();
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin · Users</span>
          <h1>User Management</h1>
          <p className="subtitle">Suspend or reinstate student and recruiter accounts.</p>
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">All roles</option>
          <option value="STUDENT">Students</option>
          <option value="RECRUITER">Recruiters</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className="status-pill status-APPLIED">{u.role}</span></td>
                  <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-pill ${u.is_active !== false ? 'status-OPEN' : 'status-CLOSED'}`}>
                      {u.is_active !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {u.role !== 'ADMIN' && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleToggle(u.id)}>
                        {u.is_active !== false ? 'Suspend' : 'Reinstate'}
                      </button>
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
