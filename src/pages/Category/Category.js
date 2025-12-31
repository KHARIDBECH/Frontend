import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Components
import Banner from '../../components/Banner';
import Cards from '../../components/Cards';
import SEOHead from '../../components/SEOHead';

// Config & SEO
import { config } from '../../Constants';
import { CATEGORY_SEO, BASE_URL, generateBreadcrumbSchema } from '../../utils/seo';

/**
 * Category Component
 * Displays products filtered by category with SEO optimization
 */
export default function Category() {
  const { category } = useParams();
  const apiUrl = config.url.API_URL;

  // State
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(false);

  // Get category SEO or use defaults
  const categorySeo = CATEGORY_SEO[category] || {
    title: `Buy & Sell Used ${category}`,
    description: `Find the best deals on second-hand ${category?.toLowerCase()} near you. Browse verified listings at great prices on Kharid Bech.`,
    keywords: `used ${category?.toLowerCase()}, second hand ${category?.toLowerCase()}, buy ${category?.toLowerCase()}, sell ${category?.toLowerCase()}`,
  };

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/product/category/${category}`, {
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

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: category, url: `${BASE_URL}/${category}` },
  ]);

  // Category page schema
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categorySeo.title,
    description: categorySeo.description,
    url: `${BASE_URL}/${category}`,
    breadcrumb: breadcrumbSchema,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: data.length,
      itemListElement: data.slice(0, visible).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: item.title,
          url: `${BASE_URL}/item/${item.slug || item._id}`,
          offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'INR',
            itemCondition: 'https://schema.org/UsedCondition',
          },
        },
      })),
    },
  };

  return (
    <>
      <SEOHead
        title={categorySeo.title}
        description={categorySeo.description}
        keywords={categorySeo.keywords}
        url={`${BASE_URL}/${category}`}
        schema={categorySchema}
      />
      <Container maxWidth="lg" sx={{ py: 4 }} component="main">
        {/* Banner */}
        <Banner />

        {/* Category Header */}
        <Box component="header" sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              textTransform: 'capitalize',
              color: 'var(--text-main)',
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            {category}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
            {loading ? 'Loading...' : `${data.length} items found`}
          </Typography>
        </Box>

        {/* Products Grid */}
        <section aria-label={`${category} Listings`}>
          <Cards
            data={data}
            visible={visible}
            loading={loading}
            showHeader={false}
            showEmptyState={false}
          />
        </section>

        {/* Load More Button */}
        {hasMoreItems && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button
              onClick={handleLoadMore}
              endIcon={<ExpandMoreIcon />}
              aria-label={`Load more ${category} products`}
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
            <Typography variant="h2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1, fontSize: '1.5rem' }}>
              No items in {category}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Be the first to post an ad in this category!
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}
