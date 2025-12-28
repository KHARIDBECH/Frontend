import { useState, useEffect } from 'react'
import Banner from '../../components/Banner';
import React from 'react';
import { Container, Box, Button } from '@mui/material';
import Cards from '../../components/Cards';
import { config } from '../../Constants'
import CustomButton from '../../components/CustomButton';
import Cookies from 'js-cookie';
import { useAuth } from '../../AuthContext';

export default function Home() {
  const { token } = useAuth();
  const url = config.url.API_URL;

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}/api/product`, {
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
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token]);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 8);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Banner />
      <Cards data={data} visible={visible} loading={loading} />

      {visible < data?.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            onClick={showMoreItems}
            variant="outlined"
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
  );
}
