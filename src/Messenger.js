import { React, useEffect, useContext, useState,useRef } from 'react'
import './messenger.css'
import Conversation from './Conversations.js'
import Message from './Message.js'
import ChatOnline from './ChatOnline.js'
import Cookies from 'js-cookie'
import { AuthContext } from './AuthContext';
import axios from 'axios'
import { io } from "socket.io-client";
import { config } from './Constants.js'

export default function Messenger() {
    // const [token,setToken] = useContext(AuthContext);
    const url = config.url.API_URL
    // const url = "http://localhost:5000"
    
    const [conversations, setconversations] = useState([])
    const [userId, setuserId] = useState('')
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setnewMessages] = useState({});
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const scrollRef = useRef();
    useEffect(() => {
        socket.current = io("ws://localhost:5000");
        socket.current.on("getMessage", (data) => {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
      }, []);

      useEffect(() => {
        arrivalMessage &&
          currentChat?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentChat]);

      useEffect(async () => {
        let userId = await Cookies.get('userId');
        socket.current.emit("addUser", userId);
        socket.current.on("getUsers", (users) => {
        });
      }, [userId]);

    useEffect(() => {
        const getConversation = async () => {
            try {
                let userId = await Cookies.get('userId');
                setuserId(userId);
                const res = await axios.get(`${url}/api/chatConvo/${userId}`)
                setconversations(res.data)
            }
            catch (err) {
                console.log(err);
            }
        }
        getConversation();

    }, [])
   

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`${url}/api/chatMessages/${currentChat._id}`)
                setMessages(res.data);
             
            } catch (err) {
                console.log(err)
            }
        }
        getMessages();
    }, [currentChat])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

    const sendMessage = ()=>{
        const addMessagesFormat = {
            conversationId: `${currentChat._id}`,
          sender:`${userId}`,
          text:`${newMessages}`
       };

       const receiverId = currentChat.members.find(
        (member) => member !== userId
      );
  
      socket.current.emit("sendMessage", {
        senderId: userId,
        receiverId,
        text: newMessages,
      });
       axios.post(`${url}/api/chatMessages/`,addMessagesFormat)
       .then(res=>{
           setMessages([...messages,res.data]);
       })
       .catch(err=>{
           console.log(err)
       })
    }
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);
    return (
        <div>
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="search for client" className="chatMenuInput" />
                        {
                            conversations.map((c) => (
                                <div onClick={() => setCurrentChat(c)}>
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
                                            <div ref={scrollRef}>
                                              <Message message={m} own={m.sender === userId} />
                                            </div>
                                          ))}
                                        

                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea placeholder="write something...." className="chatMessageInput" onChange={e=>{setnewMessages(e.target.value)}}></textarea>
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
