import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyPostedJobs, fetchApplications } from '../api/endpoints';
import { StatusPill } from '../components/StatusPill';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMyPostedJobs(), fetchApplications()])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data.results || jobsRes.data);
        setApplications(appsRes.data.results || appsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const openJobs = jobs.filter((j) => j.status === 'OPEN').length;
  const recentApps = [...applications].slice(0, 6);

  if (loading) return <div className="loading-state">Loading dashboard…</div>;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Recruiter · Overview</span>
          <h1>Hiring Dashboard</h1>
          <p className="subtitle">A snapshot of your open roles and incoming candidates.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary">+ Post a job</Link>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="value">{jobs.length}</div><div className="label">Jobs posted</div></div>
        <div className="stat-card"><div className="value">{openJobs}</div><div className="label">Currently open</div></div>
        <div className="stat-card"><div className="value">{applications.length}</div><div className="label">Total applicants</div></div>
        <div className="stat-card"><div className="value">{applications.filter(a => a.status === 'SHORTLISTED').length}</div><div className="label">Shortlisted</div></div>
      </div>

      <div className="two-col">
        <div>
          <h3>Your job postings</h3>
          {jobs.length === 0 ? (
            <div className="empty-state card">
              <h3>No jobs posted yet</h3>
              <p>Post your first job to start receiving applications.</p>
              <Link to="/recruiter/jobs/new" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-flex' }}>Post a job</Link>
            </div>
          ) : (
            <div className="job-grid">
              {jobs.slice(0, 5).map((job) => (
                <Link to={`/recruiter/jobs/${job.id}/applicants`} className="job-card" key={job.id}>
                  <div>
                    <h3>{job.title}</h3>
                    <div className="job-meta"><span>{job.location}</span><span>{job.applications_count} applicants</span></div>
                  </div>
                  <StatusPill status={job.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3>Recent applicants</h3>
          <div className="card">
            {recentApps.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>No applications yet.</p>
            ) : (
              recentApps.map((app) => (
                <div key={app.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{app.student_name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{app.job_detail?.title}</div>
                  <StatusPill status={app.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
