import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJob, fetchApplications, updateApplicationStatus } from '../api/endpoints';
import { StatusPill } from '../components/StatusPill';

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];

export default function JobApplicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchJob(id),
      fetchApplications({ job: id, ...(statusFilter ? { status: statusFilter } : {}) }),
    ]).then(([jobRes, appsRes]) => {
      setJob(jobRes.data);
      setApplications(appsRes.data.results || appsRes.data);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [id, statusFilter]);

  const handleStatusChange = async (appId, status) => {
    await updateApplicationStatus(appId, { status });
    load();
  };

  if (loading && !job) return <div className="loading-state">Loading applicants…</div>;

  return (
    <div className="container">
      <Link to="/recruiter/jobs" className="btn btn-outline btn-sm" style={{ marginBottom: 20, display: 'inline-flex' }}>← Back to my jobs</Link>

      <div className="page-header">
        <div>
          <span className="eyebrow">Recruiter · Applicants</span>
          <h1>{job?.title}</h1>
          <p className="subtitle">{applications.length} applicant{applications.length !== 1 ? 's' : ''} for this role.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state card">
          <h3>No applicants yet</h3>
          <p>Share the job listing to start receiving applications.</p>
        </div>
      ) : (
        <div className="job-grid">
          {applications.map((app) => (
            <div className="job-card" key={app.id}>
              <div style={{ flex: 1 }}>
                <h3>{app.student_name}</h3>
                <div className="job-meta">
                  <span>{app.student_email}</span>
                  <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                </div>
                {app.student_skills && (
                  <div className="job-skills">
                    {app.student_skills.split(',').filter(Boolean).map((s) => (
                      <span className="skill-chip" key={s}>{s.trim()}</span>
                    ))}
                  </div>
                )}
                {app.cover_letter && (
                  <p style={{ marginTop: 10, fontSize: 13.5, color: 'var(--ink-soft)' }}>{app.cover_letter}</p>
                )}
                {app.resume && (
                  <a href={app.resume} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 10, display: 'inline-flex' }}>
                    View resume ↗
                  </a>
                )}
              </div>
              <div style={{ textAlign: 'right', minWidth: 160 }}>
                <StatusPill status={app.status} />
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  style={{ marginTop: 10, fontSize: 13 }}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
