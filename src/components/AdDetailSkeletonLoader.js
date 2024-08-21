import React from 'react';
import { Grid, Paper, Box, Skeleton } from '@mui/material';

const AdDetailSkeletonLoader = () => {
  return (
    <Grid container spacing={2} sx={{ marginTop: "20px", padding: "12px" }}>
      <Grid item xs={12} md={6} sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Paper elevation={3} sx={{
          minHeight: "100px",
          padding: "15px",
          width: "100%",
          boxSizing: "border-box",
          marginTop: "16px"
        }}>
          <Skeleton variant="text" width="100%" height={100} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: "20px" }}>
              <Skeleton variant="text" width="50%" height={32} />
              <Skeleton variant="text" width="100%" height={24} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{
              padding: "20px", display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "140px"
            }}>
              <Skeleton variant="text" width="50%" height={24} />
              <Box display="flex" gap={2}>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width="60%" height={48} />
              </Box>
              <Skeleton variant="text" width="100%" height={36} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdDetailSkeletonLoader;