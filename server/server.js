import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { sanitizeMiddleware } from './middleware/sanitize.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import clinicRoutes from './routes/clinic.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import patientRoutes from './routes/patient.routes.js';
import integrationRoutes from './routes/integration.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import medicineRoutes from './routes/medicine.routes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Input sanitization to prevent NoSQL injection
app.use(sanitizeMiddleware);

// CSRF protection for routes that modify data
const csrfProtection = csrf({ cookie: true });

// Rate limiting
app.use('/api/', rateLimiter);

// Health check endpoint (no CSRF needed for GET)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// API Routes - Apply CSRF protection to state-changing operations
app.use('/api/auth', authRoutes);
app.use('/api/clinics', csrfProtection, clinicRoutes);
app.use('/api/appointments', csrfProtection, appointmentRoutes);
app.use('/api/patients', csrfProtection, patientRoutes);
app.use('/api/integrations', csrfProtection, integrationRoutes);
app.use('/api/pharmacies', csrfProtection, pharmacyRoutes);
app.use('/api/medicines', csrfProtection, medicineRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
