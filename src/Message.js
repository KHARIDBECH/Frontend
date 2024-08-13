import React from 'react'
import './message.css'
export default function Message({message,own}) {
    return (
        <div className={own?"message own":"message"}>
            <div className="messageTop">
                <img src = "https://cdn.ponly.com/wp-content/uploads/Random-Thoughts-768x512.jpg" alt=" " className="messageImg"/>
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{message.createdAt}</div>
        </div>
    )
}
