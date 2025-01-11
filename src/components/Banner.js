import React from 'react'
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
const AdBanner = styled(Box)(({ theme }) => ({
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
export default function Banner() {
  return (
    <>
     <AdBanner></AdBanner> 
    </>
  )
}
