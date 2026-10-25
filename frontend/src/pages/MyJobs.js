import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyPostedJobs, updateJob, deleteJob } from '../api/endpoints';
import { StatusPill } from '../components/StatusPill';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchMyPostedJobs().then(({ data }) => setJobs(data.results || data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleStatus = async (job) => {
    await updateJob(job.id, { status: job.status === 'OPEN' ? 'CLOSED' : 'OPEN' });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return;
    await deleteJob(id);
    load();
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Recruiter · Postings</span>
          <h1>My Jobs</h1>
          <p className="subtitle">Manage your open roles and review applicants.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary">+ Post a job</Link>
      </div>

      {loading ? (
        <div className="loading-state">Loading…</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state card">
          <h3>No jobs posted yet</h3>
          <p>Post your first job to start receiving applications.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Location</th><th>Type</th><th>Applicants</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td><Link to={`/recruiter/jobs/${job.id}/applicants`} style={{ fontWeight: 600 }}>{job.title}</Link></td>
                  <td>{job.location}</td>
                  <td>{job.job_type.replace('_', ' ')}</td>
                  <td>{job.applications_count}</td>
                  <td><StatusPill status={job.status} /></td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn-outline btn-sm" style={{ marginRight: 6 }}>Edit</Link>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(job)} style={{ marginRight: 6 }}>
                      {job.status === 'OPEN' ? 'Close' : 'Reopen'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>Delete</button>
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
