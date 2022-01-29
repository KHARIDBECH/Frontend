import { React, useEffect, useContext, useState } from 'react'
import './messenger.css'
import Conversation from './Conversations.js'
import Message from './Message.js'
import ChatOnline from './ChatOnline.js'
import Cookies from 'js-cookie'
import { AuthContext } from './AuthContext';
import axios from 'axios'

export default function Messenger() {
    // const [token,setToken] = useContext(AuthContext);
    const [conversations, setconversations] = useState([])
    const [userId, setuserId] = useState('')
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setnewMessages] = useState({});


    useEffect(() => {



        const getConversation = async () => {
            try {
                let userId = await Cookies.get('userId');
                setuserId(userId);
                const res = await axios.get(`http://localhost:5000/api/chatConvo/${userId}`)
                setconversations(res.data)
                console.log(res);
            }
            catch (err) {
                console.log(err);
            }
        }
        getConversation();

    }, [])
    console.log(currentChat)
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

    const sendMessage = ()=>{
        const addMessagesFormat = {
   
            conversationId: `${currentChat._id}`,
          sender:`${userId}`,
          text:`${newMessages}`
       };
       axios.post(`http://localhost:5000/api/chatMessages/`,addMessagesFormat)
       .then(res=>{
           setMessages([...messages,res.data]);
       })
       .catch(err=>{
           console.log(err)
       })
    }
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
                                        {
                                            messages.map((m) => (
                                                <Message message={m} own={m.sender === userId} />
                                            ))
                                        }

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
