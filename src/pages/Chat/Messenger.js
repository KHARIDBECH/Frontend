import { React, useEffect, useState, useRef } from 'react'
import './messenger.css'
import Conversation from '../../Conversations.js'
import Message from '../../Message.js'
import axios from 'axios'
import { io } from "socket.io-client";
import { config } from '../../Constants.js'

import { useAuth } from '../../AuthContext';
import { Box, Container, Typography, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';

export default function Messenger() {
    const { userId, authHeader } = useAuth();
    const url = config.url.API_URL;
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        socket.current = io(url);
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                senderId: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
        return () => socket.current.disconnect();
    }, [url]);

    useEffect(() => {
        if (arrivalMessage && currentChat?.members.includes(arrivalMessage.senderId)) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        if (userId) {
            socket.current.emit("addUser", userId);
        }
    }, [userId]);

    useEffect(() => {
        const getConversation = async () => {
            try {
                const res = await axios.get(`${url}/api/chatConvo/${userId}`, { headers: authHeader() });
                setConversations(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (userId) getConversation();
    }, [userId, url, authHeader]);

    useEffect(() => {
        const getMessages = async () => {
            if (currentChat) {
                try {
                    const res = await axios.get(`${url}/api/chatMessages/${currentChat._id}`, { headers: authHeader() });
                    setMessages(res.data);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        if (currentChat) getMessages();
    }, [currentChat, url, authHeader]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessages.trim()) return;

        const addMessagesFormat = {
            conversationId: currentChat._id,
            senderId: userId,
            text: newMessages
        };

        const receiverId = currentChat.members.find(member => member !== userId);

        socket.current.emit("sendMessage", {
            senderId: userId,
            receiverId,
            text: newMessages,
        });

        try {
            const res = await axios.post(`${url}/api/chatMessages/`, addMessagesFormat, { headers: authHeader() });
            setMessages([...messages, res.data]);
            setNewMessages('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 120px)', mt: 3 }}>
            <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
                {/* Conversations Sidebar */}
                <Box className="glass" sx={{
                    flex: { xs: 0, md: 3, lg: 2.5 },
                    display: { xs: 'none', md: 'flex' },
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
                        {conversations.map((c) => (
                            <Box
                                key={c._id}
                                onClick={() => setCurrentChat(c)}
                                sx={{
                                    mb: 1,
                                    borderRadius: '16px',
                                    transition: 'all 0.2s',
                                    bgcolor: currentChat?._id === c._id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
                                }}
                            >
                                <Conversation conversation={c} userId={userId} active={currentChat?._id === c._id} />
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Chat Area */}
                <Box className="glass" sx={{
                    flex: { xs: 1, md: 6, lg: 7.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '24px',
                    overflow: 'hidden'
                }}>
                    {currentChat ? (
                        <>
                            {/* Chat Header */}
                            <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)', bgcolor: 'rgba(255,255,255,0.3)' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Conversation with Seller
                                </Typography>
                            </Box>

                            {/* Messages List */}
                            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {messages.map((m) => (
                                    <div key={m._id} ref={scrollRef}>
                                        <Message message={m} own={m.senderId === userId} />
                                    </div>
                                ))}
                            </Box>

                            {/* Input Area */}
                            <Box sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 2, alignItems: 'center' }}>
                                <textarea
                                    placeholder="Write a message..."
                                    className="chatMessageInput"
                                    onChange={e => setNewMessages(e.target.value)}
                                    value={newMessages}
                                    style={{
                                        flex: 1,
                                        height: '50px',
                                        borderRadius: '16px',
                                        padding: '12px 20px',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        resize: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                />
                                <IconButton
                                    className="btn-primary"
                                    onClick={sendMessage}
                                    sx={{ width: '50px', height: '50px', borderRadius: '16px', p: 0 }}
                                >
                                    <SendIcon sx={{ color: 'white' }} />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                            <ChatIcon sx={{ fontSize: '100px', mb: 2 }} />
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>Your Workspace</Typography>
                            <Typography variant="body1">Select a conversation to start chatting</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
}
