import * as React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function Favourites() {
  return (
    <Container maxWidth="lg">
      <Box sx={{
        py: 10,
        textAlign: 'center',
        bgcolor: 'rgba(0,0,0,0.02)',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <SentimentVeryDissatisfiedIcon sx={{ fontSize: 64, color: 'var(--text-muted)', opacity: 0.5 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
          No Favorites Yet
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
          Items you favorite will appear here. Start browsing to find things you love!
        </Typography>
      </Box>
    </Container>
  );
}
