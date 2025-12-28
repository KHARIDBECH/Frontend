import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Skeleton } from '@mui/material';
import { config } from './Constants';

export default function Conversations({ conversation, userId, active }) {
    const { authHeader } = useAuth();
    const url = config.url.API_URL;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const friendId = conversation.members.find(m => m !== userId);
        const getUser = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${url}/api/users/user/${friendId}`, { headers: authHeader() });
                setUser(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (friendId) getUser();
    }, [conversation, userId, url, authHeader]);

    if (loading) return (
        <ListItem alignItems="flex-start" sx={{ px: 2, py: 1.5 }}>
            <ListItemAvatar>
                <Skeleton variant="circular" width={48} height={48} />
            </ListItemAvatar>
            <ListItemText
                primary={<Skeleton width="60%" />}
                secondary={<Skeleton width="40%" />}
            />
        </ListItem>
    );

    return (
        <ListItem alignItems="flex-start" sx={{ px: 2, py: 1.5 }}>
            <ListItemAvatar>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: active ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                        fontWeight: 700
                    }}
                >
                    {user?.firstName?.[0]}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </Typography>
                }
                secondary={
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Member since 2023
                    </Typography>
                }
            />
        </ListItem>
    );
}
