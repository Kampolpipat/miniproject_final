import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './FollowerCard.css'
import { getFollowers, followUser, unfollowUser, getUser } from '../../api/UserRequest'

const FollowerCard = ({ onSelectUser }) => {
    const { authData } = useSelector((state) => state.authReducer)
    const currentUserId = authData?.user?._id || authData?.user?.id || authData?.id
    const [followers, setFollowers] = useState([])
    const [followingIds, setFollowingIds] = useState(new Set())

    const loadFollowers = async () => {
        if (!currentUserId) return;
        try {
            const { data } = await getFollowers(currentUserId)
            setFollowers(data.followers || [])

            const user = await getUser(currentUserId)
            setFollowingIds(new Set(user.data.following || []))
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        loadFollowers()
    }, [currentUserId])

    const toggleFollow = async (otherId) => {
        if (!currentUserId || currentUserId === otherId) return;

        try {
            if (followingIds.has(otherId)) {
                await unfollowUser(otherId, currentUserId)
                setFollowingIds((prev) => {
                    const next = new Set(prev)
                    next.delete(otherId)
                    return next
                })
            } else {
                await followUser(otherId, currentUserId)
                setFollowingIds((prev) => new Set(prev).add(otherId))
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="FollowerCard">
            <h3>Who is following you</h3>

            {followers.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: '#777' }}>ไม่มีผู้ติดตามขณะนี้</p>
            ) : (
                followers.map((follower) => (
                    <div className="follower" key={follower._id}>
                        <div className="follower-left" onClick={() => onSelectUser && onSelectUser(follower)} style={{ cursor: 'pointer' }}>
                            <img src={follower.profilePicture || 'https://via.placeholder.com/45'} alt="" className='followerImage' />
                            <div className="name">
                                <span>{`${follower.firstname || ''} ${follower.lastname || ''}`.trim() || follower.username}</span>
                                <span>{follower.username}</span>
                            </div>
                        </div>
                        <button className='button fc-button' onClick={() => toggleFollow(follower._id)}>
                            {followingIds.has(follower._id) ? 'Following' : 'Follow'}
                        </button>
                    </div>
                ))
            )}
        </div>
    )
}

export default FollowerCard