import { Container, Typography, Paper, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const AppointmentConfirmation = () => {
  const { id } = useParams();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Appointment Confirmed
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your appointment has been successfully booked!
        </Typography>
        <Typography variant="body1" paragraph>
          Appointment ID: {id}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          You will receive a confirmation via email and WhatsApp shortly.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Download Confirmation PDF
        </Button>
      </Paper>
    </Container>
  );
};

export default AppointmentConfirmation;
