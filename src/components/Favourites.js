import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExploreIcon from '@mui/icons-material/Explore';

/**
 * Favourites Component
 * Displays user's saved/favorited items
 * Currently shows empty state - to be implemented with actual favorites functionality
 */
export default function Favourites() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          My <span style={{ color: 'var(--primary)' }}>Favourites</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
          Items you love, all in one place
        </Typography>
      </Box>

      {/* Empty State */}
      <Box sx={{
        py: 12,
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        borderRadius: '32px',
        border: '2px dashed rgba(99, 102, 241, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }}>
        <Box sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FavoriteIcon sx={{ fontSize: 48, color: '#ef4444' }} />
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-main)', mb: 1 }}>
            No Favourites Yet
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
            Save items you love by tapping the heart icon. They'll appear here for easy access.
          </Typography>
        </Box>

        <Button
          startIcon={<ExploreIcon />}
          onClick={() => navigate('/')}
          sx={{
            mt: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            px: 4,
            py: 1.5,
            borderRadius: '14px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 8px 20px -5px rgba(99, 102, 241, 0.4)',
            '&:hover': {
              boxShadow: '0 12px 25px -5px rgba(99, 102, 241, 0.5)'
            }
          }}
        >
          Explore Listings
        </Button>
      </Box>
    </Container>
  );
}
