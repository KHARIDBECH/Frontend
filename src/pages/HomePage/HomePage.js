import { useState, useEffect, useCallback } from 'react'
import Banner from '../../components/Banner';
import PriceFilter from '../../components/PriceFilter';
import { Container, Box, Button, Typography, Grid } from '@mui/material';
import Cards from '../../components/Cards';
import SEOHead from '../../components/SEOHead';
import { config } from '../../Constants'
import { useAuth } from '../../AuthContext';
import { useLocation, useSearchParams } from 'react-router-dom';

export default function Home() {
  const { token, loading: authLoading } = useAuth();
  const url = config.url.API_URL;
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(false);

  // Price filter state
  const [priceFilter, setPriceFilter] = useState({
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : null
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const searchQuery = searchParams.get('search');

      // Build API URL with all filters
      let apiUrl = `${url}/product`;
      const params = new URLSearchParams();

      if (searchQuery) params.append('search', searchQuery);
      if (priceFilter.minPrice) params.append('minPrice', priceFilter.minPrice);
      if (priceFilter.maxPrice) params.append('maxPrice', priceFilter.maxPrice);

      if (params.toString()) {
        apiUrl += `?${params.toString()}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [url, token, searchParams, priceFilter]);

  useEffect(() => {
    // Wait for auth state to settle before fetching to avoid double calls
    if (authLoading) return;
    fetchData();
  }, [authLoading, fetchData]);

  const handlePriceFilterApply = useCallback(({ minPrice, maxPrice }) => {
    setPriceFilter({ minPrice, maxPrice });

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (minPrice) {
      newParams.set('minPrice', minPrice.toString());
    } else {
      newParams.delete('minPrice');
    }
    if (maxPrice) {
      newParams.set('maxPrice', maxPrice.toString());
    } else {
      newParams.delete('maxPrice');
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 8);
  };

  // Schema for homepage
  const homepageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kharid Bech - Buy & Sell Used Products',
    description: "India's trusted marketplace for buying and selling used products",
    url: 'https://kharidbech.vercel.app',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: data.length,
      itemListElement: data.slice(0, visible).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: item.title,
          url: `https://kharidbech.vercel.app/item/${item.slug || item._id}`,
          description: item.description?.substring(0, 150),
          offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/UsedCondition',
          },
        },
      })),
    },
  };

  return (
    <>
      <SEOHead
        title={null} // Use default title for homepage
        description="Buy and sell used products near you. Find amazing deals on second-hand cars, bikes, mobiles, electronics, furniture & more on India's trusted marketplace."
        keywords="buy sell used products, second hand items, pre-owned, used cars, used bikes, used mobiles, used electronics, local marketplace, classifieds India"
        url="https://kharidbech.vercel.app/"
        schema={homepageSchema}
      />
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8, px: { xs: 2, md: 6, lg: 8 } }} component="main">
        <Banner />

        <Box sx={{ mt: 5 }}>
          <Grid container spacing={4}>
            {/* Main Content Area */}
            <Grid item xs={12}>


              <section aria-label="Product Listings">
                <Cards data={data} visible={visible} loading={loading} />
              </section>

              {visible < data?.length && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Button
                    onClick={showMoreItems}
                    variant="outlined"
                    aria-label="Show more products"
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        borderColor: 'var(--primary)',
                        bgcolor: 'rgba(99, 102, 241, 0.05)'
                      }
                    }}
                  >
                    Show more
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

