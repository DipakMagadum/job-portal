import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createJob, updateJob, fetchJob } from '../api/endpoints';

const emptyForm = {
  title: '', description: '', requirements: '', skills_required: '', location: '',
  job_type: 'FULL_TIME', salary_min: '', salary_max: '', openings: 1, deadline: '',
};

export default function JobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const companyId = user.recruiter_profile?.company;

  useEffect(() => {
    if (isEdit) {
      fetchJob(id).then(({ data }) => {
        setForm({
          title: data.title, description: data.description, requirements: data.requirements,
          skills_required: data.skills_required, location: data.location, job_type: data.job_type,
          salary_min: data.salary_min || '', salary_max: data.salary_max || '',
          openings: data.openings, deadline: data.deadline || '',
        });
      }).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!companyId && !isEdit) {
      setError('Please set up your company profile before posting a job.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, company: companyId };
      ['salary_min', 'salary_max'].forEach((k) => { if (!payload[k]) delete payload[k]; });
      if (!payload.deadline) delete payload.deadline;

      if (isEdit) {
        await updateJob(id, payload);
      } else {
        await createJob(payload);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Could not save job.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Loading…</div>;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Recruiter · {isEdit ? 'Edit' : 'New'} posting</span>
          <h1>{isEdit ? 'Edit job' : 'Post a new job'}</h1>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Job type</label>
              <select name="job_type" value={form.job_type} onChange={handleChange}>
                <option value="FULL_TIME">Full time</option>
                <option value="PART_TIME">Part time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Min salary (₹/yr)</label>
              <input type="number" name="salary_min" value={form.salary_min} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Max salary (₹/yr)</label>
              <input type="number" name="salary_max" value={form.salary_max} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Openings</label>
              <input type="number" min="1" name="openings" value={form.openings} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Application deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Skills required (comma separated)</label>
            <input type="text" name="skills_required" placeholder="Python, Django, REST APIs" value={form.skills_required} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Requirements</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Post job'}
          </button>
        </form>
      </div>
    </div>
  );
}
