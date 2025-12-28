import * as React from 'react';
import { Box, Tabs, Tab, Container, Typography, Paper } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Ads from '../pages/MyAds/Ads';
import Favourites from './Favourites';

export default function UserDashboard() {
  const location = useLocation();

  // Determine active tab based on path
  const currentTab = location.pathname.includes('/favourites') ? '/favourites' : '/myads';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
          User <span style={{ color: 'var(--primary)' }}>Dashboard</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
          Manage your listings and saved items in one place.
        </Typography>
      </Box>

      <Paper
        className="glass"
        sx={{
          borderRadius: '24px',
          overflow: 'hidden',
          mb: 4
        }}
      >
        <Tabs
          value={currentTab}
          sx={{
            px: 2,
            pt: 1,
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              bgcolor: 'var(--primary)'
            }
          }}
        >
          <Tab
            label="My Ads"
            value="/myads"
            component={Link}
            to="/myads"
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              py: 2
            }}
          />
          <Tab
            label="Favorites"
            value="/favourites"
            component={Link}
            to="/favourites"
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              py: 2
            }}
          />
        </Tabs>
      </Paper>

      <Box>
        {currentTab === '/myads' ? <Ads /> : <Favourites />}
      </Box>
    </Container>
  );
}
