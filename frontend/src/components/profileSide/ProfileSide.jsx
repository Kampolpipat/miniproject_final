import React from 'react'
import "./ProfileSide.css"
import Logosearch from '../LogoSearch/LogoSearch'
import ProfileCard from '../ProfileCard.jsx/ProfileCard'
import FollowerCard from '../FollowersCard/FollowerCard'

import "./ProfileSide.css"

const ProfileSide = ({ onSelectFollower }) => {
  return (
    <div className='ProfileSide'>
      <Logosearch />
      <ProfileCard />
      <FollowerCard onSelectUser={onSelectFollower} />
    </div>
  )
}

export default ProfileSide
