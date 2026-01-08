import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { config } from '../../Constants';
import { useAuth } from '../../AuthContext';
import { Paper, Typography, Box, Skeleton, Button, Container, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomDialog from '../../components/CustomDialog';

const StyledAdCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '24px',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)'
  }
}));

function AdItem({ Product, setAdId, setOpen }) {
  if (!Product) return (
    <StyledAdCard>
      <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: '16px', mr: 3 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="30%" height={20} />
      </Box>
    </StyledAdCard>
  );

  return (
    <StyledAdCard>
      <Box sx={{ width: 100, height: 100, borderRadius: '16px', overflow: 'hidden', mr: 3 }}>
        <img
          src={Product.images?.[0]?.url || 'https://via.placeholder.com/100'}
          alt={Product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          {Product.postedAt && new Date(Product.postedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
        <Link to={`/item/${Product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>{Product.title}</Typography>
        </Link>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>₹{Product.price?.toLocaleString()}</Typography>
      </Box>
      <Button
        variant="outlined"
        color="error"
        onClick={() => { setAdId(Product._id); setOpen(true); }}
        sx={{ borderRadius: '12px', textTransform: 'none', px: 3 }}
      >
        Remove
      </Button>
    </StyledAdCard>
  );
}

export default function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [adId, setAdId] = useState(null);
  const { authHeader, userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const url = config.url.API_URL;

  const handleRemove = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${url}/api/product/${adId}`, { headers: authHeader() });
      setAds(ads.filter(p => p._id !== adId));
      setOpen(false);
    } catch (err) {
      console.error("Remove failed:", err.message);
      // setOpen(false); // keep open on error? or close? User probably wants to retry or see error. For now let's keep logic simple as requested.
    } finally {
      setDeleting(false);
      setOpen(false); // Close dialog in finally to ensure it closes even on error, or if success
    }
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const headers = authHeader();
        if (!headers.Authorization) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${url}/api/users/my-listing?page=${currentPage}`, { headers });
        setAds(prev => currentPage === 1 ? response.data.ads : [...prev, ...response.data.ads]);
        setTotalPages(response.data.pagination.totalPages);
        setLoading(false);
      } catch (err) {
        console.error("Fetch ads failed:", err.message);
        setLoading(false);
      }
    };
    fetchAds();
  }, [currentPage, authHeader, url]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>My Advertisements</Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
          Showing {ads.length} listings
        </Typography>
      </Box>

      {loading ? (
        <Box>
          {[...Array(6)].map((_, i) => <AdItem key={i} />)}
        </Box>
      ) : ads.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '24px' }}>
          <Typography variant="h6" color="textSecondary">You haven't posted any ads yet.</Typography>
          <Link to="/post-ad" style={{ textDecoration: 'none' }}>
            <Button variant="contained" className="btn-primary" sx={{ mt: 3 }}>Start Selling</Button>
          </Link>
        </Box>
      ) : (
        <Box>
          {ads.map((p, i) => <AdItem key={p?._id || i} Product={p} setAdId={setAdId} setOpen={setOpen} />)}
          {currentPage < totalPages && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button onClick={() => setCurrentPage(p => p + 1)} variant="outlined" sx={{ borderRadius: '12px', px: 4 }}>
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          )}
        </Box>
      )}

      <CustomDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Advertisement?"
        content="This action cannot be undone. Are you sure you want to remove this listing?"
        actions={[
          { label: 'Cancel', onClick: () => setOpen(false), disabled: deleting },
          {
            label: deleting ? <CircularProgress size={24} color="inherit" /> : 'Delete',
            onClick: handleRemove,
            color: 'error',
            disabled: deleting
          }
        ]}
      />
    </Container>
  );
}
