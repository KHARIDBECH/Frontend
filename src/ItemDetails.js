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
import SEOHead from './components/SEOHead';

// Context & Config
import { useAuth } from './AuthContext';
import { config } from './Constants';
import { generateProductSchema, generateBreadcrumbSchema, BASE_URL } from './utils/seo';

// Styles
import 'react-responsive-carousel/lib/styles/carousel.min.css';

/**
 * ItemDetails Component
 * Displays detailed information about a product listing with full SEO optimization
 */
export default function ItemDetails() {
    const { productUrl } = useParams();
    const navigate = useNavigate();
    const { userId, isAuth, loading: authLoading, setOpenSignIn, authHeader } = useAuth();

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
        if (!isAuth) {
            setOpenSignIn(true);
            return;
        }

        if (!userId) return; // Prevent action if userId is not yet available but isAuth is true

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
    }, [userId, isAuth, itemDetail, apiUrl, navigate, setOpenSignIn, authHeader]);

    // Handle share functionality
    const handleShare = useCallback(() => {
        if (navigator.share && itemDetail) {
            navigator.share({
                title: itemDetail.title,
                text: `Check out this ${itemDetail.title} for ₹${formatPrice(itemDetail.price)} on Kharid Bech`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard?.writeText(window.location.href);
        }
    }, [itemDetail]);

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

    // Generate SEO content
    const getSEOContent = () => {
        if (!itemDetail) return {};

        const title = `${itemDetail.title} - ₹${formatPrice(itemDetail.price)}`;
        const description = `Buy ${itemDetail.title} for ₹${formatPrice(itemDetail.price)} in ${itemDetail.location?.city || ''}, ${itemDetail.location?.state || ''}. ${itemDetail.description?.substring(0, 120)}...`;
        const keywords = `${itemDetail.title}, ${itemDetail.category}, buy ${itemDetail.category?.toLowerCase()}, used ${itemDetail.category?.toLowerCase()}, ${itemDetail.location?.city}, second hand`;
        const image = itemDetail.images?.[0] || `${BASE_URL}/appLogo.png`;
        const url = `${BASE_URL}/item/${productUrl}`;

        return { title, description, keywords, image, url };
    };

    // Generate schemas
    const productSchema = itemDetail ? generateProductSchema(itemDetail) : null;
    const breadcrumbSchema = itemDetail ? generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: itemDetail.category, url: `${BASE_URL}/${itemDetail.category}` },
        { name: itemDetail.title, url: `${BASE_URL}/item/${productUrl}` },
    ]) : null;

    const combinedSchema = productSchema && breadcrumbSchema ? [productSchema, breadcrumbSchema] : null;

    // Loading state
    if (loading || authLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <SEOHead
                    title="Loading Product..."
                    description="Loading product details on Kharid Bech"
                    noIndex={true}
                />
                <AdDetailSkeletonLoader />
            </Container>
        );
    }

    // Not found state
    if (notFound || !itemDetail) {
        return (
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                <SEOHead
                    title="Product Not Found"
                    description="The product you're looking for could not be found"
                    noIndex={true}
                />
                <Typography variant="h1" align="center" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    Product Not Found
                </Typography>
            </Container>
        );
    }

    const { title, description, keywords, image, url } = getSEOContent();
    const descriptionLines = itemDetail.description?.split('\n') || [];
    const isOwnListing = itemDetail.postedBy?._id === userId;

    return (
        <>
            <SEOHead
                title={title}
                description={description}
                keywords={keywords}
                image={image}
                url={url}
                type="product"
                schema={combinedSchema}
            />
            <Container maxWidth="lg" sx={{ py: 6 }} component="main">
                <article itemScope itemType="https://schema.org/Product">
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
                                <Carousel
                                    itemDetail={itemDetail.images}
                                    showThumbnails={true}
                                    useBrowserHistory={false}
                                />
                            </Box>

                            {/* Description Card */}
                            <Box component="section" className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                                <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: '1.5rem' }}>
                                    Description
                                </Typography>
                                <Box
                                    sx={{ color: 'var(--text-muted)', lineHeight: 1.8 }}
                                    itemProp="description"
                                >
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
                                <Box component="header" className="glass" sx={{ p: 4, borderRadius: '24px', mb: 3 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        mb: 2
                                    }}>
                                        <Typography
                                            variant="h3"
                                            sx={{ fontWeight: 800, color: 'var(--primary)', fontSize: '2rem' }}
                                            itemProp="offers"
                                            itemScope
                                            itemType="https://schema.org/Offer"
                                        >
                                            <meta itemProp="priceCurrency" content="INR" />
                                            <span itemProp="price" content={itemDetail.price}>₹{formatPrice(itemDetail.price)}</span>
                                            <link itemProp="availability" href="https://schema.org/InStock" />
                                            <link itemProp="itemCondition" href="https://schema.org/UsedCondition" />
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                sx={{ border: '1px solid rgba(0,0,0,0.05)' }}
                                                onClick={handleShare}
                                                aria-label="Share this product"
                                            >
                                                <ShareIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ border: '1px solid rgba(0,0,0,0.05)' }}
                                                aria-label="Add to favorites"
                                            >
                                                <FavoriteBorderIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography
                                        variant="h1"
                                        sx={{ fontWeight: 600, mb: 2, color: 'var(--text-main)', fontSize: '1.25rem' }}
                                        itemProp="name"
                                    >
                                        {itemDetail.title}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', display: 'flex', gap: 1 }}>
                                        <span itemProp="areaServed">{itemDetail.location?.city}, {itemDetail.location?.state}</span>
                                        <span>•</span>
                                        <time dateTime={itemDetail?.postedAt}>
                                            {itemDetail?.postedAt && formatDate(itemDetail.postedAt)}
                                        </time>
                                    </Typography>
                                </Box>

                                {/* Seller Card */}
                                <Box component="aside" className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                        Seller Information
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                        <Avatar
                                            src={itemDetail.postedBy?.profilePic}
                                            alt={`${itemDetail.postedBy?.firstName}'s profile`}
                                            loading="lazy"
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
                                            aria-label={`Chat with ${itemDetail.postedBy?.firstName} about ${itemDetail.title}`}
                                        >
                                            Chat with Seller
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </article>
            </Container>
        </>
    );
}
