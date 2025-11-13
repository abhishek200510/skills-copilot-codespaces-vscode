import { Container, Typography, Paper } from '@mui/material';

const MedicineInventory = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Medicine Inventory
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your medicine stock and inventory
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Medicine inventory management interface will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export default MedicineInventory;
