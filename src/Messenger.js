import { React, useEffect, useContext, useState,useRef } from 'react'
import './messenger.css'
import Conversation from './Conversations.js'
import Message from './Message.js'
import ChatOnline from './ChatOnline.js'
import Cookies from 'js-cookie'
import { AuthContext } from './AuthContext';
import axios from 'axios'
import { io } from "socket.io-client";

export default function Messenger() {
    // const [token,setToken] = useContext(AuthContext);
    const [conversations, setconversations] = useState([])
    const [userId, setuserId] = useState('')
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setnewMessages] = useState({});
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const scrollRef = useRef();
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
      }, []);

      useEffect(() => {
        console.log("arrival",arrivalMessage)
        arrivalMessage &&
          currentChat?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentChat]);

      useEffect(() => {
        socket.current.emit("addUser", userId);
        socket.current.on("getUsers", (users) => {
        console.log("users",users)
        });
      }, [userId]);

    useEffect(() => {
        const getConversation = async () => {
            try {
                let userId = await Cookies.get('userId');
                setuserId(userId);
                const res = await axios.get(`http://localhost:5000/api/chatConvo/${userId}`)
                setconversations(res.data)
                // console.log(res);
            }
            catch (err) {
                console.log(err);
            }
        }
        getConversation();

    }, [])
   
    console.log("new messages",newMessages)
    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/chatMessages/${currentChat._id}`)
                setMessages(res.data);
                console.log("get wala", res.data)
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
        console.log(newMessages)
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
       axios.post(`http://localhost:5000/api/chatMessages/`,addMessagesFormat)
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
