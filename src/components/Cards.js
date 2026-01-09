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
import { useAuth } from '../AuthContext';

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
import { config } from '../Constants';

export default function Cards({
  data,
  visible,
  loading,
  showHeader = true,
  showEmptyState = true
}) {
  const { userId, user } = useAuth();
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [nearbyData, setNearbyData] = React.useState([]);
  const [nearbyLoading, setNearbyLoading] = React.useState(false);

  const handleNearbyClick = async () => {
    if (activeFilter === 'Nearby') {
      setActiveFilter('All');
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setActiveFilter('Nearby');

    // Only fetch if we don't have data or want to refresh
    setNearbyLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // 1. Reverse geocoding using Nominatim
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const geoData = await geoRes.json();

        // Extract city and state
        const city = geoData.address.city ||
          geoData.address.town ||
          geoData.address.village ||
          geoData.address.suburb;
        const state = geoData.address.state;

        console.log("Detected location:", { city, state });

        // Fetch products from backend
        const response = await fetch(`${config.url.API_URL}/product?city=${city || ''}&state=${state || ''}`);
        const result = await response.json();

        setNearbyData(result.data || []);
      } catch (err) {
        console.error("Nearby fetch error:", err);
        setNearbyData([]);
      } finally {
        setNearbyLoading(false);
      }
    }, (error) => {
      setNearbyLoading(false);
      setActiveFilter('All');

      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location access was denied. Please enable location permissions in your browser settings to use this feature.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is currently unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get your location timed out.");
          break;
        default:
          alert("An unknown error occurred while getting your location.");
      }
    }, {
      timeout: 10000,
      enableHighAccuracy: false // Faster and usually enough for city detection
    });
  };

  // Determine which data/loading state to use
  const displayData = activeFilter === 'Nearby' ? nearbyData : data;
  const isDisplayLoading = activeFilter === 'Nearby' ? nearbyLoading : loading;
  const hasData = displayData && displayData.length > 0;

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
              onClick={() => setActiveFilter('All')}
              sx={{
                bgcolor: activeFilter === 'All' ? 'var(--primary)' : 'transparent',
                color: activeFilter === 'All' ? 'white' : '#64748b',
                fontWeight: 600,
                border: activeFilter === 'All' ? 'none' : '1.5px solid rgba(0,0,0,0.08)',
                '&:hover': { bgcolor: activeFilter === 'All' ? 'var(--primary-hover)' : 'rgba(0,0,0,0.04)' }
              }}
            />
            <Chip
              label="Nearby"
              onClick={handleNearbyClick}
              variant={activeFilter === 'Nearby' ? 'filled' : 'outlined'}
              sx={{
                bgcolor: activeFilter === 'Nearby' ? 'var(--primary)' : 'transparent',
                color: activeFilter === 'Nearby' ? 'white' : '#64748b',
                borderColor: 'rgba(0,0,0,0.1)',
                fontWeight: 600,
                border: activeFilter === 'Nearby' ? 'none' : '1.5px solid rgba(0,0,0,0.08)',
                '&:hover': { bgcolor: activeFilter === 'Nearby' ? 'var(--primary-hover)' : 'rgba(0,0,0,0.04)' }
              }}
            />
          </Box>
        </Box>
      )}

      {/* Products Grid */}
      {(isDisplayLoading || hasData) && (
        <Grid container spacing={3}>
          {(isDisplayLoading ? Array.from(new Array(8)) : (displayData || []).slice(0, visible)).map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item?._id || index}
              className="animate-fadeInUp"
              style={{
                animationDelay: `${(index % 8) * 0.05}s`,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {item ? (
                <Link
                  to={`/item/${item.slug || item._id}`}
                  className="product-card-link"
                  style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
                >
                  <ProductCard data={item} userId={userId} />
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
      {showEmptyState && !isDisplayLoading && !hasData && (
        <Box sx={{
          textAlign: 'center',
          py: 10,
          px: 4,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          borderRadius: '24px',
          border: '2px dashed rgba(99, 102, 241, 0.2)'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            {activeFilter === 'Nearby' ? 'No nearby listings' : 'No listings found'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            {activeFilter === 'Nearby'
              ? "We couldn't find any items matching your location."
              : "Be the first to post an ad in this category!"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
