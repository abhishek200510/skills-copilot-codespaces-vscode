import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ClinicDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Appointments', value: '0', color: '#1976d2' },
    { label: 'Pending Appointments', value: '0', color: '#ed6c02' },
    { label: 'Total Patients', value: '0', color: '#2e7d32' },
    { label: 'Revenue', value: '₹0', color: '#9c27b0' },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.firstName}!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Here's your clinic overview
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: stat.color,
                color: 'white',
              }}
            >
              <Typography variant="h3">{stat.value}</Typography>
              <Typography variant="body2">{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Appointments
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No appointments yet
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ClinicDashboard;
