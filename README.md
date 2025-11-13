# MERN Multi-Tenant CRM for Medical Clinics and Hospitals

A comprehensive multi-tenant CRM web application built with the MERN stack (MongoDB, Express.js, React, Node.js) specifically designed for medical clinics and hospitals.

## Features

### Core Features
- **Multi-Tenant Architecture**: Complete tenant isolation with secure data segregation
- **Role-Based Access Control**: Admin, clinic staff, patient, and pharmacy staff roles
- **Appointment Management**: Real-time slot booking with availability tracking
- **Payment Integration**: Razorpay payment gateway integration
- **Notifications**: WhatsApp, Instagram DM, and Email notifications
- **Pharmacy Management**: Geolocation-based pharmacy search and inventory management
- **PDF Generation**: Automated appointment confirmation documents

### Clinic Features
- Clinic onboarding with API key configuration
- Dashboard with analytics and insights
- Staff management
- Patient records management
- Appointment scheduling and calendar view

### Patient Features
- Easy appointment booking
- Slot availability checker
- Online payment
- Appointment confirmation via multiple channels
- Nearby pharmacy finder

### Pharmacy Features
- Inventory management
- Stock tracking
- Location-based discovery
- Medicine catalog management

## Technology Stack

### Backend
- **Node.js** with **Express.js** - Web server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **Razorpay** - Payment processing
- **Nodemailer** - Email notifications
- **PDFKit** - PDF generation
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

### Frontend
- **React** with **Vite** - Modern frontend framework and build tool
- **React Router DOM** - Client-side routing
- **Material-UI** - UI component library
- **Axios** - HTTP client
- **React Hook Form** - Form validation
- **React Query** - Data fetching and caching
- **Leaflet** - Interactive maps
- **React Toastify** - Notification system

## Project Structure

```
mern-multi-tenant-crm/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── assets/        # Images, icons, styles
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context (Auth, Tenant)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express backend application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Helper utilities
│   ├── server.js         # Server entry point
│   └── package.json
│
├── .env.example          # Environment variables template
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── .gitignore            # Git ignore rules
├── package.json          # Root package.json with scripts
└── README.md             # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (v5 or higher)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/abhishek200510/skills-copilot-codespaces-vscode.git
cd skills-copilot-codespaces-vscode
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server and client dependencies
npm run install-all
```

Or install separately:

```bash
# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Environment Setup

Create a `.env` file in the root directory and in both `/server` and `/client` directories based on `.env.example`:

```bash
cp .env.example .env
cp .env.example server/.env
cp .env.example client/.env
```

Update the environment variables with your actual configuration values.

#### Key Environment Variables

**Server (.env in /server):**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `EMAIL_USER` - Email for sending notifications
- `EMAIL_PASSWORD` - Email app-specific password
- `WHATSAPP_API_KEY` - WhatsApp API credentials
- `GOOGLE_MAPS_API_KEY` - Google Maps API key

**Client (.env in /client):**
- `VITE_API_URL` - Backend API URL
- `VITE_RAZORPAY_KEY_ID` - Razorpay key for frontend
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps key for frontend

### 4. Database Setup

Make sure MongoDB is running:

```bash
# Start MongoDB (if installed locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### 5. Start the Application

#### Development Mode

Run both client and server concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

#### Production Mode

```bash
# Build client
npm run build

# Start server
npm start
```

## Available Scripts

### Root Level
- `npm run install-all` - Install all dependencies (server + client)
- `npm run dev` - Run both server and client in development mode
- `npm run server` - Run server only
- `npm run client` - Run client only
- `npm run build` - Build client for production
- `npm start` - Start production server
- `npm run lint` - Lint both server and client
- `npm run lint:fix` - Fix linting issues
- `npm test` - Run all tests

### Server
```bash
cd server
npm run dev      # Start with nodemon
npm start        # Start production
npm test         # Run tests
npm run lint     # Run ESLint
```

### Client
```bash
cd client
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Run tests
npm run lint     # Run ESLint
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Clinic Endpoints
- `GET /api/clinics` - Get all clinics (admin only)
- `POST /api/clinics` - Create new clinic
- `GET /api/clinics/:id` - Get clinic details
- `PUT /api/clinics/:id` - Update clinic
- `DELETE /api/clinics/:id` - Delete clinic

### Appointment Endpoints
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/slots` - Get available slots

### Patient Endpoints
- `GET /api/patients` - Get patients
- `POST /api/patients` - Create patient record
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Pharmacy Endpoints
- `GET /api/pharmacies` - Get pharmacies (with geolocation filter)
- `POST /api/pharmacies` - Create pharmacy
- `GET /api/pharmacies/:id` - Get pharmacy details
- `PUT /api/pharmacies/:id` - Update pharmacy

### Medicine Endpoints
- `GET /api/medicines` - Get medicines
- `POST /api/medicines` - Add medicine
- `GET /api/medicines/:id` - Get medicine details
- `PUT /api/medicines/:id` - Update medicine stock/details
- `DELETE /api/medicines/:id` - Remove medicine

### Integration Endpoints
- `POST /api/integrations/whatsapp/send` - Send WhatsApp message
- `POST /api/integrations/instagram/send` - Send Instagram DM
- `GET /api/integrations/razorpay/config` - Get Razorpay configuration

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **API Key Encryption** - Encrypted storage of third-party API keys
- **Rate Limiting** - Protection against brute force attacks
- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing configuration
- **Input Validation** - Express-validator for request validation
- **Tenant Isolation** - Complete data segregation between tenants

## Multi-Tenant Architecture

The application uses a discriminator-based multi-tenant architecture:

1. **Tenant Identification**: Each request is scoped to a tenant using `tenantId`
2. **Data Isolation**: All database queries are automatically filtered by tenant
3. **Middleware**: Custom middleware ensures tenant context in every request
4. **API Keys**: Encrypted per-tenant API keys for third-party integrations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Code Style

This project uses ESLint and Prettier for code formatting and linting:

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Testing

```bash
# Run all tests
npm test

# Run server tests only
npm run test:server

# Run client tests only
npm run test:client
```

## Deployment

### Environment Setup
1. Set all production environment variables
2. Update CORS settings for production domain
3. Configure MongoDB Atlas or production database
4. Set up SSL certificates

### Build and Deploy
```bash
# Build client
npm run build

# Deploy to hosting service (Heroku, AWS, DigitalOcean, etc.)
```

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue in the repository.

## Acknowledgments

- Express.js team for the excellent web framework
- React team for the powerful frontend library
- MongoDB team for the flexible database solution
- All open-source contributors whose packages are used in this project
