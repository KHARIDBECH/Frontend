import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Grid,
    Container,
    Typography,
    Avatar,
    Box,
    Button,
    IconButton
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Components
import Carousel from './components/Carousel';
import AdDetailSkeletonLoader from './components/AdDetailSkeletonLoader';

// Context & Config
import { useAuth } from './AuthContext';
import { config } from './Constants';

// Styles
import 'react-responsive-carousel/lib/styles/carousel.min.css';

/**
 * ItemDetails Component
 * Displays detailed information about a product listing
 */
export default function ItemDetails() {
    const { productUrl } = useParams();
    const navigate = useNavigate();
    const { userId, setOpenSignIn, authHeader } = useAuth();

    // State
    const [itemDetail, setItemDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const apiUrl = config.url.API_URL;

    // Fetch product details
    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/product/itemdetail/${productUrl}`);

                if (response.status === 404) {
                    setNotFound(true);
                    return;
                }

                const result = await response.json();
                if (result?.data) {
                    setItemDetail(result.data);
                }
            } catch (error) {
                console.error('Error fetching item details:', error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [productUrl, apiUrl]);

    // Handle chat with seller
    const handleChatWithSeller = useCallback(async () => {
        if (!userId) {
            setOpenSignIn(true);
            return;
        }

        try {
            await axios.post(
                `${apiUrl}/api/chatConvo`,
                {
                    senderId: userId,
                    receiverId: itemDetail?.postedBy?._id,
                    productId: itemDetail?._id
                },
                { headers: authHeader() }
            );
            navigate('/chat');
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    }, [userId, itemDetail, apiUrl, navigate, setOpenSignIn, authHeader]);

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN').format(price);
    };

    // Format date
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    };

    // Loading state
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <AdDetailSkeletonLoader />
            </Container>
        );
    }

    // Not found state
    if (notFound || !itemDetail) {
        return (
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                <Typography variant="h5" align="center">
                    Product Not Found
                </Typography>
            </Container>
        );
    }

    const descriptionLines = itemDetail.description?.split('\n') || [];
    const isOwnListing = itemDetail.postedBy?._id === userId;

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                {/* Left Side: Images and Description */}
                <Grid item xs={12} md={7}>
                    {/* Image Carousel */}
                    <Box sx={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        bgcolor: 'black',
                        mb: 4
                    }}>
                        <Carousel itemDetail={itemDetail.images} />
                    </Box>

                    {/* Description Card */}
                    <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                            Description
                        </Typography>
                        <Box sx={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                            {descriptionLines.map((line, index) => (
                                <Typography key={index} variant="body1" sx={{ mb: 1.5 }}>
                                    {line}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {/* Right Side: Sticky Info Panel */}
                <Grid item xs={12} md={5}>
                    <Box sx={{ position: 'sticky', top: '100px' }}>
                        {/* Price & Title Card */}
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px', mb: 3 }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2
                            }}>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--primary)' }}>
                                    ₹{formatPrice(itemDetail.price)}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                                        <ShareIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                                        <FavoriteBorderIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'var(--text-main)' }}>
                                {itemDetail.title}
                            </Typography>

                            <Typography variant="body2" sx={{ color: 'var(--text-muted)', display: 'flex', gap: 1 }}>
                                {itemDetail.location?.city}, {itemDetail.location?.state}
                                <span>•</span>
                                {itemDetail?.postedAt && formatDate(itemDetail.postedAt)}
                            </Typography>
                        </Box>

                        {/* Seller Card */}
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                Seller Information
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <Avatar
                                    src={itemDetail.postedBy?.profilePic}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'var(--primary)',
                                        fontWeight: 700,
                                        fontSize: '1.5rem'
                                    }}
                                >
                                    {itemDetail.postedBy?.firstName?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {itemDetail.postedBy?.firstName} {itemDetail.postedBy?.lastName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                        Verified Seller
                                    </Typography>
                                </Box>
                            </Box>

                            {isOwnListing ? (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                    sx={{ py: 1.5, borderRadius: '12px' }}
                                >
                                    This is your listing
                                </Button>
                            ) : (
                                <Button
                                    fullWidth
                                    className="btn-primary"
                                    onClick={handleChatWithSeller}
                                    sx={{ py: 1.5, fontSize: '1rem' }}
                                >
                                    Chat with Seller
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
