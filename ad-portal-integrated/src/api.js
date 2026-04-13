// ─── API Service Layer ────────────────────────────────────────────────────────
// All calls go to the backend at BASE_URL.
// Token is read from localStorage on every call so it's always fresh.

const BASE_URL = import.meta.env.VITE_API_URL || 'https://ad-portal-gr17.vercel.app/api';

// ── Token helpers ──────────────────────────────────────────────────────────
export const getToken   = () => localStorage.getItem('token');
export const setToken   = (t) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

// ── Core fetch wrapper ─────────────────────────────────────────────────────
async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};

  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: payload, auth: false }),

  login: (payload) =>
    request('/auth/login', { method: 'POST', body: payload, auth: false }),

  getMe: () => request('/auth/me'),

  changePassword: (payload) =>
    request('/auth/change-password', { method: 'PUT', body: payload }),
};

// ─── Ads ───────────────────────────────────────────────────────────────────
export const adAPI = {
  // User: submit a new ad
  create: (payload) =>
    request('/ads', { method: 'POST', body: payload }),

  // User: get own ads
  getMyAds: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/ads/my${qs ? `?${qs}` : ''}`);
  },

  // Admin: get all ads with optional filters
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/ads${qs ? `?${qs}` : ''}`);
  },

  // Shared: get single ad
  getById: (id) => request(`/ads/${id}`),

  // Admin: update status (approve/reject)
  updateStatus: (id, payload) =>
    request(`/ads/${id}/status`, { method: 'PATCH', body: payload }),

   // PUT /api/ads/:id  — multipart/form-data
  update: (id, formData) =>
  request(`/ads/${id}`, { method: 'PUT', body: formData }),

  // User/Admin: delete ad
  delete: (id) => request(`/ads/${id}`, { method: 'DELETE' }),
};

// ─── Users (admin) ────────────────────────────────────────────────────────
export const userAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/users${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => request(`/users/${id}`),

  toggleStatus: (id) =>
    request(`/users/${id}/status`, { method: 'PATCH' }),

  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Own profile update
  updateProfile: (payload) =>
    request('/users/profile', { method: 'PUT', body: payload }),
};
