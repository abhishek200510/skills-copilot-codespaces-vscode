import { Container, Typography, Paper } from '@mui/material';

const PharmacyFinder = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Find Nearby Pharmacies
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Search for pharmacies near you with real-time availability
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Map-based pharmacy finder will be implemented here using Leaflet
        </Typography>
      </Paper>
    </Container>
  );
};

export default PharmacyFinder;
