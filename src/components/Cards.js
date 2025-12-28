import React from 'react';
import { Grid, Box, Typography, Skeleton, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TuneIcon from '@mui/icons-material/Tune';

/**
 * Cards Component
 * Displays a grid of product cards
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of product data
 * @param {number} props.visible - Number of items to show
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.showHeader - Whether to show section header (default: true)
 * @param {boolean} props.showEmptyState - Whether to show empty state (default: true)
 */
export default function Cards({
  data,
  visible,
  loading,
  showHeader = true,
  showEmptyState = true
}) {
  const hasData = data && data.length > 0;

  return (
    <Box sx={{ py: 4 }}>
      {/* Section Header - Only show on homepage or when explicitly enabled */}
      {showHeader && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AutoAwesomeIcon sx={{ color: 'var(--primary)', fontSize: 24 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  letterSpacing: '-0.02em'
                }}
              >
                Latest Listings
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', ml: 4 }}>
              Browse all ads posted by sellers
            </Typography>
          </Box>

          {/* Filter Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<TuneIcon sx={{ fontSize: 16 }} />}
              label="All"
              sx={{
                bgcolor: 'var(--primary)',
                color: 'white',
                fontWeight: 600,
                '&:hover': { bgcolor: 'var(--primary-hover)' }
              }}
            />
            <Chip
              label="Nearby"
              variant="outlined"
              sx={{
                borderColor: 'rgba(0,0,0,0.1)',
                color: '#64748b',
                fontWeight: 500,
                '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' }
              }}
            />
            <Chip
              label="Latest"
              variant="outlined"
              sx={{
                borderColor: 'rgba(0,0,0,0.1)',
                color: '#64748b',
                fontWeight: 500,
                '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' }
              }}
            />
          </Box>
        </Box>
      )}

      {/* Products Grid */}
      {(loading || hasData) && (
        <Grid container spacing={3}>
          {(loading ? Array.from(new Array(8)) : data?.slice(0, visible))?.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item?._id || index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                animation: 'fadeInUp 0.5s ease forwards',
                animationDelay: `${index * 0.05}s`,
                opacity: 0,
              }}
            >
              {item ? (
                <Link to={`/item/${item._id}`} style={{ width: '100%', display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
                  <ProductCard data={item} />
                </Link>
              ) : (
                <Box sx={{ width: '100%', maxWidth: '320px' }}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{
                      borderRadius: '20px',
                      mb: 2,
                      bgcolor: 'rgba(99, 102, 241, 0.08)'
                    }}
                    animation="wave"
                  />
                  <Skeleton width="75%" height={24} sx={{ mb: 1, borderRadius: '8px' }} animation="wave" />
                  <Skeleton width="50%" height={18} sx={{ mb: 1, borderRadius: '6px' }} animation="wave" />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Skeleton width="30%" height={16} sx={{ borderRadius: '6px' }} animation="wave" />
                    <Skeleton width="25%" height={16} sx={{ borderRadius: '6px' }} animation="wave" />
                  </Box>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State - Only show if enabled */}
      {showEmptyState && !loading && !hasData && (
        <Box sx={{
          textAlign: 'center',
          py: 10,
          px: 4,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          borderRadius: '24px',
          border: '2px dashed rgba(99, 102, 241, 0.2)'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            No listings found
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Be the first to post an ad in this category!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
