import api from './axios';

// ---------- Auth ----------
export const registerUser = (payload) => api.post('/auth/register/', payload);
export const loginUser = (payload) => api.post('/auth/login/', payload);
export const fetchMe = () => api.get('/auth/me/');
export const updateMe = (payload) => api.patch('/auth/me/', payload);
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/auth/resume/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ---------- Admin ----------
export const fetchAdminStats = () => api.get('/auth/admin/stats/');
export const fetchAdminUsers = (role) => api.get('/auth/admin/users/', { params: role ? { role } : {} });
export const toggleUserActive = (userId) => api.post(`/auth/admin/users/${userId}/toggle-active/`);

// ---------- Companies ----------
export const fetchCompanies = (params) => api.get('/companies/', { params });
export const fetchCompany = (id) => api.get(`/companies/${id}/`);
export const createCompany = (payload) => api.post('/companies/', payload);
export const updateCompany = (id, payload) => api.patch(`/companies/${id}/`, payload);
export const approveCompany = (id) => api.post(`/companies/${id}/approve/`);

// ---------- Jobs ----------
export const fetchJobs = (params) => api.get('/jobs/', { params });
export const fetchJob = (id) => api.get(`/jobs/${id}/`);
export const createJob = (payload) => api.post('/jobs/', payload);
export const updateJob = (id, payload) => api.patch(`/jobs/${id}/`, payload);
export const deleteJob = (id) => api.delete(`/jobs/${id}/`);
export const fetchMyPostedJobs = () => api.get('/jobs/', { params: { mine: 'true' } });

// ---------- Applications ----------
export const fetchApplications = (params) => api.get('/applications/', { params });
export const applyToJob = (payload) => api.post('/applications/', payload);
export const updateApplicationStatus = (id, payload) => api.patch(`/applications/${id}/update_status/`, payload);
export const withdrawApplication = (id) => api.post(`/applications/${id}/withdraw/`);
