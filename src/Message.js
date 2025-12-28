import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';

export default function Message({ message, own }) {
    const messageDate = new Date(message.createdAt);

    const timeString = isToday(messageDate)
        ? format(messageDate, 'hh:mm a')
        : isYesterday(messageDate)
            ? 'Yesterday'
            : format(messageDate, 'MM/dd/yyyy');

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: own ? 'flex-end' : 'flex-start',
            mb: 2
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: own ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1.5,
                maxWidth: '80%'
            }}>
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem',
                        bgcolor: own ? 'var(--primary)' : 'rgba(0,0,0,0.1)'
                    }}
                >
                    {own ? 'Me' : 'S'}
                </Avatar>

                <Box sx={{
                    p: 2,
                    borderRadius: own ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    bgcolor: own ? 'var(--primary)' : 'white',
                    color: own ? 'white' : 'var(--text-main)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)',
                }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                        {message.text}
                    </Typography>
                </Box>
            </Box>
            <Typography variant="caption" sx={{
                mt: 0.5,
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                mx: 6
            }}>
                {timeString}
            </Typography>
        </Box>
    );
}
