import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';

/**
 * Message Component
 * Displays a single message in the chat interface
 */
export default function Message({ message, own, senderInitial = 'S' }) {
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
                    maxWidth: '75%'
                }}
            >
                {/* Avatar */}
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: own ? 'var(--primary)' : 'rgba(0, 0, 0, 0.1)',
                        color: own ? 'white' : 'var(--text-muted)'
                    }}
                >
                    {own ? 'You' : senderInitial}
                </Avatar>

                {/* Message Bubble */}
                <Box
                    sx={{
                        p: 2,
                        px: 2.5,
                        borderRadius: own ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        bgcolor: own
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'white',
                        background: own
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'white',
                        color: own ? 'white' : 'var(--text-main)',
                        boxShadow: own
                            ? '0 4px 12px rgba(99, 102, 241, 0.25)'
                            : '0 2px 8px rgba(0, 0, 0, 0.06)',
                        border: own ? 'none' : '1px solid rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            lineHeight: 1.6,
                            wordBreak: 'break-word'
                        }}
                    >
                        {message.text}
                    </Typography>
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
