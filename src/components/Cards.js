import React from 'react'
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard'
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
export default function Cards({data,visible,loading}) {
  return (
    <>
       <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3} >
          {loading ? <CircularProgress disableShrink sx={{ position: 'absolute', left: '50%', top: '70%' }} />
            : (data?.slice(0, visible).map((data, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} container justifyContent="center" key={index}>
                <Link to={`/item/${data._id}`} >
                  <ProductCard key={index} data={data} sx={(theme) => ({ padding: theme.spacing(8), textAlign: 'center', color: theme.palette.text.secondary, boxShadow: '0px 2px 1px' })}></ProductCard>
                </Link>
              </Grid>
            )))
          }
        </Grid>
        </Box>
    </>
  )
}
