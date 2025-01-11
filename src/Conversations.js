import {React,useState,useEffect} from 'react'
import './conversations.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import { config } from './Constants'
export default function Conversations({conversation,userId}) {
    const url = config.url.API_URL
    
    const [user, setuser] = useState(null)
    const [first, setfirst] = useState('');
    const token = Cookies.get('token')
    useEffect(() => {
        const friendId = conversation.members.find(r => r !==userId)
        console.log(friendId,conversation.members)
        const getUser = () =>{
        axios.get(`${url}/api/users/user/${friendId}`,{headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token to headers
        }})
        .then((res) => 
        {
            setuser(res.data)
        }
        )
        .catch(err=>{
            console.log(err)
        })
        }
        getUser();
    }, [first])

    console.log(user)
   
    return (
        <div className="conversation">
            <img className="conversationImg" src = "https://cdn.ponly.com/wp-content/uploads/Random-Thoughts-768x512.jpg" alt = "" />
            <span className="conversationName">{user==null ? '':user.firstName}</span>
            
        </div>
    )
}
