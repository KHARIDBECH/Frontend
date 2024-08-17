import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Divider } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
const CategoriesPaper = styled(Paper)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-around',
    borderRadius:0,
    padding:'2px'
  }));
const CategoriesMenu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isMobile ? (
        <Button variant="text">All Categories</Button>
      ) : (
        <>
        <CategoriesPaper elevation={3}>
          <Button variant="text">Cars</Button>
          <Divider orientation="vertical" flexItem />
          <Button variant="text">Bikes</Button>
          <Divider orientation="vertical" flexItem />
          <Button variant="text">Mobiles</Button>
          <Divider orientation="vertical" flexItem />
          <Button variant="text">Electronics</Button>
          <Divider orientation="vertical" flexItem />
          <Button variant="text">Home Appliances</Button>
          </CategoriesPaper>
        </>
      )}
    </Box>
  );
};

export default CategoriesMenu;