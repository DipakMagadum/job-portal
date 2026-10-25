import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe, uploadResume } from '../api/endpoints';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const isStudent = user.role === 'STUDENT';

  const [profile, setProfile] = useState(
    isStudent
      ? {
          college: user.student_profile?.college || '',
          degree: user.student_profile?.degree || '',
          graduation_year: user.student_profile?.graduation_year || '',
          skills: user.student_profile?.skills || '',
          bio: user.student_profile?.bio || '',
          linkedin_url: user.student_profile?.linkedin_url || '',
        }
      : {
          designation: user.recruiter_profile?.designation || '',
        }
  );
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const key = isStudent ? 'student_profile' : 'recruiter_profile';
      await updateMe({ [key]: profile });

      if (isStudent && resumeFile) {
        await uploadResume(resumeFile);
      }
      await refreshUser();
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage('Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">{user.role} · Profile</span>
          <h1>My Profile</h1>
          <p className="subtitle">Keep your details current so the right people can reach you.</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          {message && <div className="success-banner">{message}</div>}
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={user.username} disabled />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="text" value={user.email} disabled />
              </div>
            </div>

            {isStudent ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>College</label>
                    <input type="text" name="college" value={profile.college} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input type="text" name="degree" value={profile.degree} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Graduation year</label>
                    <input type="number" name="graduation_year" value={profile.graduation_year} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input type="url" name="linkedin_url" value={profile.linkedin_url} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Skills (comma separated)</label>
                  <input type="text" name="skills" placeholder="Python, React, SQL" value={profile.skills} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea name="bio" value={profile.bio} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Resume (PDF)</label>
                  <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
                  {user.student_profile?.resume && (
                    <div className="form-help">
                      Current: <a href={user.student_profile.resume} target="_blank" rel="noreferrer" style={{ color: 'var(--teal-dark)' }}>view uploaded resume</a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="form-group">
                <label>Designation</label>
                <input type="text" name="designation" value={profile.designation} onChange={handleChange} placeholder="e.g. Talent Acquisition Manager" />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Account</h3>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            Role: <strong style={{ color: 'var(--ink)' }}>{user.role}</strong><br />
            Joined: {new Date(user.date_joined).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
