import React from 'react';
import { Card, CardMedia, CardContent, Box, IconButton, Typography, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';

const ProductCard = React.memo(({ data, userId }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const isMyPost = data.postedBy === userId;

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price?.toLocaleString()}`;
  };

  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const posted = new Date(date);
    const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(posted);
  };

  return (
    <Card sx={{
      width: '100%',
      maxWidth: '320px',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(0,0,0,0.04)',
      boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
      bgcolor: '#fff',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.15)',
        '& .card-media': { transform: 'scale(1.08)' },
        '& .price-tag': { transform: 'translateY(-2px)' }
      }
    }}>
      {/* Image Container */}
      <Box sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '200px',
        bgcolor: '#f1f5f9'
      }}>
        <CardMedia
          component="img"
          className="card-media"
          sx={{
            height: '100%',
            width: '100%',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            objectFit: 'cover'
          }}
          image={data.images?.[0]?.url || 'https://via.placeholder.com/320x200?text=No+Image'}
          alt={data.title}
        />

        {/* Gradient Overlay */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Favorite Button */}
        <IconButton
          onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
          sx={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            bgcolor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            width: 36,
            height: 36,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'white',
              transform: 'scale(1.1)',
            }
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ fontSize: 18, color: '#ef4444' }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 18, color: '#64748b' }} />
          )}
        </IconButton>

        {/* Category Tag */}
        <Chip
          label={data.category}
          size="small"
          sx={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            bgcolor: 'rgba(255,255,255,0.95)',
            color: '#475569',
            fontWeight: 600,
            fontSize: '0.7rem',
            height: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />

        {/* My Post Tag */}
        {isMyPost && (
          <Chip
            label="My Post"
            size="small"
            sx={{
              position: 'absolute',
              top: '12px',
              left: '85px', // Adjust offset to be next to category
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: '24px',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
              border: 'none'
            }}
          />
        )}

        {/* Price Tag */}
        <Box
          className="price-tag"
          sx={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            px: 2,
            py: 0.75,
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
            transition: 'transform 0.2s ease',
          }}>
          {formatPrice(data.price)}
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.5, pt: 2 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#0f172a',
            fontSize: '1rem',
            lineHeight: 1.3,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em'
          }}
        >
          {data.title}
        </Typography>

        {/* Location */}
        {(data.location?.city || data.location?.state) && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 1.5,
            color: '#64748b'
          }}>
            <LocationOnIcon sx={{ fontSize: 14 }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              {data.location?.city && `${data.location.city}`}
              {data.location?.city && data.location?.state && ', '}
              {data.location?.state}
            </Typography>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 1.5,
          borderTop: '1px solid rgba(0,0,0,0.06)'
        }}>
          {/* Seller Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VerifiedIcon sx={{ fontSize: 14, color: '#10b981' }} />
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.75rem' }}>
              Verified
            </Typography>
          </Box>

          {/* Time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              {getTimeAgo(data.postedAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
