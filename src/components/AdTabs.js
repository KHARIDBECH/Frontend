import React, { useMemo } from 'react';
import { Box, Tabs, Tab, Container, Typography, Paper } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Components
import Ads from '../pages/MyAds/Ads';
import Favourites from './Favourites';

// Tab configuration
const TABS = [
  {
    label: 'My Listings',
    value: '/my-ads',
    icon: <StorefrontIcon sx={{ fontSize: 20 }} />,
    component: Ads
  },
  {
    label: 'Favourites',
    value: '/favourites',
    icon: <FavoriteIcon sx={{ fontSize: 20 }} />,
    component: Favourites
  }
];

/**
 * UserDashboard Component
 * Main dashboard for user account management
 * Contains tabs for My Listings and Favourites
 */
export default function UserDashboard() {
  const location = useLocation();

  // Determine active tab based on current path
  const currentTab = useMemo(() => {
    const matchedTab = TABS.find(tab => location.pathname.includes(tab.value));
    return matchedTab?.value || TABS[0].value;
  }, [location.pathname]);

  // Get the component to render for current tab
  const ActiveComponent = useMemo(() => {
    const matchedTab = TABS.find(tab => tab.value === currentTab);
    return matchedTab?.component || TABS[0].component;
  }, [currentTab]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            letterSpacing: '-1px',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          My <span className="gradient-text">Dashboard</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
          Manage your listings and saved items in one place
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Paper
        className="glass"
        sx={{
          borderRadius: '20px',
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
              background: 'linear-gradient(90deg, #667eea, #764ba2)'
            },
            '& .MuiTab-root': {
              minHeight: 56,
              transition: 'all 0.2s ease'
            },
            '& .Mui-selected': {
              color: 'var(--primary) !important'
            }
          }}
        >
          {TABS.map(tab => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              component={Link}
              to={tab.value}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                py: 2,
                gap: 1,
                color: 'var(--text-muted)',
                '&:hover': {
                  color: 'var(--primary)',
                  bgcolor: 'rgba(99, 102, 241, 0.04)'
                }
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        <ActiveComponent />
      </Box>
    </Container>
  );
}
