import React from 'react';
import { Card } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { config } from './Constants'



export default function ProductCard({ data }) {
  const url = config.url.API_URL;

  return (
    <Card sx={{
      width: '100%',
      maxWidth: '300px',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        '& .card-media': { transform: 'scale(1.05)' }
      }
    }}>
      <Box sx={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
        <CardMedia
          component="img"
          className="card-media"
          sx={{
            height: '100%',
            transition: 'transform 0.5s ease',
            objectFit: 'cover'
          }}
          image={data.images ? `${data.images[0]?.url}` : 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={data.title}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'white', color: '#ef4444' }
          }}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
        <Box sx={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          bgcolor: 'var(--primary)',
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.875rem',
          boxShadow: '0 4px 6px rgba(99,102,241,0.3)'
        }}>
          ₹{data.price?.toLocaleString()}
        </Box>
      </Box>

      <CardContent sx={{ p: 2, pb: '12px !important' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: 'var(--text-main)',
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {data.title}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 1
          }}
        >
          {data.location?.city && `${data.location.city}, `}{data.location?.state}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            {data.category}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
            {data?.postedAt && new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(Number(data.postedAt)))}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}


