import React, { useState, useCallback } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { Country, State, City } from 'country-state-city';
import { styled } from '@mui/material/styles';
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
    Select
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SellIcon from '@mui/icons-material/Sell';

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

// Validation Schema
const validationSchema = yup.object({
    title: yup.string().min(5).required('Title is required'),
    description: yup.string().min(20).required('Description is required'),
    price: yup.number().positive().required('Price is required'),
    category: yup.string().required('Category is required'),
    subcategory: yup.string().required('Subcategory is required'),
    condition: yup.string().required('Condition is required'),
    images: yup.array().min(1, 'Upload at least one image').max(MAX_IMAGES)
});

/**
 * AdPostPage Component
 * Allows users to create and post new advertisements
 */
const AdPostPage = () => {
    const { authHeader, userId } = useAuth();
    const apiUrl = config.url.API_URL;

    // Location State
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    // File State
    const [files, setFiles] = useState([]);

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
            negotiable: false,
            images: []
        },
        validationSchema,
        onSubmit: handleSubmit
    });

    // Handle form submission
    async function handleSubmit(values) {
        setLoading(true);

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('subcategory', values.subcategory);
        formData.append('condition', values.condition);
        formData.append('price', values.price);
        formData.append('negotiable', values.negotiable);

        values.images.forEach(file => formData.append('images', file));

        // Append location
        if (selectedCity) formData.append('location[city]', selectedCity.name);
        if (selectedState) formData.append('location[state]', selectedState.name);

        try {
            await axios.post(`${apiUrl}/api/product`, formData, {
                headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
            });

            setSnackbar({ open: true, message: 'Your ad has been posted successfully!', severity: 'success' });
            formik.resetForm();
            setFiles([]);
            setSelectedCountry(null);
            setSelectedState(null);
            setSelectedCity(null);
        } catch (error) {
            console.error('Error posting ad:', error);
            setSnackbar({ open: true, message: 'Failed to post ad. Please try again.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }

    // Handle file drop
    const handleDrop = useCallback((acceptedFiles) => {
        if (files.length + acceptedFiles.length > MAX_IMAGES) {
            setSnackbar({
                open: true,
                message: `Maximum ${MAX_IMAGES} images allowed`,
                severity: 'warning'
            });
            return;
        }

        const newFiles = acceptedFiles.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        formik.setFieldValue('images', updatedFiles);
    }, [files, formik]);

    // Handle file removal
    const removeFile = useCallback((fileToRemove) => {
        URL.revokeObjectURL(fileToRemove.preview);
        const updatedFiles = files.filter(file => file.path !== fileToRemove.path);
        setFiles(updatedFiles);
        formik.setFieldValue('images', updatedFiles);
    }, [files, formik]);

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
        // Reset subcategory when category changes
        formik.setFieldValue('subcategory', '');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: ACCEPTED_IMAGE_TYPES,
        multiple: true
    });

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
                    Post Your <span style={{ color: 'var(--primary)' }}>Ad</span>
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                    Reach thousands of potential buyers in minutes
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
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Photos</Typography>
                            <StyledDropzone {...getRootProps()} sx={{ borderColor: isDragActive ? 'var(--primary)' : undefined }}>
                                <input {...getInputProps()} />
                                <IconButton color="primary" sx={{ mb: 1, bgcolor: 'rgba(99,102,241,0.1)' }}>
                                    <AddPhotoAlternateIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {isDragActive ? 'Drop images here' : 'Click or Drag to Upload'}
                                </Typography>
                            </StyledDropzone>

                            {files.length > 0 && (
                                <Grid container spacing={2} sx={{ mt: 3 }}>
                                    {files.map((file, index) => (
                                        <Grid item xs={4} sm={2.4} key={file.path || index}>
                                            <Box sx={{ width: '100%', pt: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.05)' }}>
                                                <img src={file.preview} alt={`Preview ${index + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <IconButton onClick={() => removeFile(file)} size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)' }}><ClearIcon fontSize="small" /></IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            {formik.touched.images && formik.errors.images && (
                                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>{formik.errors.images}</Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button fullWidth type="submit" disabled={loading} startIcon={!loading && <SellIcon />} sx={{ p: 2, fontSize: '1.1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '16px', fontWeight: 600 }}>
                            {loading ? 'Posting...' : 'Post Advertisement'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: '14px' }} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </Container>
    );
}

export default AdPostPage;
