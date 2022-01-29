import React from 'react'
import './chatOnline.css'
export default function ChatOnline() {
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img className="chatOnlineImg" src="https://cdn.ponly.com/wp-content/uploads/Random-Thoughts-768x512.jpg" alt=""/>
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">John Doe</span>
            </div>
        </div>
    )
}
