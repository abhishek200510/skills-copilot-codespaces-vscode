import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  CalendarMonth,
  LocalPharmacy,
  MedicalServices,
  Dashboard,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CalendarMonth sx={{ fontSize: 60 }} />,
      title: 'Appointment Management',
      description: 'Easy online booking and scheduling for patients and clinics.',
    },
    {
      icon: <LocalPharmacy sx={{ fontSize: 60 }} />,
      title: 'Pharmacy Finder',
      description: 'Find nearby pharmacies with real-time inventory.',
    },
    {
      icon: <MedicalServices sx={{ fontSize: 60 }} />,
      title: 'Patient Records',
      description: 'Secure and organized patient health records management.',
    },
    {
      icon: <Dashboard sx={{ fontSize: 60 }} />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights and analytics for clinic operations.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Medical CRM Platform
          </Typography>
          <Typography variant="h5" paragraph>
            Complete healthcare management solution for clinics, hospitals, and pharmacies
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ mr: 2, bgcolor: 'white', color: 'primary.main' }}
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white' }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Ready to transform your healthcare practice?
          </Typography>
          <Typography variant="body1" paragraph>
            Join hundreds of clinics and hospitals already using our platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
