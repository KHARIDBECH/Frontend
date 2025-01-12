import { React, useEffect, useState, useRef } from 'react'
import './messenger.css'
import Conversation from '../../Conversations.js'
import Message from '../../Message.js'
import ChatOnline from '../../ChatOnline.js'
import Cookies from 'js-cookie'
import axios from 'axios'
import { io } from "socket.io-client";
import { config } from '../../Constants.js'

export default function Messenger() {
    const url = config.url.API_URL
    const [conversations, setConversations] = useState([])
    const [userId, setUserId] = useState('')
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
    }, [url]);

    useEffect(() => {
        if (arrivalMessage && currentChat?.members.includes(arrivalMessage.senderId)) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        const fetchUserId = async () => {
            const userId =  Cookies.get('userId');
            setUserId(userId);
            socket.current.emit("addUser", userId);
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        const getConversation = async () => {
            try {
                const res = await axios.get(`${url}/api/chatConvo/${userId}`);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        if (userId) {
            getConversation();
        }
    }, [userId, url]);

    useEffect(() => {
        const getMessages = async () => {
            if (currentChat) {
                try {
                    const res = await axios.get(`${url}/api/chatMessages/${currentChat._id}`);
                    setMessages(res.data);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        getMessages();
    }, [currentChat, url]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        const addMessagesFormat = {
            conversationId: `${currentChat._id}`,
            senderId: `${userId}`,
            text: `${newMessages}`
        };

        const receiverId = currentChat.members.find(
            (member) => member !== userId
        );

        socket.current.emit("sendMessage", {
            senderId: userId,
            receiverId,
            text: newMessages,
        });
        axios.post(`${url}/api/chatMessages/`, addMessagesFormat)
            .then(res => {
                setMessages([...messages, res.data]);
                setNewMessages('');
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div>
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="search for client" className="chatMenuInput" />
                        {
                            conversations.map((c) => (
                                <div key={c._id} onClick={() => setCurrentChat(c)}>
                                    <Conversation conversation={c} userId={userId} />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                <>
                                    <div className="chatBoxTop">
                                        {messages.map((m) => (
                                            <div key={m._id} ref={scrollRef}>
                                                <Message message={m} own={m.senderId === userId} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea placeholder="write something...." className="chatMessageInput" onChange={e => { setNewMessages(e.target.value) }} value={newMessages}></textarea>
                                        <button className="chatSubmitButton" onClick={sendMessage}>Send</button>
                                    </div>
                                </>
                                : <span className="noConversation">Open a conversation to start a chat</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline />
                    </div>
                </div>
            </div>
        </div>
    )
}
