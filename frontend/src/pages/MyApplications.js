import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApplications, withdrawApplication } from '../api/endpoints';
import { ApplicationPipeline, StatusPill } from '../components/StatusPill';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchApplications().then(({ data }) => setApps(data.results || data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    await withdrawApplication(id);
    load();
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Student · Tracking</span>
          <h1>My Applications</h1>
          <p className="subtitle">Track where each application stands in the hiring pipeline.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : apps.length === 0 ? (
        <div className="empty-state card">
          <h3>No applications yet</h3>
          <p>Browse open jobs and apply to start tracking your progress here.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-flex' }}>Browse jobs</Link>
        </div>
      ) : (
        <div className="job-grid">
          {apps.map((app) => (
            <div className="job-card" key={app.id}>
              <div style={{ flex: 1 }}>
                <div className="job-company">{app.job_detail?.company_detail?.name}</div>
                <h3><Link to={`/jobs/${app.job}`}>{app.job_detail?.title}</Link></h3>
                <div className="job-meta">
                  <span>{app.job_detail?.location}</span>
                  <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                </div>
                <div style={{ marginTop: 12, maxWidth: 320 }}>
                  <ApplicationPipeline status={app.status} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusPill status={app.status} />
                {['APPLIED', 'SHORTLISTED', 'INTERVIEW'].includes(app.status) && (
                  <div style={{ marginTop: 10 }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleWithdraw(app.id)}>Withdraw</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
