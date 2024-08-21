
import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import CustomSelect from '../components/CusomSelect';

const CategoriesPaper = styled(Paper)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-around',
    borderRadius: 0,
    padding: '2px'
}));

const CategoriesMenu = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
            }}
        >
            {isMobile ? (
                <CustomSelect/>
            ) : (
                <CategoriesPaper elevation={3}>
                    {categories.map((value, index) => (
                        <Link to={`/${value}`} key={index}>
                            <div>
                                <Button variant="text">{value}</Button>
                                <Divider orientation="vertical" flexItem />
                            </div>
                        </Link>
                    ))}
                </CategoriesPaper>
            )}
        </Box>
    );
};

export default CategoriesMenu;