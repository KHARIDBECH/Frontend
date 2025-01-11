import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { Box } from '@mui/material';
import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { config } from './Constants'



const Cardscontainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4), // Add top margin
  padding: 0,
}));
const Banner = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '200px', // Set the height of the banner
  backgroundSize: 'cover',
  marginBottom: "50px",
  backgroundPosition: 'center',
  marginTop: theme.spacing(2), // Add some margin from the header
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("https://statics.olx.in/external/base/img/hero-bg-in.jpg")', // Replace with your Product image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1, // Ensure the image stays behind any other content
    opacity: 0.9, // Slight transparency for better visibility
  },
}));

function Showmore({ showMoreItems }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <Button variant="outlined" color="primary" style={{
        width: '150px'
      }}>
        <span style={{ whiteSpace: 'nowrap' }} onClick={showMoreItems}>Show More</span>
      </Button>
    </div>
  )
}


export default function Content({ searchVal }) {
  const url = config.url.API_URL
  // const url = "http://localhost:5000"
  const token = Cookies.get('token')
  const [data, setdata] = useState([{}])
  const [visible, setvisible] = useState(4)
  const [lengthTrack, setlengthTrack] = useState(4)

 
  useEffect(() => {
    fetch(`${url}/api/product`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        if (response.status === 400) {
          throw Error(response.statusText);
        }

        return response.json();
      }
      )
      .then((data) => {
        data.map((value) => {
          value.productUrl = value._id
        })
        setdata(data)
      })
      .catch((err) => {
        console.log("err", err)
      })
  }, [])

  const showMoreItems = () => {
    setvisible((prevValue) => prevValue + 4)
    setlengthTrack((prevValue) => prevValue + 4)
  }
  return (

    <Cardscontainer >
      <Banner />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3} >

          {

            data.slice(0, visible).map((data, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} container justifyContent="center" key={index}>
                <Link to={`/item/${data.productUrl}`} >
                  <ProductCard key={index} data={data} sx={(theme) => ({ padding: theme.spacing(8), textAlign: 'center', color: theme.palette.text.secondary, boxShadow: '0px 2px 1px' })}></ProductCard>
                </Link>
              </Grid>
            ))
          }



        </Grid>
        {
          (lengthTrack < data.length) ? <Showmore showMoreItems={showMoreItems} /> : null
        }



        {/* </div> */}



      </Box>
    </Cardscontainer>


  );
}
