import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Container, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import SearchBox from './SearchBox';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: '100px 0 120px',
  marginBottom: '80px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '32px',
  overflow: 'hidden',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    zIndex: 1
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-50%',
    right: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
    borderRadius: '50%',
  },
  [theme.breakpoints.down('md')]: {
    padding: '60px 0 80px',
    marginBottom: '40px',
  }
}));

const FeatureChip = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: 'rgba(255, 255, 255, 0.15)',
  borderRadius: '30px',
  fontSize: '0.85rem',
  fontWeight: 500,
  backdropFilter: 'blur(10px)',
}));

const StatBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '16px'
  }
}));

export default function Banner() {
  const navigate = useNavigate();
  const { setOpenSignUp, isAuth } = useAuth();

  const handleSell = () => {
    if (isAuth) {
      navigate('/post-ad');
    } else {
      setOpenSignUp(true);
    }
  };

  return (
    <HeroSection>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Feature Chips */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <FeatureChip>
            <TrendingUpIcon sx={{ fontSize: 18 }} />
            10K+ Active Listings
          </FeatureChip>
          <FeatureChip>
            <LocalShippingIcon sx={{ fontSize: 18 }} />
            Fast Deals
          </FeatureChip>
        </Box>

        {/* Main Heading */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            textAlign: 'center',
            letterSpacing: '-2px',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            lineHeight: 1.1
          }}
        >
          Buy & Sell<br />
          <span style={{
            background: 'linear-gradient(90deg, #fcd34d, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Anything Local
          </span>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 5,
            opacity: 0.9,
            fontWeight: 400,
            maxWidth: '550px',
            mx: 'auto',
            textAlign: 'center',
            fontSize: { xs: '1rem', md: '1.15rem' },
            lineHeight: 1.6
          }}
        >
          The most trusted marketplace for pre-owned goods. Join thousands of users buying and selling daily.
        </Typography>

        {/* Search Bar - Using Reusable Component (Only visible on Mobile) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
          <SearchBox variant="banner" placeholder="Search for cars, phones, furniture..." />
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, flexWrap: 'wrap' }}>
          <Button
            onClick={handleSell}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            Start Selling
          </Button>
          <Button
            sx={{
              bgcolor: 'transparent',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            How It Works
          </Button>
        </Box>

        {/* Stats */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 4, md: 8 },
          mt: 6,
          flexWrap: 'wrap'
        }}>
          <StatBox>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>50K+</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Users</Typography>
          </StatBox>
          <StatBox>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>100K+</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>Items Sold</Typography>
          </StatBox>
          <StatBox>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>4.9★</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>User Rating</Typography>
          </StatBox>
        </Box>
      </Container>
    </HeroSection>
  );
}
