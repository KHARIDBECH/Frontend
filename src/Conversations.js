import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Skeleton,
    Box
} from '@mui/material';

import { useAuth } from './AuthContext';
import { config } from './Constants';

/**
 * Conversation Component
 * Displays a single conversation in the chat list
 */
export default function Conversation({ conversation, userId, active }) {
    const { authHeader } = useAuth();
    const apiUrl = config.url.API_URL;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const friend = conversation.members.find(member => {
            const memberId = typeof member === 'object' ? member._id : member;
            return memberId !== userId;
        });

        if (friend && typeof friend === 'object') {
            setUser(friend);
            setLoading(false);
        } else if (friend) {
            // Fallback if not populated for some reason
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(
                        `${apiUrl}/api/users/user/${friend}`,
                        { headers: authHeader() }
                    );
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [conversation, userId, apiUrl, authHeader]);

    // Loading skeleton
    if (loading) {
        return (
            <ListItem sx={{ px: 2, py: 1.5 }}>
                <ListItemAvatar>
                    <Skeleton variant="circular" width={48} height={48} />
                </ListItemAvatar>
                <ListItemText
                    primary={<Skeleton width="60%" />}
                    secondary={<Skeleton width="40%" />}
                />
            </ListItem>
        );
    }

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
    const initials = user?.firstName?.[0] || '?';

    return (
        <ListItem
            sx={{
                px: 2,
                py: 1.5,
                borderRadius: '12px',
                mx: 1,
                mb: 0.5,
                bgcolor: active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: active ? 'rgba(99, 102, 241, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                }
            }}
        >
            <ListItemAvatar>
                <Avatar
                    src={user?.profilePic}
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: active ? 'var(--primary)' : 'rgba(0, 0, 0, 0.1)',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                    }}
                >
                    {initials}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: active ? 700 : 600, color: 'var(--text-main)' }}
                    >
                        {fullName}
                    </Typography>
                }
                secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Tap to view messages
                        </Typography>
                        {active && (
                            <Box sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#10b981'
                            }} />
                        )}
                    </Box>
                }
            />
        </ListItem>
    );
}
