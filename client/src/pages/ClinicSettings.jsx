import { Container, Typography, Paper, Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ClinicSettings = () => {
  const [apiKeys, setApiKeys] = useState({
    whatsappKey: '',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    googleMapsKey: '',
  });

  const handleChange = (e) => {
    setApiKeys({
      ...apiKeys,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Clinic Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configure your clinic settings and API integrations
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          API Keys Configuration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            name="whatsappKey"
            label="WhatsApp API Key"
            value={apiKeys.whatsappKey}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="razorpayKeyId"
            label="Razorpay Key ID"
            value={apiKeys.razorpayKeyId}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="razorpayKeySecret"
            label="Razorpay Key Secret"
            type="password"
            value={apiKeys.razorpayKeySecret}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="googleMapsKey"
            label="Google Maps API Key"
            value={apiKeys.googleMapsKey}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClinicSettings;
