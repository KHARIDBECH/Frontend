import { useState, useEffect } from 'react'
import Banner from '../../components/Banner';
import { Container, Box, Button } from '@mui/material';
import Cards from '../../components/Cards';
import SEOHead from '../../components/SEOHead';
import { config } from '../../Constants'
import { useAuth } from '../../AuthContext';
import { useLocation } from 'react-router-dom';

export default function Home() {
  const { token, loading: authLoading } = useAuth();
  const url = config.url.API_URL;
  const location = useLocation();

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Wait for auth state to settle before fetching to avoid double calls
    if (authLoading) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search');

        let apiUrl = `${url}/product`;
        if (searchQuery) {
          apiUrl += `?search=${encodeURIComponent(searchQuery)}`;
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
    };

    fetchData();
  }, [url, token, authLoading, location.search]);

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
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }} component="main">
        <Banner />
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
      </Container>
    </>
  );
}
