import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DevicesIcon from '@mui/icons-material/Devices';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ChairIcon from '@mui/icons-material/Chair';
import WatchIcon from '@mui/icons-material/Watch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

// Category configuration
const CATEGORIES = [
    { name: 'Cars', icon: <DirectionsCarIcon sx={{ fontSize: 18 }} /> },
    { name: 'Bikes', icon: <TwoWheelerIcon sx={{ fontSize: 18 }} /> },
    { name: 'Mobiles', icon: <PhoneIphoneIcon sx={{ fontSize: 18 }} /> },
    { name: 'Electronics', icon: <DevicesIcon sx={{ fontSize: 18 }} /> },
    { name: 'Appliances', icon: <KitchenIcon sx={{ fontSize: 18 }} /> },
    { name: 'Furniture', icon: <ChairIcon sx={{ fontSize: 18 }} /> },
    { name: 'Watches', icon: <WatchIcon sx={{ fontSize: 18 }} /> },
    { name: 'Books', icon: <MenuBookIcon sx={{ fontSize: 18 }} /> },
    { name: 'Clothing', icon: <CheckroomIcon sx={{ fontSize: 18 }} /> },
    { name: 'Sports', icon: <SportsSoccerIcon sx={{ fontSize: 18 }} /> },
];

/**
 * CategoriesMenu Component
 * Horizontal scrollable category navigation
 */
const CategoriesMenu = () => {
    const location = useLocation();
    const scrollContainerRef = React.useRef(null);
    const [showLeftArrow, setShowLeftArrow] = React.useState(false);
    const [showRightArrow, setShowRightArrow] = React.useState(true);

    const currentPath = decodeURIComponent(location.pathname.slice(1));

    // Check scroll position to show/hide arrows
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Scroll left/right on arrow click
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    React.useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <Box sx={{
            bgcolor: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            py: 1,
            position: 'sticky',
            top: '64px',
            zIndex: 999,
            backdropFilter: 'blur(10px)',
        }}>
            <Box sx={{
                position: 'relative',
                maxWidth: '1280px',
                mx: 'auto',
                px: { xs: 1, md: 2 }
            }}>
                {/* Left Scroll Arrow */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        opacity: showLeftArrow ? 1 : 0,
                        pointerEvents: showLeftArrow ? 'auto' : 'none',
                        transition: 'opacity 0.2s ease',
                        background: 'linear-gradient(to right, white 60%, transparent)',
                        pr: 3,
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <IconButton
                        onClick={() => scroll('left')}
                        size="small"
                        sx={{
                            bgcolor: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: 'white' }
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>

                {/* Categories Scroll Container */}
                <Box
                    ref={scrollContainerRef}
                    sx={{
                        display: 'flex',
                        gap: 1,
                        overflowX: 'auto',
                        py: 1,
                        px: { xs: 1, md: 4 },
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                        alignItems: 'center',
                    }}
                >
                    {CATEGORIES.map((cat, index) => {
                        const isActive = currentPath === cat.name;
                        return (
                            <Link
                                to={`/${cat.name}`}
                                key={cat.name}
                                style={{ textDecoration: 'none', flexShrink: 0 }}
                            >
                                <Button
                                    startIcon={cat.icon}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        color: isActive ? 'white' : '#64748b',
                                        bgcolor: isActive ? 'var(--primary)' : 'transparent',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        borderRadius: '12px',
                                        px: 2.5,
                                        py: 1,
                                        textTransform: 'none',
                                        transition: 'all 0.2s ease',
                                        boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                        '&:hover': {
                                            color: isActive ? 'white' : 'var(--primary)',
                                            bgcolor: isActive ? 'var(--primary-hover)' : 'rgba(99, 102, 241, 0.08)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    {cat.name}
                                </Button>
                            </Link>
                        );
                    })}
                </Box>

                {/* Right Scroll Arrow */}
                <Box
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        opacity: showRightArrow ? 1 : 0,
                        pointerEvents: showRightArrow ? 'auto' : 'none',
                        transition: 'opacity 0.2s ease',
                        background: 'linear-gradient(to left, white 60%, transparent)',
                        pl: 3,
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <IconButton
                        onClick={() => scroll('right')}
                        size="small"
                        sx={{
                            bgcolor: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: 'white' }
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default CategoriesMenu;