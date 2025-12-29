import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Avatar,
    Paper,
    Grid,
    Divider,
    CircularProgress,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    Snackbar,
    Alert,
    Chip,
    Card,
    CardContent,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import { config } from '../../Constants';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WcIcon from '@mui/icons-material/Wc';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';

const GradientBackground = styled(Box)({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0 0 60px 60px',
    padding: '80px 20px 120px',
    marginBottom: '-80px',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        borderRadius: '0 0 60px 60px',
    }
});

const ProfileCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: theme.spacing(4),
    boxShadow: '0 20px 60px -15px rgba(0,0,0,0.15)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
    }
}));

const StatCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    boxShadow: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 35px -10px rgba(99, 102, 241, 0.25)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
    }
}));

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: '16px',
    marginBottom: theme.spacing(2),
    background: 'rgba(99, 102, 241, 0.04)',
    transition: 'all 0.2s ease',
    '&:hover': {
        background: 'rgba(99, 102, 241, 0.08)',
    }
}));

const Profile = () => {
    const { authHeader } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ gender: '', address: '' });
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const url = config.url.API_URL;

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${url}/api/users/me`, {
                headers: authHeader()
            });
            if (response.data.success) {
                setUser(response.data.data);
                setEditData({
                    gender: response.data.data.gender || 'Other',
                    address: response.data.data.address || ''
                });
            }
        } catch (err) {
            console.error("Error fetching user profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await axios.put(`${url}/api/users/profile`, editData, {
                headers: authHeader()
            });
            if (response.data.success) {
                setUser(response.data.data);
                setIsEditing(false);
                setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ gender: user.gender || 'Other', address: user.address || '' });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress sx={{ color: 'var(--primary)' }} />
            </Box>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5">Unable to load profile. Please sign in again.</Typography>
            </Container>
        );
    }

    const stats = [
        { icon: <StorefrontIcon sx={{ fontSize: 32 }} />, label: 'My Listings', value: '12', path: '/my-ads' },
        { icon: <ShoppingBagIcon sx={{ fontSize: 32 }} />, label: 'Purchases', value: '5', path: '/my-ads' },
        { icon: <ChatBubbleOutlineIcon sx={{ fontSize: 32 }} />, label: 'Messages', value: '8', path: '/chat' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
            {/* Gradient Header */}
            <GradientBackground>
                <Container maxWidth="lg">
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>
                        My Profile
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', mt: 1 }}>
                        Manage your account and preferences
                    </Typography>
                </Container>
            </GradientBackground>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <ProfileCard>
                    <Grid container spacing={4}>
                        {/* Left: Avatar & Name */}
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center', borderRight: { md: '1px solid rgba(0,0,0,0.06)' }, pr: { md: 4 } }}>
                            <Avatar
                                src={user.profilePic}
                                sx={{
                                    width: isMobile ? 120 : 150,
                                    height: isMobile ? 120 : 150,
                                    mx: 'auto',
                                    mb: 2,
                                    border: '6px solid white',
                                    boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.4)',
                                    bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                            >
                                {!user.profilePic && <PersonIcon sx={{ fontSize: isMobile ? 50 : 70, color: '#764ba2' }} />}
                            </Avatar>

                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                                {user.firstName} {user.lastName}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                                {user.email}
                            </Typography>

                            <Chip
                                icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />}
                                label="Verified Seller"
                                sx={{
                                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                                    color: '#059669',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    px: 1
                                }}
                            />

                            {/* Quick Stats */}
                            {/* <Grid container spacing={2} sx={{ mt: 4 }}>
                                {stats.map((stat, idx) => (
                                    <Grid item xs={4} key={idx}>
                                        <StatCard onClick={() => navigate(stat.path)}>
                                            <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                                                <Box sx={{ color: 'var(--primary)', mb: 0.5 }}>{stat.icon}</Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>{stat.value}</Typography>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>{stat.label}</Typography>
                                            </CardContent>
                                        </StatCard>
                                    </Grid>
                                ))}
                            </Grid> */}
                        </Grid>

                        {/* Right: Details */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ pl: { md: 4 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        Account Details
                                    </Typography>
                                    {!isEditing ? (
                                        <Button
                                            startIcon={<EditIcon />}
                                            onClick={() => setIsEditing(true)}
                                            sx={{
                                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                                                color: 'var(--primary)',
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                px: 2,
                                                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' }
                                            }}
                                        >
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                startIcon={<SaveIcon />}
                                                onClick={handleSave}
                                                disabled={saving}
                                                sx={{
                                                    bgcolor: 'var(--primary)',
                                                    color: 'white',
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    px: 2,
                                                    '&:hover': { bgcolor: '#5b54e0' }
                                                }}
                                            >
                                                {saving ? 'Saving...' : 'Save'}
                                            </Button>
                                            <IconButton onClick={handleCancel} sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>

                                {/* Info Rows */}
                                <InfoRow>
                                    <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', p: 1.5, borderRadius: '12px', mr: 2 }}>
                                        <EmailIcon sx={{ color: 'var(--primary)', display: 'block' }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Email Address</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>{user.email}</Typography>
                                    </Box>
                                </InfoRow>

                                <InfoRow>
                                    <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', p: 1.5, borderRadius: '12px', mr: 2 }}>
                                        <WcIcon sx={{ color: 'var(--primary)', display: 'block' }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Gender</Typography>
                                        {isEditing ? (
                                            <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                                                <Select
                                                    name="gender"
                                                    value={editData.gender}
                                                    onChange={handleChange}
                                                    sx={{ borderRadius: '12px', bgcolor: 'white' }}
                                                >
                                                    <MenuItem value="Male">Male</MenuItem>
                                                    <MenuItem value="Female">Female</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {user.gender || 'Not specified'}
                                            </Typography>
                                        )}
                                    </Box>
                                </InfoRow>

                                <InfoRow>
                                    <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', p: 1.5, borderRadius: '12px', mr: 2 }}>
                                        <LocationOnIcon sx={{ color: 'var(--primary)', display: 'block' }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Address</Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                name="address"
                                                value={editData.address}
                                                onChange={handleChange}
                                                size="small"
                                                placeholder="Enter your address"
                                                sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {user.address || 'Not specified'}
                                            </Typography>
                                        )}
                                    </Box>
                                </InfoRow>

                                <Divider sx={{ my: 3, opacity: 0.3 }} />

                                {/* Quick Actions */}
                                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2, fontWeight: 600 }}>
                                    Quick Actions
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/post-ad')}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '14px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1.5,
                                            boxShadow: '0 10px 20px -10px rgba(102, 126, 234, 0.5)'
                                        }}
                                    >
                                        Post New Ad
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/my-ads')}
                                        sx={{
                                            borderRadius: '14px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1.5,
                                            borderColor: 'rgba(0,0,0,0.1)',
                                            color: '#1e293b',
                                            '&:hover': { borderColor: 'var(--primary)', bgcolor: 'rgba(99, 102, 241, 0.05)' }
                                        }}
                                    >
                                        View My Ads
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/chat')}
                                        sx={{
                                            borderRadius: '14px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1.5,
                                            borderColor: 'rgba(0,0,0,0.1)',
                                            color: '#1e293b',
                                            '&:hover': { borderColor: 'var(--primary)', bgcolor: 'rgba(99, 102, 241, 0.05)' }
                                        }}
                                    >
                                        Open Messages
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </ProfileCard>
            </Container>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px' }} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;
