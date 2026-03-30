import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PostSide from '../../components/PostSide/PostSide'
import ProfileSide from '../../components/profileSide/ProfileSide'
import RightSide from '../../components/RightSide/RightSide'
import Chat from '../../components/Chat/Chat'
import './Home.css'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { authData } = useSelector((state) => state.authReducer)
  const currentUserId = authData?.user?._id || authData?.user?.id || authData?.id
  const [chatPartner, setChatPartner] = React.useState(null)
  const conversationId = currentUserId && chatPartner ? [currentUserId, chatPartner._id].sort().join('_') : ''

  const handleLogout = () => {
    // OWASP A2: Authentication Failure and Session Management
    // ค่า token/ข้อมูล auth ต้องถูกล้างออกเมื่อ logout เพื่อป้องกัน session fixation
    dispatch({ type: 'AUTH_LOGOUT' })
    localStorage.removeItem('profile')
    navigate('/')
  }

  return (
    <div className="Home">
      <div style={{ width: '100%', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome{authData?.user?.firstname ? `, ${authData.user.firstname}` : ''}!</h2>
        <button className="button infoButton" onClick={handleLogout} style={{ width: '120px', height: '36px' }}>
          Logout
        </button>
      </div>
      <div className="Home">
        <ProfileSide onSelectFollower={setChatPartner} />
        <PostSide />
        <RightSide />
      </div>
      {conversationId && chatPartner && (
        <div style={{width: '100%', padding: '8px'}}>
          <Chat conversationId={conversationId} receiverId={chatPartner._id} />
        </div>
      )}
    </div>
  )
}

export default Home