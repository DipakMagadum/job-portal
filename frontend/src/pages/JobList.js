import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchJobs } from '../api/endpoints';

const JOB_TYPES = [
  { value: '', label: 'All types' },
  { value: 'FULL_TIME', label: 'Full time' },
  { value: 'PART_TIME', label: 'Part time' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'CONTRACT', label: 'Contract' },
];

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', location: '', job_type: '' });

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.location) params.location = filters.location;
      if (filters.job_type) params.job_type = filters.job_type;
      const { data } = await fetchJobs(params);
      setJobs(data.results || data);
    } catch (e) {
      // silently fail; empty state will show
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(loadJobs, 300);
    return () => clearTimeout(t);
  }, [loadJobs]);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Student · Job Search</span>
          <h1>Find your next role</h1>
          <p className="subtitle">Search open positions posted by verified companies.</p>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search title, skills, keywords…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select value={filters.job_type} onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}>
          {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading jobs…</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state card">
          <h3>No jobs match your filters</h3>
          <p>Try widening your search or checking back later.</p>
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id} className="job-card">
              <div>
                <div className="job-company">{job.company_detail?.name}</div>
                <h3>{job.title}</h3>
                <div className="job-meta">
                  <span>{job.location}</span>
                  <span>{job.job_type.replace('_', ' ')}</span>
                  {job.salary_min && <span>₹{job.salary_min} - ₹{job.salary_max}</span>}
                  <span>{job.applications_count} applicants</span>
                </div>
                {job.skills_required && (
                  <div className="job-skills">
                    {job.skills_required.split(',').slice(0, 5).map((s) => (
                      <span className="skill-chip" key={s}>{s.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                {job.has_applied ? (
                  <span className="status-pill status-SELECTED">Applied</span>
                ) : (
                  <span className="btn btn-outline btn-sm">View →</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
