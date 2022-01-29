import React from 'react'
import './message.css'
import {format} from 'timeago.js'
export default function Message({message,own}) {
    // console.log("message wala",message)
    return (
        <div className={own?"message own":"message"}>
            <div className="messageTop">
                <img src = "https://cdn.ponly.com/wp-content/uploads/Random-Thoughts-768x512.jpg" alt=" " className="messageImg"/>
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}
