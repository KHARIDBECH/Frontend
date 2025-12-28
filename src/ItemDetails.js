import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from '../src/components/Carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './ItemDetails.css';
import { config } from './Constants';
import { Grid, Container, Typography, Avatar, Box, Button, IconButton } from '@mui/material';
import AdDetailSkeletonLoader from './components/AdDetailSkeletonLoader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function ItemDetails() {
    const { userId } = useAuth();
    const url = config.url.API_URL;
    const [itemDetail, setItemDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const { productUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch(`${url}/api/product/itemdetail/${productUrl}`)
            .then((res) => {
                if (res.status === 404) {
                    setNotFound(true);
                    setLoading(false);
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data) setItemDetail(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [productUrl, url]);

    const handleChatWithSeller = async () => {
        if (!userId) {
            // Signal to open login modal if not authenticated
            return;
        }

        try {
            await axios.post(`${url}/api/chatConvo`, {
                senderId: userId,
                receiverId: itemDetail?.postedBy?._id,
                productId: itemDetail?._id
            });
            navigate(`/chat`);
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    if (loading) return <Container maxWidth="lg" sx={{ mt: 4 }}><AdDetailSkeletonLoader /></Container>;
    if (notFound || !itemDetail) return <Container maxWidth="lg" sx={{ mt: 8 }}><Typography variant="h5" align="center">Product Not Found</Typography></Container>;

    const descriptionLines = itemDetail.description?.split('\n') || [];

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                {/* Left Side: Images and Description */}
                <Grid item xs={12} md={7}>
                    <Box sx={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        bgcolor: 'black',
                        mb: 4
                    }}>
                        <Carousel itemDetail={itemDetail.images} />
                    </Box>

                    <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Description</Typography>
                        <Box sx={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                            {descriptionLines.map((line, index) => (
                                <Typography key={index} variant="body1" sx={{ mb: 1.5 }}>{line}</Typography>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {/* Right Side: Sticky Info Panel */}
                <Grid item xs={12} md={5}>
                    <Box sx={{ position: 'sticky', top: '100px' }}>
                        {/* Price & Title Card */}
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px', mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--primary)' }}>
                                    ₹{itemDetail.price?.toLocaleString()}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.05)' }}><ShareIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.05)' }}><FavoriteBorderIcon fontSize="small" /></IconButton>
                                </Box>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'var(--text-main)' }}>
                                {itemDetail.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--text-muted)', display: 'flex', gap: 1 }}>
                                {itemDetail.location?.city}, {itemDetail.location?.state}
                                <span>•</span>
                                {itemDetail?.postedAt && new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(new Date(Number(itemDetail.postedAt)))}
                            </Typography>
                        </Box>

                        {/* Seller Card */}
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Seller Information</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <Avatar
                                    sx={{ width: 64, height: 64, bgcolor: 'var(--primary)', fontWeight: 700, fontSize: '1.5rem' }}
                                >
                                    {itemDetail.postedBy?.firstName?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {itemDetail.postedBy?.firstName} {itemDetail.postedBy?.lastName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                        Verified Professional Seller
                                    </Typography>
                                </Box>
                            </Box>

                            {itemDetail.postedBy?._id !== userId ? (
                                <Button
                                    fullWidth
                                    className="btn-primary"
                                    onClick={handleChatWithSeller}
                                    sx={{ py: 1.5, fontSize: '1rem' }}
                                >
                                    Chat with Seller
                                </Button>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                    sx={{ py: 1.5, borderRadius: '12px' }}
                                >
                                    This is your advertisement
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
