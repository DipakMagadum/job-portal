import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CompanyProfile from './pages/CompanyProfile';
import MyJobs from './pages/MyJobs';
import JobForm from './pages/JobForm';
import JobApplicants from './pages/JobApplicants';
import AdminDashboard from './pages/AdminDashboard';
import AdminCompanies from './pages/AdminCompanies';
import AdminUsers from './pages/AdminUsers';

import './styles/global.css';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-state">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'STUDENT') return <Navigate to="/jobs" replace />;
  if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
}

function AppRoutes() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student module */}
        <Route path="/jobs" element={<ProtectedRoute allowedRoles={['STUDENT']}><JobList /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute allowedRoles={['STUDENT']}><JobDetail /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute allowedRoles={['STUDENT']}><MyApplications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['STUDENT', 'RECRUITER']}><Profile /></ProtectedRoute>} />

        {/* Recruiter module */}
        <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/company" element={<ProtectedRoute allowedRoles={['RECRUITER']}><CompanyProfile /></ProtectedRoute>} />
        <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={['RECRUITER']}><MyJobs /></ProtectedRoute>} />
        <Route path="/recruiter/jobs/new" element={<ProtectedRoute allowedRoles={['RECRUITER']}><JobForm /></ProtectedRoute>} />
        <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute allowedRoles={['RECRUITER']}><JobForm /></ProtectedRoute>} />
        <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoute allowedRoles={['RECRUITER']}><JobApplicants /></ProtectedRoute>} />

        {/* Admin module */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCompanies /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
