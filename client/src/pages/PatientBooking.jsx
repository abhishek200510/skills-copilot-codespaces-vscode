import { Container, Typography, Paper } from '@mui/material';

const PatientBooking = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Book Appointment
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Select a clinic, date, and time slot to book your appointment
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Appointment booking form will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export default PatientBooking;
