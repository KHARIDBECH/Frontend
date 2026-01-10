import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { Country, State, City } from 'country-state-city';
import { styled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    MenuItem,
    Autocomplete,
    TextField,
    Typography,
    Grid,
    Button,
    IconButton,
    Container,
    Snackbar,
    Alert,
    FormControlLabel,
    Switch,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    Skeleton
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Context & Config
import { useAuth } from '../../AuthContext';
import { config } from '../../Constants';

// Constants
const MAX_IMAGES = 5;
const ACCEPTED_IMAGE_TYPES = { 'image/png': [], 'image/jpeg': [], 'image/webp': [] };

const CATEGORIES = config.CATEGORIES;
const CONDITIONS = ['New', 'Used', 'Refurbished'];

const SUBCATEGORIES = {
    'Cars': ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Minivan', 'Others'],
    'Bikes': ['Motorcycles', 'Scooters', 'Bicycles', 'Spare Parts', 'Accessories'],
    'Mobiles': ['Mobile Phones', 'Tablets', 'Accessories', 'Wearables'],
    'Electronics': ['TVs, Video - Audio', 'Computers & Laptops', 'Cameras & Lenses', 'Hard Disks, Printers & Monitors', 'ACs'],
    'Appliances': ['Washing Machines', 'Refrigerators', 'Microwaves', 'Kitchen Appliances'],
    'Furniture': ['Sofa & Dining', 'Beds & Wardrobes', 'Home Decor', 'Office Furniture'],
    'Watches': ['Men', 'Women', 'Kids', 'Smart Watches'],
    'Books': ['Educational', 'Fiction', 'Non-Fiction', 'Comics', 'Magazines'],
    'Clothing': ['Men', 'Women', 'Kids'],
    'Sports': ['Cricket', 'Football', 'Badminton', 'Gym & Fitness', 'Other Sports']
};

// Styled Components
const StyledDropzone = styled(Box)(({ theme }) => ({
    border: '2px dashed rgba(99, 102, 241, 0.3)',
    borderRadius: '24px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(99, 102, 241, 0.02)',
    '&:hover': {
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        transform: 'scale(1.01)'
    }
}));

const ExistingImageBox = styled(Box)({
    width: '100%',
    paddingTop: '100%',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid rgba(0,0,0,0.05)',
    '& img': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    }
});

// Validation Schema
const validationSchema = yup.object({
    title: yup.string().min(5).required('Title is required'),
    description: yup.string().min(20).required('Description is required'),
    price: yup.number().positive().required('Price is required'),
    category: yup.string().required('Category is required'),
    subcategory: yup.string().required('Subcategory is required'),
    condition: yup.string().required('Condition is required')
});

/**
 * EditAdPage Component
 * Allows users to edit their existing advertisements
 */
const EditAdPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authHeader } = useAuth();
    const apiUrl = config.url.API_URL;

    // Existing product data
    const [existingProduct, setExistingProduct] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    // Location State
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    // File State
    const [newFiles, setNewFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form handling
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            category: '',
            subcategory: '',
            condition: 'Used',
            price: '',
            negotiable: false
        },
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    // Fetch existing product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${apiUrl}/product/itemdetail/${id}`);
                if (response.data.success && response.data.data) {
                    const product = response.data.data;
                    setExistingProduct(product);
                    setExistingImages(product.images || []);

                    // Set form values
                    formik.setValues({
                        title: product.title || '',
                        description: product.description || '',
                        category: product.category || '',
                        subcategory: product.subcategory || '',
                        condition: product.condition || 'Used',
                        price: product.price || '',
                        negotiable: product.negotiable || false
                    });

                    // Try to set location
                    if (product.location) {
                        // Find country (assuming India for now, you can expand this)
                        const india = Country.getAllCountries().find(c => c.name === 'India');
                        if (india) {
                            setSelectedCountry(india);
                            const states = State.getStatesOfCountry(india.isoCode);
                            const matchedState = states.find(s =>
                                s.name.toLowerCase() === product.location.state?.toLowerCase()
                            );
                            if (matchedState) {
                                setSelectedState(matchedState);
                                const cities = City.getCitiesOfState(india.isoCode, matchedState.isoCode);
                                const matchedCity = cities.find(c =>
                                    c.name.toLowerCase() === product.location.city?.toLowerCase()
                                );
                                if (matchedCity) {
                                    setSelectedCity(matchedCity);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setSnackbar({ open: true, message: 'Failed to load product data', severity: 'error' });
            } finally {
                setPageLoading(false);
            }
        };

        fetchProduct();
    }, [id, apiUrl]);

    // Handle form submission
    async function handleSubmit(values) {
        if (existingImages.length + newFiles.length === 0) {
            setSnackbar({ open: true, message: 'At least one image is required', severity: 'error' });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('subcategory', values.subcategory);
        formData.append('condition', values.condition);
        formData.append('price', values.price);
        formData.append('negotiable', values.negotiable);

        // Add new images
        newFiles.forEach(file => formData.append('images', file));

        // Add images to remove
        if (imagesToRemove.length > 0) {
            formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
        }

        // Append location
        if (selectedCity || selectedState) {
            const location = {};
            if (selectedCity) location.city = selectedCity.name;
            if (selectedState) location.state = selectedState.name;
            formData.append('location', JSON.stringify(location));
        }

        try {
            await axios.put(`${apiUrl}/product/${id}`, formData, {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
            });

            setSnackbar({ open: true, message: 'Your ad has been updated successfully!', severity: 'success' });
            setTimeout(() => navigate('/my-ads'), 1500);
        } catch (error) {
            console.error('Error updating ad:', error);
            setSnackbar({ open: true, message: 'Failed to update ad. Please try again.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }

    // Handle new file drop
    const handleDrop = useCallback((acceptedFiles) => {
        const totalImages = existingImages.length + newFiles.length + acceptedFiles.length;
        if (totalImages > MAX_IMAGES) {
            setSnackbar({
                open: true,
                message: `Maximum ${MAX_IMAGES} images allowed`,
                severity: 'warning'
            });
            return;
        }

        const newFilesWithPreview = acceptedFiles.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        setNewFiles(prev => [...prev, ...newFilesWithPreview]);
    }, [existingImages.length, newFiles.length]);

    // Remove new file
    const removeNewFile = useCallback((fileToRemove) => {
        URL.revokeObjectURL(fileToRemove.preview);
        setNewFiles(prev => prev.filter(file => file.path !== fileToRemove.path));
    }, []);

    // Remove existing image
    const removeExistingImage = useCallback((imageToRemove) => {
        setExistingImages(prev => prev.filter(img => img.filename !== imageToRemove.filename));
        setImagesToRemove(prev => [...prev, imageToRemove.filename]);
    }, []);

    // Location Handlers
    const handleCountryChange = (_, value) => {
        setSelectedCountry(value);
        setSelectedState(null);
        setSelectedCity(null);
    };

    const handleStateChange = (_, value) => {
        setSelectedState(value);
        setSelectedCity(null);
    };

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        formik.setFieldValue('category', value);
        formik.setFieldValue('subcategory', '');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: ACCEPTED_IMAGE_TYPES,
        multiple: true
    });

    if (pageLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Box sx={{ mb: 6 }}>
                    <Skeleton width={200} height={40} sx={{ mb: 1 }} />
                    <Skeleton width={300} height={24} />
                </Box>
                <Box className="glass" sx={{ p: 4, borderRadius: '24px', mb: 4 }}>
                    <Skeleton width={200} height={32} sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4].map(i => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Skeleton height={56} sx={{ borderRadius: '12px' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/my-ads')}
                    sx={{ mb: 2, color: 'var(--text-muted)', textTransform: 'none' }}
                >
                    Back to My Ads
                </Button>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
                    Edit Your <span style={{ color: 'var(--primary)' }}>Ad</span>
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                    Update your listing details
                </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={4}>
                    {/* General Information */}
                    <Grid item xs={12}>
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                General Information
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="title"
                                        label="Ad Title"
                                        {...formik.getFieldProps('title')}
                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                        helperText={formik.touched.title && formik.errors.title}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        id="description"
                                        label="Description"
                                        {...formik.getFieldProps('description')}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            id="category"
                                            label="Category"
                                            value={formik.values.category}
                                            onChange={handleCategoryChange}
                                            onBlur={formik.handleBlur}
                                            name="category"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                            ))}
                                        </Select>
                                        {formik.touched.category && formik.errors.category && (
                                            <Typography variant="caption" color="error" sx={{ mx: 2 }}>{formik.errors.category}</Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth disabled={!formik.values.category} error={formik.touched.subcategory && Boolean(formik.errors.subcategory)}>
                                        <InputLabel id="subcategory-label">Subcategory</InputLabel>
                                        <Select
                                            labelId="subcategory-label"
                                            id="subcategory"
                                            label="Subcategory"
                                            {...formik.getFieldProps('subcategory')}
                                        >
                                            {formik.values.category && SUBCATEGORIES[formik.values.category] ? (
                                                SUBCATEGORIES[formik.values.category].map(sub => (
                                                    <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="" disabled>Select Category First</MenuItem>
                                            )}
                                        </Select>
                                        {formik.touched.subcategory && formik.errors.subcategory && (
                                            <Typography variant="caption" color="error" sx={{ mx: 2 }}>{formik.errors.subcategory}</Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={formik.touched.condition && Boolean(formik.errors.condition)}>
                                        <InputLabel id="condition-label">Condition</InputLabel>
                                        <Select
                                            labelId="condition-label"
                                            id="condition"
                                            label="Condition"
                                            {...formik.getFieldProps('condition')}
                                        >
                                            {CONDITIONS.map(cond => (
                                                <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                                            ))}
                                        </Select>
                                        {formik.touched.condition && formik.errors.condition && (
                                            <Typography variant="caption" color="error" sx={{ mx: 2 }}>{formik.errors.condition}</Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="price"
                                        label="Price (₹)"
                                        type="number"
                                        {...formik.getFieldProps('price')}
                                        error={formik.touched.price && Boolean(formik.errors.price)}
                                        helperText={formik.touched.price && formik.errors.price}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formik.values.negotiable}
                                                onChange={formik.handleChange}
                                                name="negotiable"
                                                color="primary"
                                            />
                                        }
                                        label="Price Negotiable"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Location Details */}
                    <Grid item xs={12}>
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                Location Details
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Autocomplete
                                    sx={{ flex: 1, minWidth: '200px' }}
                                    options={Country.getAllCountries()}
                                    getOptionLabel={option => option.name}
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    renderInput={params => <TextField {...params} label="Country" />}
                                />
                                <Autocomplete
                                    sx={{ flex: 1, minWidth: '200px' }}
                                    options={selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []}
                                    getOptionLabel={option => option.name}
                                    value={selectedState}
                                    onChange={handleStateChange}
                                    renderInput={params => <TextField {...params} label="State" />}
                                    disabled={!selectedCountry}
                                />
                                <Autocomplete
                                    sx={{ flex: 1, minWidth: '200px' }}
                                    options={selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []}
                                    getOptionLabel={option => option.name}
                                    value={selectedCity}
                                    onChange={(_, value) => setSelectedCity(value)}
                                    renderInput={params => <TextField {...params} label="City" />}
                                    disabled={!selectedState}
                                />
                            </Box>
                        </Box>
                    </Grid>

                    {/* Photo Upload */}
                    <Grid item xs={12}>
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                Photos
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 3 }}>
                                {existingImages.length + newFiles.length} / {MAX_IMAGES} images
                            </Typography>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'var(--text-muted)' }}>
                                        Current Images
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {existingImages.map((image, index) => (
                                            <Grid item xs={4} sm={2.4} key={image.filename || index}>
                                                <ExistingImageBox>
                                                    <img src={image.url} alt={`Existing ${index + 1}`} />
                                                    <IconButton
                                                        onClick={() => removeExistingImage(image)}
                                                        size="small"
                                                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)' }}
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </ExistingImageBox>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* New Images */}
                            {newFiles.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'var(--text-muted)' }}>
                                        New Images
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {newFiles.map((file, index) => (
                                            <Grid item xs={4} sm={2.4} key={file.path || index}>
                                                <Box sx={{ width: '100%', pt: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                                                    <img src={file.preview} alt={`New ${index + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <IconButton onClick={() => removeNewFile(file)} size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)' }}>
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Dropzone */}
                            {(existingImages.length + newFiles.length) < MAX_IMAGES && (
                                <StyledDropzone {...getRootProps()} sx={{ borderColor: isDragActive ? 'var(--primary)' : undefined }}>
                                    <input {...getInputProps()} />
                                    <IconButton color="primary" sx={{ mb: 1, bgcolor: 'rgba(99,102,241,0.1)' }}>
                                        <AddPhotoAlternateIcon />
                                    </IconButton>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {isDragActive ? 'Drop images here' : 'Add More Photos'}
                                    </Typography>
                                </StyledDropzone>
                            )}
                        </Box>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            type="submit"
                            disabled={loading}
                            startIcon={!loading && <SaveIcon />}
                            sx={{
                                p: 2,
                                fontSize: '1.1rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                borderRadius: '16px',
                                fontWeight: 600
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: '14px' }} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default EditAdPage;
