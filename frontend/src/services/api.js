import axios from 'axios';

// ─── Base Config ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — Attach JWT ────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobportal_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Handle 401 / 403 ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('jobportal_token');
      localStorage.removeItem('jobportal_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth Services ────────────────────────────────────────────────────────────
export const authService = {
  login:  (data)   => api.post('/auth/login', data),
  signup: (data)   => api.post('/auth/signup', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
};

// ─── Job Services ─────────────────────────────────────────────────────────────
export const jobService = {
  getAll:          ()              => api.get('/jobs'),
  getById:         (id)           => api.get(`/jobs/${id}`),
  search:          (title)        => api.get('/jobs/search', { params: { title } }),
  getByCompany:    (companyId)    => api.get(`/jobs/company/${companyId}`),
  post:            (data, companyId) => api.post(`/jobs/post?companyId=${companyId}`, data),
  update:          (id, data)     => api.put(`/jobs/${id}`, data),
  delete:          (id)           => api.delete(`/jobs/${id}`),
  incrementViews:  (id)           => api.post(`/jobs/${id}/view`),
};

// ─── Application Services ─────────────────────────────────────────────────────
export const applicationService = {
  apply:             (data)        => api.post('/applications/apply', data),
  getByCandidate:    (userId)      => api.get(`/applications/candidate/${userId}`),
  getByCompany:      (companyId)   => api.get(`/applications/company/${companyId}`),
  updateStatus:      (id, status)  => api.patch(`/applications/${id}/status?status=${status}`),
};

// ─── Company Services ─────────────────────────────────────────────────────────
export const companyService = {
  setup:        (data)    => api.post('/companies/setup', data),
  getById:      (id)      => api.get(`/companies/${id}`),
  getByOwnerId: (userId)  => api.get(`/companies/owner/${userId}`),
};

// ─── Admin Services ───────────────────────────────────────────────────────────
export const adminService = {
  getAllUsers:  ()   => api.get('/admin/users'),
  deleteUser:  (id) => api.delete(`/admin/users/${id}`),
  toggleBlock: (id) => api.put(`/admin/users/${id}/block`),
  updateRole:  (id, role) => api.put(`/admin/users/${id}/role`, null, { params: { role } }),
  
  // Companies
  getAllCompanies: () => api.get('/admin/companies'),
  updateCompanyStatus: (id, status) => api.put(`/admin/companies/${id}/status`, null, { params: { status } }),
  
  // Jobs
  getAllJobs: () => api.get('/admin/jobs'),
  updateJobStatus: (id, status) => api.put(`/admin/jobs/${id}/status`, null, { params: { status } }),
  deleteJob:   (id) => api.delete(`/admin/jobs/${id}`),
  
  // Applications & Reports
  getAllApplications: () => api.get('/admin/applications'),
  getReports:        () => api.get('/admin/reports'),
  getUsersByRole:    () => api.get('/admin/reports/users-by-role'),
  getJobsByIndustry: () => api.get('/admin/reports/jobs-by-industry'),
  getApplicationsSummary: () => api.get('/admin/reports/applications-summary'),
};

export default api;
