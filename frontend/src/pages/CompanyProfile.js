import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchCompany, createCompany, updateCompany } from '../api/endpoints';

export default function CompanyProfile() {
  const { user, refreshUser } = useAuth();
  const existingCompanyId = user.recruiter_profile?.company;
  const [company, setCompany] = useState({
    name: '', description: '', website: '', industry: '', location: '',
  });
  const [companyId, setCompanyId] = useState(existingCompanyId);
  const [loading, setLoading] = useState(!!existingCompanyId);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingCompanyId) {
      fetchCompany(existingCompanyId)
        .then(({ data }) => { setCompany(data); setCompanyId(data.id); })
        .finally(() => setLoading(false));
    }
  }, [existingCompanyId]);

  const handleChange = (e) => setCompany({ ...company, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        name: company.name, description: company.description, website: company.website,
        industry: company.industry, location: company.location,
      };
      if (companyId) {
        const { data } = await updateCompany(companyId, payload);
        setCompany(data);
      } else {
        const { data } = await createCompany(payload);
        setCompany(data);
        setCompanyId(data.id);
        await refreshUser();
      }
      setMessage('Company profile saved.');
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'Could not save company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Loading company…</div>;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Recruiter · Company</span>
          <h1>Company Profile</h1>
          <p className="subtitle">This is what candidates see on every job listing.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {message && <div className="success-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}
        {companyId && !company.is_approved && (
          <div className="error-banner" style={{ background: 'var(--amber-tint)', color: '#96660E' }}>
            Pending admin approval — your jobs won't be publicly visible until this company is approved.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company name</label>
            <input type="text" name="name" value={company.name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Industry</label>
              <input type="text" name="industry" value={company.industry} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={company.location} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="url" name="website" value={company.website} onChange={handleChange} placeholder="https://" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={company.description} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : companyId ? 'Update company' : 'Create company'}
          </button>
        </form>
      </div>
    </div>
  );
}
