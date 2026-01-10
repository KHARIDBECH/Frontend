import React, { useState, useEffect, useRef } from 'react';
import useDebounce from '../hooks/useDebounce';
import {
    Box,
    Typography,
    Slider,
    TextField,
    InputAdornment,
    Button,
    Collapse,
    IconButton,
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const FilterContainer = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(3)
}));

const PriceInput = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
        },
        '& fieldset': {
            borderColor: 'rgba(0,0,0,0.08)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(99, 102, 241, 0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--primary)',
        }
    }
});

const PRESET_RANGES = [
    { label: 'Under ₹1K', min: 0, max: 1000 },
    { label: '₹1K - ₹5K', min: 1000, max: 5000 },
    { label: '₹5K - ₹10K', min: 5000, max: 10000 },
    { label: '₹10K - ₹25K', min: 10000, max: 25000 },
    { label: '₹25K - ₹50K', min: 25000, max: 50000 },
    { label: 'Above ₹50K', min: 50000, max: null },
];

const MAX_PRICE = 500000;

export default function PriceFilter({ onApply, initialMin = 0, initialMax = MAX_PRICE, sidebar = false }) {
    const [isOpen, setIsOpen] = useState(!sidebar); // Default open if sidebar, closed otherwise
    const [priceRange, setPriceRange] = useState([initialMin, initialMax]);
    const [minInput, setMinInput] = useState(initialMin.toString());
    const [maxInput, setMaxInput] = useState(initialMax === MAX_PRICE || initialMax === null ? '' : initialMax.toString());
    const [activeFilter, setActiveFilter] = useState(null);
    const lastClickTime = useRef(0);

    // Debounce the price range for automatic filtering
    const debouncedPriceRange = useDebounce(priceRange, 400);

    // Sync internal state with props (important for URL changes/resets)
    useEffect(() => {
        setPriceRange([initialMin, initialMax === null ? MAX_PRICE : initialMax]);
        setMinInput(initialMin.toString());
        setMaxInput(initialMax === null || initialMax === MAX_PRICE ? '' : initialMax.toString());
    }, [initialMin, initialMax]);

    // Auto-apply filters when debounced range changes (only in sidebar mode for live feel)
    useEffect(() => {
        if (sidebar) {
            const minPrice = debouncedPriceRange[0];
            const maxPrice = debouncedPriceRange[1] === MAX_PRICE ? null : debouncedPriceRange[1];

            // Only apply if actually changed from current props to avoid loop
            if (minPrice !== initialMin || maxPrice !== (initialMax === MAX_PRICE ? null : initialMax)) {
                onApply({ minPrice, maxPrice });
            }
        }
    }, [debouncedPriceRange, sidebar, onApply, initialMin, initialMax]);

    const handleSliderChange = (event, newValue) => {
        setPriceRange(newValue);
        setMinInput(newValue[0].toString());
        setMaxInput(newValue[1] === MAX_PRICE ? '' : newValue[1].toString());
        setActiveFilter(null);
    };

    const handleMinChange = (e) => {
        const value = e.target.value;
        setMinInput(value);
        const numValue = parseInt(value) || 0;
        setPriceRange([numValue, priceRange[1]]);
        setActiveFilter(null);
    };

    const handleMaxChange = (e) => {
        const value = e.target.value;
        setMaxInput(value);
        const numValue = value === '' ? MAX_PRICE : (parseInt(value) || MAX_PRICE);
        setPriceRange([priceRange[0], numValue]);
        setActiveFilter(null);
    };

    const handlePresetClick = (preset, index) => {
        setActiveFilter(index);
        setPriceRange([preset.min, preset.max || MAX_PRICE]);
        setMinInput(preset.min.toString());
        setMaxInput(preset.max ? preset.max.toString() : '');
    };

    const handleApply = () => {
        const now = Date.now();
        // 1 second throttle to prevent spamming
        if (now - lastClickTime.current < 1000) return;
        lastClickTime.current = now;

        const minPrice = parseInt(minInput) || 0;
        const maxPrice = maxInput === '' ? null : (parseInt(maxInput) || null);
        onApply({ minPrice, maxPrice });
        if (!sidebar) setIsOpen(false);
    };

    const handleClear = () => {
        setPriceRange([0, MAX_PRICE]);
        setMinInput('');
        setMaxInput('');
        setActiveFilter(null);
        onApply({ minPrice: null, maxPrice: null });
    };

    const hasActiveFilter = minInput !== '' || maxInput !== '';

    const FilterBody = (
        <FilterContainer sx={{ mt: sidebar ? 0 : 2, border: sidebar ? 'none' : '1px solid rgba(0,0,0,0.05)', boxShadow: sidebar ? 'none' : '0 4px 20px -5px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Filter by Price
                </Typography>
                {!sidebar && (
                    <IconButton size="small" onClick={() => setIsOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>

            {/* Price Slider */}
            <Box sx={{ px: 2, mb: 4 }}>
                <Slider
                    value={priceRange}
                    onChange={handleSliderChange}
                    min={0}
                    max={MAX_PRICE}
                    step={1000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                    sx={{
                        color: 'var(--primary)',
                        '& .MuiSlider-thumb': {
                            width: 20,
                            height: 20,
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.16)'
                            }
                        },
                        '& .MuiSlider-track': {
                            height: 6,
                            borderRadius: 3
                        },
                        '& .MuiSlider-rail': {
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(99, 102, 241, 0.2)'
                        }
                    }}
                />
            </Box>

            {/* Manual Input */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
                <PriceInput
                    size="small"
                    placeholder="Min"
                    value={minInput}
                    onChange={handleMinChange}
                    type="number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{ flex: 1 }}
                />
                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</Typography>
                <PriceInput
                    size="small"
                    placeholder="Max"
                    value={maxInput}
                    onChange={handleMaxChange}
                    type="number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{ flex: 1 }}
                />
            </Box>

            {/* Preset Chips */}
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'var(--text-muted)' }}>
                Quick Ranges
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {PRESET_RANGES.map((preset, index) => (
                    <Chip
                        key={index}
                        label={preset.label}
                        clickable
                        onClick={() => handlePresetClick(preset, index)}
                        sx={{
                            borderRadius: '10px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: activeFilter === index ? 'var(--primary)' : 'rgba(99, 102, 241, 0.08)',
                            color: activeFilter === index ? 'white' : 'var(--primary)',
                            '&:hover': {
                                bgcolor: activeFilter === index ? 'var(--primary)' : 'rgba(99, 102, 241, 0.15)'
                            }
                        }}
                    />
                ))}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleClear}
                    fullWidth
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'rgba(0,0,0,0.1)',
                        color: 'var(--text-muted)'
                    }}
                >
                    Clear
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApply}
                    fullWidth
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5b54e0 0%, #6a3d9a 100%)'
                        }
                    }}
                >
                    Apply
                </Button>
            </Box>
        </FilterContainer>
    );

    if (sidebar) {
        return FilterBody;
    }

    return (
        <Box sx={{ mb: 3 }}>
            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                startIcon={<FilterListIcon />}
                sx={{
                    borderRadius: '14px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    bgcolor: hasActiveFilter ? 'var(--primary)' : 'rgba(99, 102, 241, 0.1)',
                    color: hasActiveFilter ? 'white' : 'var(--primary)',
                    '&:hover': {
                        bgcolor: hasActiveFilter ? 'var(--primary)' : 'rgba(99, 102, 241, 0.15)'
                    }
                }}
            >
                Price Filter
                {hasActiveFilter && (
                    <Chip
                        size="small"
                        label={`₹${minInput || 0}${maxInput ? ` - ₹${maxInput}` : '+'}`}
                        sx={{
                            ml: 1,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            height: 24,
                            fontSize: '0.75rem'
                        }}
                    />
                )}
            </Button>

            {/* Filter Panel */}
            <Collapse in={isOpen}>
                {FilterBody}
            </Collapse>
        </Box>
    );
}
