import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdsDetails.css';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { config } from './Constants';
import { Box, MenuItem, Autocomplete, TextField, Typography, Grid, Button, IconButton } from '@mui/material';
import { Country, State, City } from 'country-state-city';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/system';
import ClearIcon from '@mui/icons-material/Clear';
import SellIcon from '@mui/icons-material/Sell';

const ThumbnailContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    border: '1px solid #eaeaea',
    width: '100%',
    height: 100,
    boxSizing: 'border-box',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
});

const ThumbnailImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
});

export default function AddDetails() {
    const url = config.url.API_URL;

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [files, setFiles] = useState([]);

    const changeCurrency = (price) => {
        let temp_price = price.toString();
        let lastThree = temp_price.substring(temp_price.length - 3);
        let otherNumbers = temp_price.substring(0, temp_price.length - 3);
        if (otherNumbers !== '') lastThree = ',' + lastThree;
        let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        return res;
    };

    const handleDrop = (acceptedFiles) => {
        if (files.length + acceptedFiles.length > 5) {
            alert('You can only upload up to 5 files.');
            return;
        }

        const newFiles = acceptedFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        }));

        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        formik.setFieldValue('images', [...files, ...newFiles]);
    };

    const removeFile = (file) => {
        setFiles((prevFiles) => prevFiles.filter((f) => f.path !== file.path));
        formik.setFieldValue('images', files.filter((f) => f.path !== file.path));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/png': [],
            'image/jpeg': [],
        },
        multiple: true,
    });

    const thumbs = files.map((file) => (
        <Grid item xs={3} key={file.name}>
            <ThumbnailContainer>
                <ThumbnailImage
                    src={file.preview}
                    alt={file.name}
                    onLoad={() => { URL.revokeObjectURL(file.preview); }}
                />
            </ThumbnailContainer>
            <IconButton
                aria-label="delete"
                onClick={() => removeFile(file)}
                sx={{
                    position: 'relative',
                    bottom: '79%',
                    left: '82%',
                }}
            >
                <ClearIcon />
            </IconButton>
        </Grid>
    ));

    const handleFormSubmit = (values) => {

        console.log(values)
        let finalData = new FormData();
        finalData.append('title', values.title);
        finalData.append('description', values.description);
        finalData.append('category', values.category);
        finalData.append('price', values.price);
        values.images.forEach((file) => {
            finalData.append('images', file);
        });

        console.log(selectedCity);
        finalData.append('location[city]', selectedCity.name);
        finalData.append('location[state]', selectedState.name);
        finalData.append('location[country]', selectedCountry.name);
        // finalData.append('state', selectedState.name);
        // finalData.append('city', selectedCity.name);

        for (const [key, value] of finalData) {
            console.log(value);
        }
        axios.post(`${url}/api/stuff/ad`, finalData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                authorization: 'Bearer ' + Cookies.get('Token'),
            },
        })
            .then((response) => {
                alert('Your Ad posted successfully');
            })
            .catch((error) => {
                console.error('Error posting ad:', error);
            });
    };

    const SignupSchema = yup.object({
        title: yup.string('Enter the title').required('Title is required'),
        description: yup.string('Enter the title Description').required('Description is required'),
        price: yup.string('Enter the price').required('Price is required'),
        category: yup.string('Choose category').required('Category required'),
        images: yup.array().min(1, 'At least one image is required').max(5, 'You can upload up to 5 images'),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            category: '',
            price: '',
            select: '',
            images: [],
        },
        validationSchema: SignupSchema,
        onSubmit: handleFormSubmit,
    });

    const categories = [
        { value: 'Cars', label: 'Cars' },
        { value: 'Mobiles', label: 'Mobiles' },
        { value: 'Jobs', label: 'Jobs' },
        { value: 'Bikes', label: 'Bikes' },
        { value: 'Electronics & Appliances', label: 'Electronics & Appliances' },
        { value: 'Commercial Vehicles & Spares', label: 'Commercial Vehicles & Spares' },
        { value: 'Furniture', label: 'Furniture' },
        { value: 'Fashion', label: 'Fashion' },
        { value: 'Books, Sports & Hobbies', label: 'Books, Sports & Hobbies' },
        { value: 'Pets', label: 'Pets' },
        { value: 'Services', label: 'Services' },
    ];

    useEffect(() => {
        console.log(selectedCountry);
        console.log(selectedCountry?.isoCode);
        console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
    }, [selectedCountry]);

    return (
        <div className="details-container">
            <div className="form-section" style={{ width: '57%' }}>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="title"
                        name="title"
                        label="Title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />
                    <TextField
                        id="description"
                        fullWidth
                        multiline
                        rows={4}
                        name="description"
                        label="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                    <Box display="flex" gap={2} width="100%">
                        <TextField
                            fullWidth
                            id="price"
                            name="price"
                            label="Price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                        <TextField
                            id="category"
                            select
                            label="Categories"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                            sx={{ width: '400px' }}
                        >
                            {categories.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box display="flex" gap={2} width="100%">
                        <Autocomplete
                            options={Country.getAllCountries()}
                            getOptionLabel={(option) => option.name}
                            value={selectedCountry}
                            onChange={(event, newValue) => setSelectedCountry(newValue)}
                            renderInput={(params) => <TextField {...params} label="Country" />}
                            style={{ marginBottom: "20px" }}
                            sx={{ width: '150px' }}
                            isOptionEqualToValue={(option, value) => option.latitude === value.latitude && option.longitude === value.longitude}
                        />

                        <Autocomplete
                            options={State?.getStatesOfCountry(selectedCountry?.isoCode) || []}
                            getOptionLabel={(option) => option.name}
                            value={selectedState}
                            onChange={(event, newValue) => setSelectedState(newValue)}
                            renderInput={(params) => <TextField {...params} label="State" />}
                            style={{ marginBottom: "20px" }}
                            disabled={!selectedCountry}
                            sx={{ width: '150px' }}
                            isOptionEqualToValue={(option, value) => option.latitude === value.latitude && option.longitude === value.longitude}
                        />

                        <Autocomplete
                            options={
                                City.getCitiesOfState(
                                    selectedState?.countryCode,
                                    selectedState?.isoCode
                                ) || []
                            }
                            getOptionLabel={(option) => option.name}
                            value={selectedCity}
                            onChange={(event, newValue) => setSelectedCity(newValue)}
                            renderInput={(params) => <TextField {...params} label="City" />}
                            disabled={!selectedState}
                            sx={{ width: '150px' }}
                            isOptionEqualToValue={(option, value) => option.latitude === value.latitude && option.longitude === value.longitude}
                        />
                    </Box>

                    <Box width="100%">
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: "2px dashed grey",
                                padding: "20px",
                                borderRadius: "5px",
                                textAlign: "center",
                                cursor: "pointer",
                            }}
                        >
                            <input {...getInputProps()} />
                            <Typography>
                                Drag and drop files here, or click to select files
                            </Typography>
                            <Typography variant="caption">(Up to 5 files)</Typography>
                        </Box>
                        {files.length > 0 && (
                            <Grid container spacing={2} mt={2}>
                                {thumbs}
                            </Grid>
                        )}
                    </Box>
                    <Button variant="contained" endIcon={<SellIcon />} type='submit'>
                        Sell
                    </Button>
                </form>
            </div>
        </div>
    )
}
