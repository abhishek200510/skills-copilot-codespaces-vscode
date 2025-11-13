import { Container, Typography, Grid, Paper } from '@mui/material';

const PharmacyDashboard = () => {
  const stats = [
    { label: 'Total Medicines', value: '0', color: '#1976d2' },
    { label: 'Low Stock Items', value: '0', color: '#ed6c02' },
    { label: 'Expired Items', value: '0', color: '#d32f2f' },
    { label: 'Total Value', value: '₹0', color: '#2e7d32' },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Pharmacy Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your pharmacy inventory and operations
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
    </Container>
  );
};

export default PharmacyDashboard;
