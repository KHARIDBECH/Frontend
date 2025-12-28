import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Container, Button } from '@mui/material';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: '80px 0',
  marginBottom: '60px',
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  borderRadius: '24px',
  overflow: 'hidden',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.4)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    zIndex: 1
  }
}));

export default function Banner() {
  return (
    <HeroSection>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            letterSpacing: '-2px',
            fontSize: { xs: '2.5rem', md: '4rem' }
          }}
        >
          Buy & Sell <span style={{ color: '#fcd34d' }}>Everything</span>
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            opacity: 0.9,
            fontWeight: 400,
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          The most trusted marketplace for pre-owned goods. Join thousands of users buying and selling daily.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'var(--primary)',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 700,
              '&:hover': { bgcolor: '#f1f5f9' }
            }}
          >
            Browse Ads
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 700,
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </HeroSection>
  );
}
