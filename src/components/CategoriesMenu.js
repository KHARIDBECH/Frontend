
import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Divider, Container } from '@mui/material';
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
}));

const CategoriesMenu = () => {
    const categories = [
        'Cars', 'Bikes', 'Mobiles', 'Electronics', 'Appliances', 'Furniture', 'Watches', 'Books', 'Clothing', 'Sports'
    ];

    return (
        <Box sx={{
            bgcolor: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            py: 1,
            overflow: 'hidden'
        }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    py: 1,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    alignItems: 'center'
                }}>
                    {categories.map((cat, index) => (
                        <Link to={`/${cat}`} key={index}>
                            <Button
                                variant="text"
                                sx={{
                                    whiteSpace: 'nowrap',
                                    color: 'var(--text-muted)',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    borderRadius: '10px',
                                    px: 2,
                                    textTransform: 'none',
                                    '&:hover': {
                                        color: 'var(--primary)',
                                        bgcolor: 'rgba(99, 102, 241, 0.05)'
                                    }
                                }}
                            >
                                {cat}
                            </Button>
                        </Link>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default CategoriesMenu;