// import { React, useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { config } from '../../Constants'
// import { useAuth } from '../../AuthContext';
// import Container from '@mui/material/Container';

// import Stack from '@mui/material/Stack';
// import CircularProgress from '@mui/material/CircularProgress';
// import { Paper, Grid, Typography, Box } from '@mui/material';
// import { styled } from '@mui/material/styles';

// const DemoPaper = styled(Paper)(({ theme }) => ({

//   height: 120,
//   margin: theme.spacing(2),
//   padding: theme.spacing(2),
//   ...theme.typography.body2,
//   textAlign: 'center',
//   borderLeft: "6px solid #1976d294",
//   [theme.breakpoints.down('sm')]: {
//     height: 200, // Increase height on small screens and above
//   },
// }));


// function SquareCorners({ ad }) {
//   return (
//     // <Stack direction="column" >
//     <DemoPaper square={false} sx={{ display: 'flex' }}>

//       <Box sx={{
//         flex: "1", borderRight: "1px solid black", display: "flex",
//         justifyContent: "center",
//         alignItems: "center",

//       }}>
//         <Typography sx={{ fontSize: { xs: '.7rem', sm: '1rem' } }}>From: {new Date(ad.postedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
//       </Box>
//       <Link style={{
//         display: 'flex', flex: '4', color: 'inherit',
//         textDecoration: 'none'
//       }} to={`/item/${ad._id}`} >
//         <Box sx={{
//           flex: "4", display: "flex",
//           justifyContent: "space-around",
//           alignItems: "center",
//           flexDirection: { xs: 'column', sm: 'row' },
//         }}>
//           <img src={ad.images[0].url} alt="ad-image" style={{ maxWidth: "120px" }} />
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: { xs: 'column', sm: 'row' },
//               alignItems: { xs: 'center', sm: 'center' },
//               justifyContent: 'space-around',
//               width: '100%',

//             }}
//           >
//             <Typography
//               variant="body1"
//               sx={{
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 width: { xs: '150px', sm: '230px' },
//                 whiteSpace: "nowrap",
//                 maxWidth: '100%',
//                 lineHeight: '1.5em',
//                 height: { xs: '3em', sm: '1.5em' },
//                 fontSize: { xs: '.8rem', md: '1rem' }
//               }}
//             >
//               {ad.title}
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{
//                 fontWeight: 'bold',
//                 whiteSpace: 'nowrap',
//                 fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
//               }}
//             >
//               {ad.price}
//             </Typography>
//           </Box>
//         </Box>
//       </Link>

//     </DemoPaper >
//     // </Stack>
//   );
// }
// export default function Ads() {
//   // Code to render My Ads page goes here.
//   // This page will display a list of ads the user has created.
//   // The ads should be fetched from the backend API and displayed in a grid or list format.
//   // Each ad should have a title, description, and a link to the ad details page.
//   // The user should be able to delete their ads from this page.
//   // Additionally, the user should be able to edit their ads from this page.

//   const [ads, setAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const { authHeader,userId} = useAuth()
  

//   const url = config.url.API_URL
//   useEffect(() => {

//     const config = {
//       headers: {...authHeader()}
//     }
//     const fetchAds = async () => {
//       try {
//         const response = await axios.get(`${url}/api/users/user/items/${userId}?page=${currentPage}`, config);

//         setAds(prevAds => [...prevAds, ...response.data.ads]);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchAds();
//   }, [currentPage]);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/ads/${id}`);
//       setAds(ads.filter(ad => ad._id !== id));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleShowMore = () => {
//     setLoading(true);
//     setCurrentPage(currentPage + 1);
//   };

//   if (loading && currentPage === 1) return <CircularProgress disableShrink sx={{ position: 'absolute', left: '50%', top: '50%' }} />;
//   if (error) return <p>Error: {error}</p>;


//   return (
//     <Container sx={{ marginTop: "200px" }}>

//       <Box className="my-ads" >

//         {ads.map((ad, index) => (

//           <SquareCorners ad={ad} key={index} />
//         ))}
//         {/* </div> */}
//         {currentPage < totalPages && (
//           <button onClick={handleShowMore} className="show-more">Show More</button>
//         )}
//       </Box>
//     </Container>
//   );
// };

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { config } from '../../Constants'
import { useAuth } from '../../AuthContext';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { Paper, Grid, Typography, Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

const DemoPaper = styled(Paper)(({ theme }) => ({
  height: 120,
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
  borderLeft: "6px solid #1976d294",
  [theme.breakpoints.down('sm')]: {
    height: 200, // Increase height on small screens and above
  },
}));

function SquareCorners({ ad }) {
  return (
    <DemoPaper square={false} sx={{ display: 'flex' }}>
      <Box sx={{
        flex: "1", borderRight: "1px solid black", display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Typography sx={{ fontSize: { xs: '.7rem', sm: '1rem' } }}>
          {ad ? new Date(ad.postedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : <Skeleton width={120} />}
        </Typography>
      </Box>
      <Link style={{
        display: 'flex', flex: '4', color: 'inherit',
        textDecoration: 'none'
      }} to={ad ? `/item/${ad._id}` : '#'}>
        <Box sx={{
          flex: "4", display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
          {ad ? (
            <img src={ad.images[0].url} alt="ad-image" style={{ maxWidth: "120px" }} />
          ) : (
            <Skeleton variant="rectangular" width={120} height={80} />
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'center' },
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            {ad ? (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: { xs: '150px', sm: '230px' },
                    whiteSpace: "nowrap",
                    maxWidth: '100%',
                    lineHeight: '1.5em',
                    height: { xs: '3em', sm: '1.5em' },
                    fontSize: { xs: '.8rem', md: '1rem' }
                  }}
                >
                  {ad.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  }}
                >
                  {ad.price}
                </Typography>
              </>
            ) : (
              <>
                <Skeleton width={200} />
                <Skeleton width={100} />
              </>
            )}
          </Box>
        </Box>
      </Link>
    </DemoPaper >
  );
}

export default function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { authHeader, userId } = useAuth()

  const url = config.url.API_URL
  useEffect(() => {
    const config = {
      headers: { ...authHeader() }
    }
    const fetchAds = async () => {
      try {
        const response = await axios.get(`${url}/api/users/user/items/${userId}?page=${currentPage}`, config);
        setAds(prevAds => [...prevAds, ...response.data.ads]);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAds();
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/ads/${id}`);
      setAds(ads.filter(ad => ad._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShowMore = () => {
    setLoading(true);
    setCurrentPage(currentPage + 1);
  };

  if (loading && currentPage === 1) return (
    <Container sx={{ marginTop: "200px" }}>
      <Box className="my-ads">
        {[...Array(3)].map((_, index) => (
          <SquareCorners key={index} ad={null} />
        ))}
      </Box>
    </Container>
  );
  if (error) return <p>Error: {error}</p>;

  return (
    <Container sx={{ marginTop: "200px" }}>
      <Box className="my-ads">
        {ads.map((ad, index) => (
          <SquareCorners ad={ad} key={index} />
        ))}
        {currentPage < totalPages && (
          <button onClick={handleShowMore} className="show-more">Show More</button>
        )}
      </Box>
    </Container>
  );
};

