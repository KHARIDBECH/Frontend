import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, InputBase, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

// Styled Components
const SearchContainer = styled(Box)(({ theme, variant }) => ({
    display: 'flex',
    alignItems: 'center',
    borderRadius: variant === 'banner' ? '16px' : '16px',
    backgroundColor: variant === 'banner' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(239, 242, 246, 0.6)',
    border: '1px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: variant === 'banner' ? '6px' : '0',
    maxWidth: variant === 'banner' ? '600px' : '600px',
    width: '100%',
    boxShadow: variant === 'banner' ? '0 20px 40px -10px rgba(0, 0, 0, 0.2)' : 'none',
    '&:hover': {
        backgroundColor: variant === 'banner' ? 'rgba(255, 255, 255, 1)' : 'rgba(239, 242, 246, 1)',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: variant === 'banner' ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 2px 10px rgba(0,0,0,0.02)'
    },
    '&:focus-within': {
        backgroundColor: 'white',
        border: '1px solid var(--primary)',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
        transform: 'translateY(-1px)'
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: variant === 'banner' ? 'column' : 'row',
        gap: variant === 'banner' ? '8px' : '0',
        padding: variant === 'banner' ? '12px' : '0',
    }
}));

const InputWrapper = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: '100%'
});

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#1e293b',
    flex: 1,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.5, 1, 1.5, 0),
        paddingLeft: theme.spacing(1),
        transition: theme.transitions.create('width'),
        width: '100%',
        fontWeight: 500,
        fontSize: '0.95rem',
        '&::placeholder': {
            color: '#94a3b8',
            opacity: 0.8,
            fontWeight: 400
        }
    },
}));

/**
 * Reusable SearchBox component for Nav and Banner.
 * @param {string} variant - 'nav' or 'banner' to control styling.
 * @param {string} placeholder - Placeholder text for input.
 */
export default function SearchBox({ variant = 'nav', placeholder = 'Search for anything...' }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');


    const handleSearchClick = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <SearchContainer variant={variant}>
            <InputWrapper>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={placeholder}
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </InputWrapper>
            {variant === 'banner' ? (
                <Button
                    variant="contained"
                    onClick={handleSearchClick}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        minWidth: { xs: '100%', sm: 'auto' },
                        mt: { xs: 0, sm: 0 }, // Reset default margin
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5b54e0 0%, #6a3d9a 100%)',
                            boxShadow: '0 8px 20px -5px rgba(99, 102, 241, 0.4)'
                        }
                    }}
                >
                    Search
                </Button>
            ) : (
                <IconButton
                    onClick={handleSearchClick}
                    size="small"
                    sx={{
                        mr: 0.75,
                        p: '6px',
                        bgcolor: 'transparent',
                        color: 'var(--primary)',
                        borderRadius: '10px',
                        border: '1px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            transform: 'scale(1.05)'
                        },
                        '&:active': {
                            transform: 'scale(0.95)'
                        }
                    }}
                >
                    <SearchIcon fontSize="small" />
                </IconButton>
            )}
        </SearchContainer>
    );
}
