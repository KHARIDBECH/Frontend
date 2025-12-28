import React from 'react';
import { Grid, Box, Typography, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';

export default function Cards({ data, visible, loading }) {
  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: 'var(--text-main)' }}>
        Fresh Recommendations
      </Typography>
      <Grid container spacing={4}>
        {(loading ? Array.from(new Array(8)) : data?.slice(0, visible)).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            {item ? (
              <Link to={`/item/${item._id}`} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <ProductCard data={item} />
              </Link>
            ) : (
              <Box sx={{ width: '100%', maxWidth: '300px' }}>
                <Skeleton
                  variant="rectangular"
                  height={180}
                  sx={{ borderRadius: '20px', mb: 2 }}
                />
                <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
                <Skeleton width="40%" height={20} />
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
