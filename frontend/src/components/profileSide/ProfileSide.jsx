import React from 'react'
import "./ProfileSide.css"
import Logosearch from '../LogoSearch/LogoSearch'
import ProfileCard from '../ProfileCard.jsx/ProfileCard'
import FollowerCard from '../FollowersCard/FollowerCard'

import "./ProfileSide.css"

const ProfileSide = () => {
  return (
    <div className='ProfileSide'>
      <Logosearch />
      <ProfileCard />
      <FollowerCard />
    </div>
  )
}

export default ProfileSide
