import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, Button, Breadcrumbs, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchOffIcon from '@mui/icons-material/SearchOff';

// Components
import Cards from '../../components/Cards';
import SEOHead from '../../components/SEOHead';
import PriceFilter from '../../components/PriceFilter';

// Config
import { config } from '../../Constants';
import { useAuth } from '../../AuthContext';

/**
 * SearchResults Component
 * Displays products matching a search query in a focused listing layout
 */
export default function SearchResults() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { token, loading: authLoading } = useAuth();
    const apiUrl = config.url.API_URL;

    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(12);
    const [loading, setLoading] = useState(false);

    const q = searchParams.get('q') || '';

    // Price filter state
    const [priceFilter, setPriceFilter] = useState({
        minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : null,
        maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : null
    });

    useEffect(() => {
        if (authLoading) return;

        const fetchResults = async () => {
            setLoading(true);
            try {
                let url = `${apiUrl}/product`;
                const params = new URLSearchParams();

                if (q) params.append('search', q);
                if (priceFilter.minPrice) params.append('minPrice', priceFilter.minPrice);
                if (priceFilter.maxPrice) params.append('maxPrice', priceFilter.maxPrice);

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch search results');

                const result = await response.json();
                setData(result.data || []);
            } catch (error) {
                console.error('Search error:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [q, apiUrl, token, authLoading, priceFilter]);

    const handlePriceFilterApply = useCallback(({ minPrice, maxPrice }) => {
        setPriceFilter({ minPrice, maxPrice });

        // Update URL params
        const newParams = new URLSearchParams(searchParams);
        if (minPrice) {
            newParams.set('minPrice', minPrice.toString());
        } else {
            newParams.delete('minPrice');
        }
        if (maxPrice) {
            newParams.set('maxPrice', maxPrice.toString());
        } else {
            newParams.delete('maxPrice');
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const handleLoadMore = () => {
        setVisible(prev => prev + 8);
    };

    return (
        <>
            <SEOHead
                title={q ? `Search results for "${q}"` : 'Search Products'}
                description={`Find the best deals for ${q} and more on Kharid Bech. Browse verified listings at great prices.`}
            />

            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 3 }}
                >
                    <Link component={RouterLink} to="/" underline="hover" color="inherit">
                        Home
                    </Link>
                    <Typography color="text.primary">Search Results</Typography>
                </Breadcrumbs>

                {/* Header Section */}
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                        {q ? (
                            <>Results for <span style={{ color: 'var(--primary)' }}>"{q}"</span></>
                        ) : (
                            'Browse All Products'
                        )}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        {loading ? 'Searching...' : `Found ${data.length} items matching your criteria`}
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={3.5}>
                        <Box sx={{ position: 'sticky', top: '100px' }}>
                            <PriceFilter
                                onApply={handlePriceFilterApply}
                                initialMin={priceFilter.minPrice || 0}
                                initialMax={priceFilter.maxPrice || 500000}
                                sidebar={true}
                            />
                            <Box className="glass" sx={{ p: 3, mt: 3, borderRadius: '20px', textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                                    More filters coming soon!
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8.5}>
                        {/* Results Grid */}
                        {data.length > 0 || loading ? (
                            <Box>
                                <Cards data={data} visible={visible} loading={loading} />

                                {visible < data.length && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                                        <Button
                                            onClick={handleLoadMore}
                                            variant="outlined"
                                            sx={{
                                                px: 6,
                                                py: 1.5,
                                                borderRadius: '14px',
                                                fontWeight: 600,
                                                color: 'var(--primary)',
                                                borderColor: 'rgba(99, 102, 241, 0.3)',
                                                '&:hover': {
                                                    borderColor: 'var(--primary)',
                                                    bgcolor: 'rgba(99, 102, 241, 0.05)'
                                                }
                                            }}
                                        >
                                            Load More Results
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            /* Empty State */
                            <Box sx={{
                                textAlign: 'center',
                                py: 12,
                                px: 4,
                                bgcolor: 'rgba(241, 245, 249, 0.5)',
                                borderRadius: '32px',
                                border: '2px dashed #e2e8f0'
                            }}>
                                <SearchOffIcon sx={{ fontSize: 80, color: '#94a3b8', mb: 3 }} />
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                                    No results found for "{q}"
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: '500px', mx: 'auto' }}>
                                    We couldn't find any items matching your search. Try adjusting your keywords or browse popular categories.
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/"
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 4
                                    }}
                                >
                                    Back to Home
                                </Button>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
