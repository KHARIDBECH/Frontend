
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { config } from '../../Constants'
import { useAuth } from '../../AuthContext';
import Container from '@mui/material/Container';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
import CustomButton from '../../components/CustomButton';
import CustomDialog from '../../components/CustomDialog';

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

function SquareCorners({ ad,setAdId,setOpen }) {


  const handleRemoveClick = () => {
    setAdId(ad._id); // Set the ad ID to be deleted
    setOpen(true); // Open the dialog
  };
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
        textDecoration: 'none', flexDirection: 'column'
      }} to={ad ? `/item/${ad._id}` : '#'}>
        <Box sx={{
          flex: "4", display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
          {ad ? (
            <img src={ad.images[0].url} alt="ad-image" style={{ maxWidth: "90px" }} />
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
          <CustomButton onClick={()=>handleRemoveClick()} text="Remove" style={{
            height: "100%",
            display: "flex",
            alignItems: "flex-end"
          }}/>
    </DemoPaper >
  );
}

export default function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [adId,setAdId] = useState(null)
  const { authHeader, userId } = useAuth()
  const [open, setOpen] = useState(false);

    // const handleOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemove = async () => {
      const config = {
        headers: { ...authHeader() }
      }
      try {
       const response =  await axios.delete(`${url}/api/product/${adId}`,config);
        setAds(ads.filter(ad => ad._id !== adId));
        console.log(response);
        handleClose()
      } catch (err) {
        setError(err.message);
        handleClose()
      }
    };

    const actions = [
        {
            label: 'Cancel',
            onClick: handleClose,
            autoFocus: true,
        },
        {
            label: 'Remove',
            onClick: handleRemove,
        },
    ];

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
          <SquareCorners ad={ad} key={index} setAdId = {setAdId} setOpen={setOpen}/>
        ))}
        {currentPage < totalPages && (
          <CustomButton onClick={handleShowMore} text="Show more" style={{display:"flex",justifyContent:"center"}}/>
        )}
      </Box>
      <div>
            <CustomDialog
                open={open}
                onClose={handleClose}
                title="Confirm"
                content="Deleting this ad is irreversible. Please confirm if you want to proceed."
                actions={actions}
                
            />
        </div>
    </Container>
  );
};

