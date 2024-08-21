// import React from 'react';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { Box, Button, Divider } from '@mui/material';
// import Paper from '@mui/material/Paper';
// import { styled } from '@mui/material/styles';
// import {  Link } from 'react-router-dom';
// const CategoriesPaper = styled(Paper)(({ theme }) => ({
//     width: "100%",
//     padding: theme.spacing(2),
//     ...theme.typography.body2,
//     textAlign: 'center',
//     display: 'flex',
//     justifyContent: 'space-around',
//     borderRadius: 0,
//     padding: '2px'
// }));
// const CategoriesMenu = () => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const categories = [
//         'Cars',
//         'Bikes',
//         'Mobiles',
//         'Electronics & Appliances',
//         'Home Appliances',
//         'Furniture',
//         'Watches',
//         'Books',
//         'Clothing',
//         'Sports Equipment'
//     ];
//     return (
//         <Box
//             sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             {isMobile ? (
//                 <Button variant="text">All Categories</Button>
//             ) : (
//                 <>
//                     <CategoriesPaper elevation={3}>
//                         {categories.map((value, index) => (
//                             <Link to={`/${value}`} key={index}>
//                             <div  >
//                                 <Button variant="text">{value}</Button>
//                                 <Divider orientation="vertical" flexItem />
//                             </div>
//                             </Link>
//                         ))}
//                     </CategoriesPaper>
//                 </>
//             )}
//         </Box>
//     );
// };

// export default CategoriesMenu;
import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
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
    const history = useNavigate(); // Use history for navigation
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

    // const handleCategoryChange = (event) => {
    //     const selectedCategory = event.target.value;
    //     history(`/${selectedCategory}`); // Navigate to the selected category
    // };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {isMobile ? (
                // <FormControl  sx={{ minWidth: 120 }}>
                //     <InputLabel id="category-select-label">Categories</InputLabel>
                //     <Select
                //         labelId="category-select-label"
                //         onChange={handleCategoryChange}
                //         defaultValue=""
                //     >
                //         {categories.map((value, index) => (
                //             <MenuItem key={index} value={value}>
                //                 {value}
                //             </MenuItem>
                //         ))}
                //     </Select>
                // </FormControl>
                <>
                <CustomSelect/>
                </>
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