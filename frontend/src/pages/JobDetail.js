import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJob, applyToJob } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJob(id).then(({ data }) => setJob(data)).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');
    try {
      await applyToJob({ job: job.id, cover_letter: coverLetter });
      setMessage('Application submitted successfully!');
      setJob({ ...job, has_applied: true });
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Could not submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading-state">Loading job…</div>;
  if (!job) return <div className="container"><div className="empty-state card"><h3>Job not found</h3></div></div>;

  return (
    <div className="container">
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Back</button>

      <div className="two-col">
        <div>
          <div className="card">
            <span className="eyebrow">{job.company_detail?.name}</span>
            <h1>{job.title}</h1>
            <div className="job-meta" style={{ marginBottom: 16 }}>
              <span>{job.location}</span>
              <span>{job.job_type.replace('_', ' ')}</span>
              <span className={`status-pill status-${job.status}`}>{job.status}</span>
              {job.deadline && <span>Apply by {job.deadline}</span>}
            </div>

            <h3>Description</h3>
            <p style={{ whiteSpace: 'pre-line', color: 'var(--ink-soft)' }}>{job.description}</p>

            {job.requirements && (
              <>
                <h3>Requirements</h3>
                <p style={{ whiteSpace: 'pre-line', color: 'var(--ink-soft)' }}>{job.requirements}</p>
              </>
            )}

            {job.skills_required && (
              <>
                <h3>Skills</h3>
                <div className="job-skills">
                  {job.skills_required.split(',').map((s) => (
                    <span className="skill-chip" key={s}>{s.trim()}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h3>About {job.company_detail?.name}</h3>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>{job.company_detail?.description || 'No description provided.'}</p>
            {job.company_detail?.website && (
              <p style={{ fontSize: 14 }}>
                <a href={job.company_detail.website} target="_blank" rel="noreferrer" style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>
                  Visit website ↗
                </a>
              </p>
            )}
          </div>

          {user?.role === 'STUDENT' && (
            <div className="card">
              <h3>Apply for this role</h3>
              {message && <div className="success-banner">{message}</div>}
              {error && <div className="error-banner">{error}</div>}
              {job.has_applied ? (
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                  You've already applied to this job. Track it from "My Applications".
                </p>
              ) : job.status !== 'OPEN' ? (
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>This job is closed for applications.</p>
              ) : (
                <form onSubmit={handleApply}>
                  <div className="form-group">
                    <label>Cover letter (optional)</label>
                    <textarea
                      placeholder="Tell the recruiter why you're a great fit…"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                    <div className="form-help">Your uploaded resume from your profile will be attached automatically.</div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" disabled={applying}>
                    {applying ? 'Submitting…' : 'Submit application'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
