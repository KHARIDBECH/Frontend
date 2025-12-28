import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Components
import Banner from '../../components/Banner';
import Cards from '../../components/Cards';

// Config
import { config } from '../../Constants';

/**
 * Category Component
 * Displays products filtered by category
 */
export default function Category() {
  const { category } = useParams();
  const apiUrl = config.url.API_URL;

  // State
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(false);

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/product/${category}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, apiUrl]);

  // Load more products
  const handleLoadMore = useCallback(() => {
    setVisible(prev => prev + 8);
  }, []);

  const hasMoreItems = visible < data.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Banner */}
      <Banner />

      {/* Category Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            textTransform: 'capitalize',
            color: 'var(--text-main)'
          }}
        >
          {category}
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
          {loading ? 'Loading...' : `${data.length} items found`}
        </Typography>
      </Box>

      {/* Products Grid */}
      <Cards
        data={data}
        visible={visible}
        loading={loading}
        showHeader={false}
        showEmptyState={false}
      />

      {/* Load More Button */}
      {hasMoreItems && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            onClick={handleLoadMore}
            endIcon={<ExpandMoreIcon />}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: '14px',
              fontWeight: 600,
              textTransform: 'none',
              color: 'var(--primary)',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              '&:hover': {
                borderColor: 'var(--primary)',
                bgcolor: 'rgba(99, 102, 241, 0.05)'
              }
            }}
          >
            Load More
          </Button>
        </Box>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <Box sx={{
          textAlign: 'center',
          py: 10,
          px: 4,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          borderRadius: '24px',
          border: '2px dashed rgba(99, 102, 241, 0.2)'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            No items in {category}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Be the first to post an ad in this category!
          </Typography>
        </Box>
      )}
    </Container>
  );
}
