import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from '../src/components/Carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './ItemDetails.css';
import { config } from './Constants';
import { Grid, Container, Typography, Avatar } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import AdDetailSkeletonLoader from './components/AdDetailSkeletonLoader';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function LineByLineDescription({ lines }) {
    return (
        <div className="line-by-line">
            {lines?.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
}

export default function ItemDetails() {
    const url = config.url.API_URL;

    const [itemDetail, setitemDetail] = useState([]);
    const [loading, setloading] = useState(false);
    const [notFound, setNotFound] = useState(false); // State to track if item is not found
    const { productUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setloading(true);
        fetch(`${url}/api/product/itemdetail/${productUrl}`)
            .then((res) => {
                if (res.status === 404) {
                    setNotFound(true); // Set notFound to true if status is 404
                    setloading(false);
                    return null; // Return null to avoid further processing
                }
                return res.json();
            })
            .then((data) => {
                setitemDetail(data);
                setloading(false);
            })
            .catch((err) => {
                console.log(err);
                setloading(false);
            });
    }, [productUrl, url]);

    const handleChatWithSeller = async () => {
        console.log(itemDetail)
        const senderId = Cookies.get('userId'); // Get the sender ID from cookies or context
        const receiverId = itemDetail?.postedBy?._id// Assuming item.sellerId contains the seller's ID

        try {
            const response = await axios.post(`${config.url.API_URL}/api/chatConvo`, {
                senderId,
                receiverId,
                productId: itemDetail?._id
            });
            console.log('Conversation created:', response.data);
            navigate(`/chat`);
            // Optionally, navigate to the chat or update the UI
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const lines = itemDetail?.description?.split('\n');

    return (
        <Container maxWidth="lg">
            {loading ? (
                <AdDetailSkeletonLoader />
            ) : notFound ? ( // Check if notFound is true
                <Typography variant="h6" color="error" align="center">
                    No items found
                </Typography>
            ) : (
                <Grid container spacing={2} sx={{ marginTop: "20px", padding: "12px" }}>
                    <Grid item xs={12} md={6} sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <Carousel itemDetail={itemDetail.images} />
                        <Paper elevation={3} sx={{
                            minHeight: "100px",
                            padding: "15px",
                            width: "100%",
                            boxSizing: "border-box"
                        }}>
                            <Typography variant="h6">Details</Typography>
                            <Typography variant="body2">
                                <div className="line-by-line">
                                    {lines?.map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}
                                </div>
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ padding: "20px" }}>
                                    <Typography variant="h5">Rs {itemDetail.price}</Typography>
                                    <Typography variant="body2">{itemDetail.title}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{
                                    padding: "20px", display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "140px"
                                }}>
                                    <Typography variant="h6">Seller description</Typography>
                                    <Box display="flex" gap={2}>
                                        <Avatar alt="Remy Sharp" src="/broken-image.jpg" />
                                        <Typography variant="body2">
                                            <span>{itemDetail["postedBy"]?.firstName}&nbsp;{itemDetail["postedBy"]?.lastName}</span>
                                            <br />
                                            <span>Member since Feb 2017</span>
                                        </Typography>
                                    </Box>
                                    {itemDetail?.postedBy?._id !== Cookies.get('userId') && (
                                        <Button variant="outlined" color="primary" fullWidth={true} onClick={handleChatWithSeller}>
                                            Chat with Seller
                                        </Button>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}