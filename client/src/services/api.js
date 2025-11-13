import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Show error toast
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (userData) => axiosInstance.put('/auth/profile', userData),
  refreshToken: () => axiosInstance.post('/auth/refresh'),
};

// Clinic API
export const clinicApi = {
  getAll: () => axiosInstance.get('/clinics'),
  getById: (id) => axiosInstance.get(`/clinics/${id}`),
  create: (data) => axiosInstance.post('/clinics', data),
  update: (id, data) => axiosInstance.put(`/clinics/${id}`, data),
  delete: (id) => axiosInstance.delete(`/clinics/${id}`),
  updateApiKeys: (id, keys) => axiosInstance.put(`/clinics/${id}/api-keys`, keys),
  getSettings: (id) => axiosInstance.get(`/clinics/${id}/settings`),
};

// Appointment API
export const appointmentApi = {
  getAll: (params) => axiosInstance.get('/appointments', { params }),
  getById: (id) => axiosInstance.get(`/appointments/${id}`),
  create: (data) => axiosInstance.post('/appointments', data),
  update: (id, data) => axiosInstance.put(`/appointments/${id}`, data),
  cancel: (id, reason) => axiosInstance.delete(`/appointments/${id}`, { data: { reason } }),
  getAvailableSlots: (params) => axiosInstance.get('/appointments/slots', { params }),
  generatePDF: (id) => axiosInstance.post(`/appointments/${id}/pdf`),
};

// Patient API
export const patientApi = {
  getAll: () => axiosInstance.get('/patients'),
  getById: (id) => axiosInstance.get(`/patients/${id}`),
  create: (data) => axiosInstance.post('/patients', data),
  update: (id, data) => axiosInstance.put(`/patients/${id}`, data),
  delete: (id) => axiosInstance.delete(`/patients/${id}`),
  getAppointments: (id) => axiosInstance.get(`/patients/${id}/appointments`),
};

// Pharmacy API
export const pharmacyApi = {
  getAll: (params) => axiosInstance.get('/pharmacies', { params }),
  getById: (id) => axiosInstance.get(`/pharmacies/${id}`),
  create: (data) => axiosInstance.post('/pharmacies', data),
  update: (id, data) => axiosInstance.put(`/pharmacies/${id}`, data),
  delete: (id) => axiosInstance.delete(`/pharmacies/${id}`),
  searchNearby: (params) => axiosInstance.get('/pharmacies/nearby', { params }),
};

// Medicine API
export const medicineApi = {
  getAll: (params) => axiosInstance.get('/medicines', { params }),
  getById: (id) => axiosInstance.get(`/medicines/${id}`),
  create: (data) => axiosInstance.post('/medicines', data),
  update: (id, data) => axiosInstance.put(`/medicines/${id}`, data),
  delete: (id) => axiosInstance.delete(`/medicines/${id}`),
  updateStock: (id, data) => axiosInstance.patch(`/medicines/${id}/stock`, data),
  getLowStock: (params) => axiosInstance.get('/medicines/low-stock', { params }),
  getExpired: (params) => axiosInstance.get('/medicines/expired', { params }),
};

// Integration API
export const integrationApi = {
  sendWhatsApp: (data) => axiosInstance.post('/integrations/whatsapp/send', data),
  sendEmail: (data) => axiosInstance.post('/integrations/email/send', data),
  sendInstagram: (data) => axiosInstance.post('/integrations/instagram/send', data),
  createRazorpayOrder: (data) => axiosInstance.post('/integrations/razorpay/order', data),
  verifyRazorpayPayment: (data) => axiosInstance.post('/integrations/razorpay/verify', data),
  getRazorpayConfig: () => axiosInstance.get('/integrations/razorpay/config'),
  createRefund: (data) => axiosInstance.post('/integrations/razorpay/refund', data),
};

export default axiosInstance;
