import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DevicesIcon from '@mui/icons-material/Devices';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ChairIcon from '@mui/icons-material/Chair';
import WatchIcon from '@mui/icons-material/Watch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GridViewIcon from '@mui/icons-material/GridView';

// Components
import Cards from '../../components/Cards';
import SEOHead from '../../components/SEOHead';

// Config & SEO
import { config } from '../../Constants';
import { CATEGORY_SEO, BASE_URL, generateBreadcrumbSchema } from '../../utils/seo';

// Icon Map
const iconMap = {
  'Cars': <DirectionsCarIcon />,
  'Bikes': <TwoWheelerIcon />,
  'Mobiles': <PhoneIphoneIcon />,
  'Electronics': <DevicesIcon />,
  'Appliances': <KitchenIcon />,
  'Furniture': <ChairIcon />,
  'Watches': <WatchIcon />,
  'Books': <MenuBookIcon />,
  'Clothing': <CheckroomIcon />,
  'Sports': <SportsSoccerIcon />
};

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

  const CategoryIcon = iconMap[category] || <GridViewIcon />;

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
    // Reset visible count when category changes
    setVisible(8);
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
        {/* Category Header */}
        <Box component="header" sx={{
          mb: 6,
          p: { xs: 3, md: 5 },
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 3,
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'white',
            color: 'var(--primary)',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.1)',
            '& svg': { fontSize: 40 }
          }}>
            {React.cloneElement(CategoryIcon)}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                mb: 0.5,
                textTransform: 'capitalize'
              }}
            >
              Browsing {category}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
              We found {loading ? '...' : <b>{data.length}</b>} items in this category
            </Typography>
          </Box>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Button
              onClick={handleLoadMore}
              endIcon={<ExpandMoreIcon />}
              variant="outlined"
              aria-label={`Load more ${category} products`}
              sx={{
                px: 6,
                py: 2,
                borderRadius: '16px',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  bgcolor: 'rgba(99, 102, 241, 0.05)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Show More Results
            </Button>
          </Box>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 12,
            px: 4,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            borderRadius: '32px',
            border: '2px dashed rgba(99, 102, 241, 0.2)',
            boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.03)'
          }}>
            <Box sx={{
              fontSize: '4rem',
              mb: 2,
              opacity: 0.5,
              display: 'flex',
              justifyContent: 'center'
            }}>
              {React.cloneElement(CategoryIcon, { sx: { fontSize: 80 } })}
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, fontSize: '1.75rem' }}>
              No items listed in {category} yet
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 500, mx: 'auto' }}>
              Be the first to reach buyers in this category by posting your ad today!
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/post-ad'}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                px: 5,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
              }}
            >
              Post your Ad here
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}
