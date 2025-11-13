import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClinicDashboard from './pages/ClinicDashboard';
import ClinicSettings from './pages/ClinicSettings';
import PatientBooking from './pages/PatientBooking';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import PharmacyDashboard from './pages/PharmacyDashboard';
import MedicineInventory from './pages/MedicineInventory';
import PharmacyFinder from './pages/PharmacyFinder';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <TenantProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ClinicDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute roles={['admin', 'clinic_staff']}>
                      <Layout>
                        <ClinicSettings />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PatientBooking />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/appointment/:id/confirmation"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AppointmentConfirmation />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy/dashboard"
                  element={
                    <ProtectedRoute roles={['admin', 'pharmacy_staff']}>
                      <Layout>
                        <PharmacyDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy/inventory"
                  element={
                    <ProtectedRoute roles={['admin', 'pharmacy_staff']}>
                      <Layout>
                        <MedicineInventory />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pharmacy/finder"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PharmacyFinder />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* 404 redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <ToastContainer position="top-right" autoClose={3000} />
            </TenantProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
