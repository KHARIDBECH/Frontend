import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';

/**
 * Message Component
 * Displays a single message in the chat interface
 */
export default function Message({ message, own }) {
    // Format message timestamp
    const formatTimestamp = (dateString) => {
        const date = new Date(dateString);

        if (isToday(date)) {
            return format(date, 'h:mm a');
        }

        if (isYesterday(date)) {
            return `Yesterday, ${format(date, 'h:mm a')}`;
        }

        return format(date, 'MMM d, h:mm a');
    };

    const timestamp = formatTimestamp(message.createdAt);

    const sender = typeof message.senderId === 'object' ? message.senderId : null;
    const senderName = sender ? `${sender.firstName} ${sender.lastName}` : 'User';
    const senderInitials = sender ? sender.firstName[0] : 'U';
    const senderPic = sender ? sender.profilePic : '';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: own ? 'flex-end' : 'flex-start',
                mb: 2,
                px: 1
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: own ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1.5,
                    maxWidth: '85%'
                }}
            >
                {/* Avatar */}
                <Avatar
                    src={senderPic}
                    sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: own ? 'var(--primary)' : 'rgba(0, 0, 0, 0.1)',
                        color: own ? 'white' : 'var(--text-muted)'
                    }}
                >
                    {own ? 'You' : senderInitials}
                </Avatar>

                {/* Message Bubble Container */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: own ? 'flex-end' : 'flex-start' }}>
                    {!own && (
                        <Typography variant="caption" sx={{ ml: 1, mb: 0.5, color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 600 }}>
                            {senderName}
                        </Typography>
                    )}
                    <Box
                        sx={{
                            p: 1.5,
                            px: 2,
                            borderRadius: own ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            bgcolor: own ? '#6366f1' : '#f1f5f9',
                            color: own ? '#ffffff' : '#0f172a',
                            boxShadow: own
                                ? '0 4px 12px rgba(99, 102, 241, 0.2)'
                                : 'none',
                            border: own ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight: 1.6,
                                wordBreak: 'break-word',
                                color: 'inherit'
                            }}
                        >
                            {message.text}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Timestamp */}
            <Typography
                variant="caption"
                sx={{
                    mt: 0.5,
                    color: 'var(--text-light)',
                    fontSize: '0.7rem',
                    mx: 6
                }}
            >
                {timestamp}
            </Typography>
        </Box>
    );
}
