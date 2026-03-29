import React from 'react'
import './FollowerCard.css'

import { Followers } from '../../Data/FollowersData'
const FollowerCard = () => {
    return (
        <div className="FollowerCard">
            <h3>Who is following you</h3>
            
            {Followers.map((follower, id) => {
                return (
                    // เพิ่ม key={id} เพื่อให้ React ระบุตัวตนของแต่ละ Element ได้ถูกต้อง
                    <div className="follower" key={id}> 
                        <div>
                            <img src={follower.img} alt="" 
                            className='followerImage'/>
                            <div className="name">
                                <span>{follower.name}</span>
                                <span>{follower.username}</span>
                            </div>
                        </div>
                        <button className='button fc-button'>Follow</button>
                    </div>
                )
            })}
        </div>
    )
}

export default FollowerCard