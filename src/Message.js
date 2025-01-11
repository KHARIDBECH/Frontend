import React from 'react'
import './message.css'
import { format, isToday, isYesterday } from 'date-fns';


export default function Message({ message, own }) {
    const messageDate = new Date(message.createdAt)
    const renderTime = () => {
   
        if (isToday(messageDate)){
            return format(messageDate, 'hh:mm a')
        }
        else if (isYesterday(messageDate)){
            return 'Yesterday'
        }
        else{
            return format(messageDate, 'MM/dd/yyyy')
        }
    }
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img src="https://cdn.ponly.com/wp-content/uploads/Random-Thoughts-768x512.jpg" alt=" " className="messageImg" />
                <p className="messageText">{message.text}</p>
            </div>
            {renderTime()}
        </div>
    )
}
