import {React,useState,useEffect} from 'react'
import './conversations.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import { config } from './Constants'
export default function Conversations({conversation,userId}) {
    const url = config.url.API_URL
    
    const [user, setuser] = useState(null)
    const [first, setfirst] = useState('');

    useEffect(() => {
        const friendId = conversation.members.find(r => r !==Cookies.get('userId'))
        console.log("friend wala",friendId)
        const getUser = () =>{
        axios.get(`${url}/api/auth/user?userId=${friendId}`)
        .then((res) => 
        {
            console.log("fetch wala",res.data)
            setuser(res.data)
            console.log(user[0],'use wala')
        }
        )
        .catch(err=>{
            console.log(err)
        })
        }
        getUser();
    }, [first])
   
    return (
        <div className="conversation">
            <img className="conversationImg" src = "https://cdn.ponly.com/wp-content/uploads/Random-Thoughts-768x512.jpg" alt = "" />
            <span className="conversationName">{user==null ? '':user[0].firstName}</span>
            
        </div>
    )
}
