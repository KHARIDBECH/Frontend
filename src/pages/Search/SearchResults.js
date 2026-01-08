import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchOffIcon from '@mui/icons-material/SearchOff';

// Components
import Cards from '../../components/Cards';
import SEOHead from '../../components/SEOHead';

// Config
import { config } from '../../Constants';
import { useAuth } from '../../AuthContext';

/**
 * SearchResults Component
 * Displays products matching a search query in a focused listing layout
 */
export default function SearchResults() {
    const location = useLocation();
    const { token, loading: authLoading } = useAuth();
    const apiUrl = config.url.API_URL;

    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(12);
    const [loading, setLoading] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q') || '';

    useEffect(() => {
        if (authLoading) return;

        const fetchResults = async () => {
            setLoading(true);
            try {
                let url = `${apiUrl}/api/product`;
                if (q) {
                    url += `?search=${encodeURIComponent(q)}`;
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
    }, [q, apiUrl, token, authLoading]);

    const handleLoadMore = () => {
        setVisible(prev => prev + 8);
    };

    return (
        <>
            <SEOHead
                title={q ? `Search results for "${q}"` : 'Search Products'}
                description={`Find the best deals for ${q} and more on Kharid Bech. Browse verified listings at great prices.`}
            />

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
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
            </Container>
        </>
    );
}
