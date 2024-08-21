import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const CategoriesPaper = styled(Paper)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
    display: 'flex',
    overflowX: 'auto', // Enable horizontal scrolling
    whiteSpace: 'nowrap', // Prevent wrapping
    padding: '2px',
}));

const CategoriesMenu = () => {
    const categories = [
        'Cars',
        'Bikes',
        'Mobiles',
        'Electronics & Appliances',
        'Home Appliances',
        'Furniture',
        'Watches',
        'Books',
        'Clothing',
        'Sports Equipment'
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowX: 'hidden', // Prevent horizontal overflow on the main container
            }}
        >
            <CategoriesPaper elevation={3}>
                {categories.map((value, index) => (
                    <Link to={`/${value}`} key={index} style={{ textDecoration: 'none' }}>
                        <Button variant="text" style={{ margin: '0 10px' }}>
                            {value}
                        </Button>
                        {index < categories.length - 1 && <Divider orientation="vertical" flexItem />}
                    </Link>
                ))}
            </CategoriesPaper>
        </Box>
    );
};

export default CategoriesMenu;