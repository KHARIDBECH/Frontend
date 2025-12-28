import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { config } from '../../Constants';
import { Box, MenuItem, Autocomplete, TextField, Typography, Grid, Button, IconButton, Container } from '@mui/material';
import { Country, State, City } from 'country-state-city';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import SellIcon from '@mui/icons-material/Sell';
import { useAuth } from '../../AuthContext';

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

export default function AdPostPage() {
    const { authHeader, userId } = useAuth();
    const url = config.url.API_URL;

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleDrop = (acceptedFiles) => {
        if (files.length + acceptedFiles.length > 5) {
            return;
        }
        const newFiles = acceptedFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        }));
        setFiles((prev) => [...prev, ...newFiles]);
        formik.setFieldValue('images', [...files, ...newFiles]);
    };

    const removeFile = (file) => {
        setFiles((prev) => prev.filter((f) => f.path !== file.path));
        formik.setFieldValue('images', files.filter((f) => f.path !== file.path));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: { 'image/png': [], 'image/jpeg': [] },
        multiple: true,
    });

    const SignupSchema = yup.object({
        title: yup.string().min(10, 'Title too short').required('Title is required'),
        description: yup.string().min(20, 'Description too short').required('Description is required'),
        price: yup.number().positive('Price must be positive').required('Price is required'),
        category: yup.string().required('Category required'),
        images: yup.array().min(1, 'At least one image is required').max(5, 'Max 5 images'),
    });

    const formik = useFormik({
        initialValues: { title: '', description: '', category: '', price: '', images: [] },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            setLoading(true);
            let finalData = new FormData();
            finalData.append('title', values.title);
            finalData.append('description', values.description);
            finalData.append('category', values.category);
            finalData.append('price', values.price);
            finalData.append('postedBy', userId);
            values.images.forEach(file => finalData.append('images', file));

            if (selectedCity) finalData.append('location[city]', selectedCity.name);
            if (selectedState) finalData.append('location[state]', selectedState.name);
            if (selectedCountry) finalData.append('location[country]', selectedCountry.name);

            try {
                await axios.post(`${url}/api/product`, finalData, {
                    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
                });
                alert('Success! Your ad is live.');
            } catch (err) {
                console.error(err);
                alert('Error posting ad. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    const categories = [
        'Cars', 'Mobiles', 'Bikes', 'Electronics', 'Appliances', 'Furniture', 'Fashion', 'Books', 'Sports'
    ];

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
                    Post Your <span style={{ color: 'var(--primary)' }}>Ad</span>
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-muted)' }}>
                    Reach thousands of potential buyers in minutes.
                </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>General Information</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="title"
                                        label="Ad Title"
                                        placeholder="e.g. iPhone 13 Pro Max - 256GB"
                                        {...formik.getFieldProps('title')}
                                        error={formik.touched.title && !!formik.errors.title}
                                        helperText={formik.touched.title && formik.errors.title}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Description"
                                        placeholder="Describe what you are selling in detail..."
                                        {...formik.getFieldProps('description')}
                                        error={formik.touched.description && !!formik.errors.description}
                                        helperText={formik.touched.description && formik.errors.description}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Price (₹)"
                                        type="number"
                                        {...formik.getFieldProps('price')}
                                        error={formik.touched.price && !!formik.errors.price}
                                        helperText={formik.touched.price && formik.errors.price}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Category"
                                        {...formik.getFieldProps('category')}
                                        error={formik.touched.category && !!formik.errors.category}
                                        helperText={formik.touched.category && formik.errors.category}
                                    >
                                        {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Location Details</Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Autocomplete
                                    sx={{ flex: 1, minWidth: '200px' }}
                                    options={Country.getAllCountries()}
                                    getOptionLabel={o => o.name}
                                    value={selectedCountry}
                                    onChange={(_, v) => { setSelectedCountry(v); setSelectedState(null); setSelectedCity(null); }}
                                    renderInput={p => <TextField {...p} label="Country" />}
                                />
                                <Autocomplete
                                    sx={{ flex: 1, minWidth: '200px' }}
                                    options={selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []}
                                    getOptionLabel={o => o.name}
                                    value={selectedState}
                                    onChange={(_, v) => { setSelectedState(v); setSelectedCity(null); }}
                                    renderInput={p => <TextField {...p} label="State" />}
                                    disabled={!selectedCountry}
                                />
                                <Autocomplete
                                    sx={{ flex: 1, minWidth: '200px' }}
                                    options={selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []}
                                    getOptionLabel={o => o.name}
                                    value={selectedCity}
                                    onChange={(_, v) => setSelectedCity(v)}
                                    renderInput={p => <TextField {...p} label="City" />}
                                    disabled={!selectedState}
                                />
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box className="glass" sx={{ p: 4, borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Photos</Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: 'var(--text-muted)' }}>Up to 5 images. First one will be the cover.</Typography>

                            <StyledDropzone {...getRootProps()}>
                                <input {...getInputProps()} />
                                <IconButton color="primary" sx={{ mb: 1, bgcolor: 'rgba(99,102,241,0.1)' }}>
                                    <ClearIcon sx={{ transform: 'rotate(45deg)' }} />
                                </IconButton>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Click or Drag to Upload</Typography>
                                <Typography variant="caption">PNG, JPG or WEBP (Max 5MB)</Typography>
                            </StyledDropzone>

                            {files.length > 0 && (
                                <Grid container spacing={2} sx={{ mt: 3 }}>
                                    {files.map((file, idx) => (
                                        <Grid item xs={4} sm={2.4} key={idx} sx={{ position: 'relative' }}>
                                            <Box sx={{
                                                width: '100%',
                                                pt: '100%',
                                                position: 'relative',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                border: '2px solid rgba(0,0,0,0.05)'
                                            }}>
                                                <img
                                                    src={file.preview}
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                    alt="preview"
                                                />
                                                <IconButton
                                                    onClick={() => removeFile(file)}
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        bgcolor: 'rgba(255,255,255,0.8)',
                                                        '&:hover': { bgcolor: 'white' }
                                                    }}
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
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

                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            className="btn-primary"
                            type="submit"
                            disabled={loading}
                            sx={{ p: 2, fontSize: '1.1rem' }}
                            startIcon={!loading && <SellIcon />}
                        >
                            {loading ? 'Posting...' : 'Post Advertisement Now'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}
