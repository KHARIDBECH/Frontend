import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './messenger.css'
import Conversation from '../../Conversations.js'
import Message from '../../Message.js'
import axios from 'axios'
import { config } from '../../Constants.js'

import { useAuth } from '../../AuthContext';
import { Box, Container, Typography, IconButton, Skeleton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logger from '../../utils/logger';



export default function Messenger() {
    const { userId, user, authHeader, refreshUnreadCount, socket, arrivalMessage, setArrivalMessage } = useAuth();
    const url = config.url.API_URL;
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [currentChat, setCurrentChat] = useState(location.state?.conversation || null);
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessages, setNewMessages] = useState('');
    const scrollRef = useRef();
    const chatBoxRef = useRef();
    const isInitialLoad = useRef(true);

    // Dynamic sidebar updates when arrivalMessage changes (global listener handled by Context)
    useEffect(() => {
        if (arrivalMessage) {
            logger.info("Messenger: Processing arrivalMessage", arrivalMessage.conversationId);

            // SMART AUGMENTATION: Find the sender profile from the conversation data we already have
            const targetConvo = conversations.find(c => c._id === arrivalMessage.conversationId);
            const senderProfile = targetConvo?.members.find(m => {
                const mId = typeof m === 'object' ? m._id : m;
                return String(mId) === String(arrivalMessage.senderId);
            });

            // If we found the profile, decorate the message bubble with it
            const augmentedMessage = {
                ...arrivalMessage,
                senderId: senderProfile || arrivalMessage.senderId // Fallback to ID if not found
            };

            // SIDEBAR UPDATE: Use conversationId for precise matching
            setConversations(prev => {
                const updated = prev.map(c => {
                    if (c._id === arrivalMessage.conversationId) {
                        return {
                            ...c,
                            lastMessage: augmentedMessage,
                            unreadCount: (currentChat?._id === c._id) ? 0 : (c.unreadCount + 1),
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return c;
                });
                return [...updated].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            });

            // CHAT WINDOW UPDATE: Add to messages if it's the current chat
            if (currentChat?._id === arrivalMessage.conversationId) {
                setMessages((prev) => [...prev, augmentedMessage]);
                setTimeout(() => {
                    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);

                // Mark as read and refresh unread count
                axios.patch(`${url}/api/chatConvo/read/${currentChat._id}`, {}, { headers: authHeader() })
                    .then(() => refreshUnreadCount())
                    .catch(err => logger.error("Read Error:", err.message));
            }

            // Clear arrival message from context after handling
            setArrivalMessage(null);
        }
    }, [arrivalMessage, currentChat, url, authHeader, refreshUnreadCount, setArrivalMessage, conversations]);

    useEffect(() => {
        const getConversation = async () => {
            setLoadingConversations(true);
            try {
                const res = await axios.get(`${url}/api/chatConvo/${userId}`, { headers: authHeader() });
                setConversations(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingConversations(false);
            }
        };
        if (userId) {
            getConversation();
        } else {
            setLoadingConversations(false);
        }
    }, [userId, url, authHeader]);

    useEffect(() => {
        const handleChatSelection = async () => {
            if (currentChat) {
                setPage(1);
                setHasMore(true);
                isInitialLoad.current = true;
                setMessages([]);
                setLoadingMessages(true);

                try {
                    // Mark as read
                    await axios.patch(`${url}/api/chatConvo/read/${currentChat._id}`, {}, { headers: authHeader() });
                    refreshUnreadCount();

                    // Update local conversations list to show 0 unread
                    setConversations(prev => prev.map(c =>
                        c._id === currentChat._id ? { ...c, unreadCount: 0 } : c
                    ));

                    // Get messages
                    const res = await axios.get(`${url}/api/chatMessages/${currentChat._id}?limit=10&page=1`, { headers: authHeader() });
                    setMessages(res.data.data || []);
                    setHasMore(res.data.hasMore);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoadingMessages(false);
                }
            }
        };
        handleChatSelection();
    }, [currentChat, url, authHeader, refreshUnreadCount]);

    const loadMoreMessages = async () => {
        if (!hasMore || loadingMore || !currentChat) return;
        setLoadingMore(true);
        const chatBox = chatBoxRef.current;
        const previousScrollHeight = chatBox.scrollHeight;
        const previousScrollTop = chatBox.scrollTop;

        try {
            const nextPage = page + 1;
            const res = await axios.get(`${url}/api/chatMessages/${currentChat._id}?limit=10&page=${nextPage}`, { headers: authHeader() });

            if (res.data.data.length > 0) {
                setMessages((prev) => [...res.data.data, ...prev]);
                setPage(nextPage);
                setHasMore(res.data.hasMore);

                // Use requestAnimationFrame to ensure DOM is updated before restoring scroll
                requestAnimationFrame(() => {
                    chatBox.scrollTop = chatBox.scrollHeight - previousScrollHeight + previousScrollTop;
                });
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && hasMore && !loadingMore) {
            loadMoreMessages();
        }
    };

    useLayoutEffect(() => {
        if (isInitialLoad.current && messages.length > 0) {
            scrollRef.current?.scrollIntoView({ behavior: "auto" });
            isInitialLoad.current = false;
        }
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!newMessages.trim()) return;

        const optimisticMessage = {
            _id: `temp-${Date.now()}`,
            conversationId: currentChat._id,
            senderId: {
                _id: userId,
                firstName: user?.firstName || 'Me',
                lastName: user?.lastName || '',
                profilePic: user?.profilePic || ''
            },
            text: newMessages,
            createdAt: new Date().toISOString(),
            isRead: false
        };

        const addMessagesFormat = {
            conversationId: currentChat._id,
            senderId: userId,
            text: newMessages
        };

        const activeMember = currentChat.members.find(member => {
            const mId = typeof member === 'object' ? member._id : member;
            return mId !== userId;
        });
        const receiverId = typeof activeMember === 'object' ? activeMember._id : activeMember;

        //  CLEAR INPUT & OPTIMISTIC UI UPDATE
        setNewMessages('');
        setMessages(prev => [...prev, optimisticMessage]);
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);


        socket.emit("sendMessage", {
            senderId: userId,
            receiverId,
            conversationId: currentChat._id,
            text: newMessages,
        }, (response) => {
            if (response && response.status === 'ok') {
                setMessages(prev => prev.map(m => m._id === optimisticMessage._id ? response.data : m));
            } else {
                console.error('Socket Message Error:', response?.message);
            }
        });

        // UPDATE CONVO LIST IMMEDIATELY
        setConversations(prev => {
            const updated = prev.map(c => {
                if (c._id === currentChat._id) {
                    return { ...c, lastMessage: optimisticMessage, updatedAt: new Date().toISOString() };
                }
                return c;
            });
            return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
    };

    return (
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 120px)', mt: 3 }}>
            <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
                {/* Conversations Sidebar */}
                <Box className="glass" sx={{
                    flex: { xs: 1, md: 3, lg: 2.5 },
                    display: { xs: currentChat ? 'none' : 'flex', md: 'flex' },
                    flexDirection: 'column',
                    borderRadius: '24px',
                    overflow: 'hidden'
                }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Messages</Typography>
                        <input
                            placeholder="Find a conversation..."
                            style={{
                                width: '100%',
                                marginTop: '16px',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.1)',
                                backgroundColor: 'rgba(255,255,255,0.5)'
                            }}
                        />
                    </Box>
                    <Box sx={{ overflowY: 'auto', flex: 1, p: 2 }}>
                        {loadingConversations ? (
                            [...Array(5)].map((_, i) => (
                                <Box key={i} sx={{ mb: 1, p: 1.5, borderRadius: '16px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Skeleton variant="circular" width={48} height={48} />
                                        <Box sx={{ flex: 1 }}>
                                            <Skeleton variant="text" width="60%" />
                                            <Skeleton variant="text" width="40%" />
                                        </Box>
                                    </Box>
                                </Box>
                            ))
                        ) : conversations.length > 0 ? (
                            conversations.map((c) => (
                                <Box
                                    key={c._id}
                                    onClick={() => setCurrentChat(c)}
                                    sx={{
                                        mb: 1,
                                        borderRadius: '16px',
                                        transition: 'all 0.2s',
                                        bgcolor: currentChat?._id === c._id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
                                    }}
                                >
                                    <Conversation conversation={c} userId={userId} active={currentChat?._id === c._id} />
                                </Box>
                            ))
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                opacity: 0.5,
                                textAlign: 'center',
                                p: 3
                            }}>
                                <ChatIcon sx={{ fontSize: '48px', mb: 2 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    No conversations yet
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                    Contact a seller from any product page to start a chat.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Chat Area */}
                <Box className="glass" sx={{
                    flex: { xs: 1, md: 6, lg: 7.5 },
                    display: { xs: currentChat ? 'flex' : 'none', md: 'flex' },
                    flexDirection: 'column',
                    borderRadius: '24px',
                    overflow: 'hidden'
                }}>
                    {currentChat ? (
                        <>
                            {/* Chat Header */}
                            <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)', bgcolor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                    onClick={() => setCurrentChat(null)}
                                    sx={{ display: { xs: 'flex', md: 'none' }, color: 'var(--text-main)' }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {(() => {
                                        const friend = currentChat.members.find(m => (typeof m === 'object' ? m._id : m) !== userId);
                                        return friend && typeof friend === 'object'
                                            ? `${friend.firstName} ${friend.lastName}`
                                            : 'Conversation';
                                    })()}
                                </Typography>
                            </Box>

                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                {/* Messages List */}
                                <Box
                                    ref={chatBoxRef}
                                    onScroll={handleScroll}
                                    sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
                                >
                                    {loadingMore && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                                            <Skeleton variant="text" width="100px" />
                                        </Box>
                                    )}
                                    {loadingMessages ? (
                                        [...Array(6)].map((_, i) => (
                                            <Box key={i} sx={{ display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', alignItems: 'flex-end', gap: 1.5, mb: 2 }}>
                                                <Skeleton variant="circular" width={32} height={32} />
                                                <Skeleton variant="rounded" width={i % 2 === 0 ? "60%" : "40%"} height={60} sx={{ borderRadius: '18px' }} />
                                            </Box>
                                        ))
                                    ) : (
                                        messages.map((m, index) => {
                                            const mSid = typeof m.senderId === 'object' ? m.senderId._id : m.senderId;
                                            const isOwn = String(mSid) === String(userId);
                                            return (
                                                <div key={m._id || index} ref={index === messages.length - 1 ? scrollRef : null}>
                                                    <Message message={m} own={isOwn} />
                                                </div>
                                            );
                                        })
                                    )}
                                </Box>

                                {/* Input Area */}
                                <Box sx={{
                                    p: 3,
                                    borderTop: '1px solid rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    bgcolor: 'rgba(255,255,255,0.4)',
                                    position: 'relative',
                                    zIndex: 10
                                }}>
                                    <textarea
                                        placeholder="Write a message..."
                                        className="chatMessageInput"
                                        onChange={e => setNewMessages(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        value={newMessages}
                                        style={{
                                            flex: 1,
                                            height: '50px',
                                            borderRadius: '16px',
                                            padding: '12px 20px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            resize: 'none',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.2s',
                                            outline: 'none',
                                            backgroundColor: 'white'
                                        }}
                                    />
                                    <IconButton
                                        className="btn-primary"
                                        onClick={sendMessage}
                                        disabled={!newMessages.trim()}
                                        sx={{
                                            width: '50px',
                                            minWidth: '50px',
                                            height: '50px',
                                            borderRadius: '16px',
                                            p: 0,
                                            transition: 'all 0.2s',
                                            bgcolor: 'var(--primary) !important',
                                            '&:hover': { transform: 'scale(1.05)', opacity: 0.9 },
                                            '&:active': { transform: 'scale(0.95)' },
                                            '&.Mui-disabled': {
                                                bgcolor: 'rgba(0,0,0,0.05) !important',
                                                color: 'rgba(0,0,0,0.2)'
                                            }
                                        }}
                                    >
                                        <SendIcon sx={{ color: 'white' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, textAlign: 'center', p: 4 }}>
                            <ChatIcon sx={{ fontSize: '100px', mb: 2 }} />
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                {conversations.length > 0 ? 'Your Workspace' : 'No Conversations'}
                            </Typography>
                            <Typography variant="body1">
                                {conversations.length > 0
                                    ? 'Select a conversation from the sidebar to start chatting'
                                    : 'You have not initiated any conversations yet. Start by browsing products!'}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
}
