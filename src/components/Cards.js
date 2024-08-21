import React from 'react'
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard'
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
export default function Cards({ data, visible, loading }) {
  return (
    <>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3} >
          {(loading ? Array.from(new Array(4)) : data?.slice(0, visible)).map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} container justifyContent="center" key={index}>
              {item ? (
                <Link to={`/item/${item._id}`} >
                  <ProductCard key={index} data={item} sx={(theme) => ({ padding: theme.spacing(8), textAlign: 'center', color: theme.palette.text.secondary, boxShadow: '0px 2px 1px' })}></ProductCard>
                </Link>
              ) : (
                <>
                  <Skeleton variant="rectangular" width={210} height={118} sx={{
                    maxWidth: "270px",
                    minWidth: '260px',
                    maxHeight: '330px',
                  }} />
                  <Box sx={{ pt: 0.5 }} width="100%">
                    <Skeleton width="40%"/>
                    <Skeleton width="100%" />
                    <Skeleton width="60%" />
                  </Box>
                </>
              )}
            </Grid>
          ))}
          {/* {
                data ? (data?.slice(0, visible).map((data, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} container justifyContent="center" key={index}>
                    <Link to={`/item/${data._id}`} >
                      <ProductCard key={index} data={data} sx={(theme) => ({ padding: theme.spacing(8), textAlign: 'center', color: theme.palette.text.secondary, boxShadow: '0px 2px 1px' })}></ProductCard>
                    </Link>
                  </Grid>
                )))
                  : (
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </Box>
                  )}
           */}
        </Grid>
      </Box>
    </>
  )
}
