import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { config } from '../../Constants';
import { useAuth } from '../../AuthContext';
import {
  Paper,
  Typography,
  Box,
  Skeleton,
  Button,
  Container,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomDialog from '../../components/CustomDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  position: 'relative',
  '&:hover': {
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)'
  }
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  ...(status === 'Active' && {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
  }),
  ...(status === 'Sold' && {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
  }),
  ...(status === 'Expired' && {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    color: '#6b7280',
  }),
}));

function AdItem({ Product, onDelete, onStatusChange }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if (!Product) return (
    <StyledAdCard>
      <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: '16px', mr: 3 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="30%" height={20} />
      </Box>
    </StyledAdCard>
  );

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/edit-ad/${Product._id}`);
  };

  const handleMarkAsSold = () => {
    handleMenuClose();
    onStatusChange(Product._id, 'Sold');
  };

  const handleMarkAsActive = () => {
    handleMenuClose();
    onStatusChange(Product._id, 'Active');
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(Product._id);
  };

  return (
    <StyledAdCard>
      {/* Image */}
      <Box sx={{ width: 100, height: 100, borderRadius: '16px', overflow: 'hidden', mr: 3, flexShrink: 0 }}>
        <img
          src={Product.images?.[0]?.url || 'https://via.placeholder.com/100'}
          alt={Product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
            {Product.createdAt && new Date(Product.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
          <StatusChip label={Product.status || 'Active'} status={Product.status || 'Active'} size="small" />
        </Box>

        <Link to={`/item/${Product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mt: 0.5,
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {Product.title}
          </Typography>
        </Link>

        <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
          ₹{Product.price?.toLocaleString()}
        </Typography>
      </Box>

      {/* Actions Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="View Ad">
          <IconButton
            component={Link}
            to={`/item/${Product._id}`}
            sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="More options">
          <IconButton
            onClick={handleMenuClick}
            sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
              minWidth: 180
            }
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: 'var(--primary)' }} />
            </ListItemIcon>
            <ListItemText>Edit Ad</ListItemText>
          </MenuItem>

          {Product.status !== 'Sold' ? (
            <MenuItem onClick={handleMarkAsSold}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" sx={{ color: '#10b981' }} />
              </ListItemIcon>
              <ListItemText>Mark as Sold</ListItemText>
            </MenuItem>
          ) : (
            <MenuItem onClick={handleMarkAsActive}>
              <ListItemIcon>
                <StorefrontIcon fontSize="small" sx={{ color: '#10b981' }} />
              </ListItemIcon>
              <ListItemText>Mark as Active</ListItemText>
            </MenuItem>
          )}

          <MenuItem onClick={handleDelete} sx={{ color: '#ef4444' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText>Delete Ad</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </StyledAdCard>
  );
}

export default function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [adToDelete, setAdToDelete] = useState(null);
  const { authHeader } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const url = config.url.API_URL;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${url}/product/${adToDelete}`, { headers: authHeader() });
      setAds(ads.filter(p => p._id !== adToDelete));
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Remove failed:", err.message);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    setStatusUpdating(productId);
    try {
      const response = await axios.patch(
        `${url}/product/${productId}/status`,
        { status: newStatus },
        { headers: authHeader() }
      );

      if (response.data.success) {
        setAds(ads.map(ad =>
          ad._id === productId ? { ...ad, status: newStatus } : ad
        ));
      }
    } catch (err) {
      console.error("Status update failed:", err.message);
    } finally {
      setStatusUpdating(null);
    }
  };

  const openDeleteDialog = (productId) => {
    setAdToDelete(productId);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const headers = authHeader();
        if (!headers.Authorization) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${url}/users/my-listing?page=${currentPage}`, { headers });
        if (response.data.success && response.data.data) {
          const { ads: fetchedAds, pagination } = response.data.data;
          setAds(prev => currentPage === 1 ? fetchedAds : [...prev, ...fetchedAds]);
          setTotalPages(pagination.totalPages);
        }
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
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>My Advertisements</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 0.5 }}>
            Manage your listings, edit details, or mark items as sold
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/post-ad"
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '14px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5
          }}
        >
          + Post New Ad
        </Button>
      </Box>

      {loading ? (
        <Box>
          {[...Array(6)].map((_, i) => <AdItem key={i} />)}
        </Box>
      ) : ads.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '24px' }}>
          <StorefrontIcon sx={{ fontSize: 64, color: 'var(--text-muted)', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">You haven't posted any ads yet.</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Start selling your items today!
          </Typography>
          <Link to="/post-ad" style={{ textDecoration: 'none' }}>
            <Button variant="contained" className="btn-primary" sx={{ mt: 1 }}>Start Selling</Button>
          </Link>
        </Box>
      ) : (
        <Box>
          {ads.map((p, i) => (
            <AdItem
              key={p?._id || i}
              Product={p}
              onDelete={openDeleteDialog}
              onStatusChange={handleStatusChange}
            />
          ))}
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
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Advertisement?"
        content="This action cannot be undone. Are you sure you want to remove this listing?"
        actions={[
          { label: 'Cancel', onClick: () => setDeleteDialogOpen(false), disabled: deleting },
          {
            label: deleting ? <CircularProgress size={24} color="inherit" /> : 'Delete',
            onClick: handleDelete,
            color: 'error',
            disabled: deleting
          }
        ]}
      />
    </Container>
  );
}
