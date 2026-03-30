import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { followUser, unfollowUser, getUser, updateUser, changePassword, getFollowers } from '../../api/UserRequest'
import ProfileModal from '../ProfileModel.jsx/ProfileModal'
import './ProfileCard.css'

const ProfileCard = () => {
    const dispatch = useDispatch()
    const { authData } = useSelector((state) => state.authReducer)
    const currentUserId = authData?.user?._id || authData?.user?.id || authData?.id
    const profileId = currentUserId // current profile is the current user
    const [isFollowing, setIsFollowing] = useState(false)
    const [profileData, setProfileData] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const ProfilePage = true;

    useEffect(() => {
        const fetchUser = async () => {
            if (!profileId) return;
            try {
                const { data } = await getUser(profileId);
                setProfileData(data);
                setIsFollowing(data.followers?.includes(currentUserId));
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, [profileId, currentUserId]);

    const toggleFollow = async () => {
        if (!profileId || !currentUserId || profileId === currentUserId) return;
        try {
            if (isFollowing) {
                await unfollowUser(profileId, currentUserId);
                setProfileData((prev) => ({
                    ...prev,
                    followers: prev?.followers?.filter((id) => id !== currentUserId) || []
                }))
                setIsFollowing(false);
            } else {
                await followUser(profileId, currentUserId);
                setProfileData((prev) => ({
                    ...prev,
                    followers: [...(prev?.followers || []), currentUserId]
                }))
                setIsFollowing(true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleUpdate = async (updatedValues) => {
        if (!profileId) return;
        try {
            const { data } = await updateUser(profileId, updatedValues);
            setProfileData(data);

            // update redux and localStorage so profile immediately reflects everywhere
            const savedProfile = JSON.parse(localStorage.getItem('profile')) || {};
            const payload = {
                ...savedProfile,
                user: data,
            };
            localStorage.setItem('profile', JSON.stringify(payload));
            dispatch({ type: 'AUTH_SUCCESS', data: payload });

            setProfileData(data);
        } catch (error) {
            console.error('Update failed', error);
        }
    }

    const handleChangePassword = async (passwordData) => {
        if (!profileId) return;
        try {
            await changePassword(profileId, passwordData);
        } catch (error) {
            console.error('Change password failed', error);
        }
    }
    const coverImage = profileData?.coverPicture || profileData?.cover || '';
    const avatar = profileData?.profilePicture || profileData?.profile || '';

    return (
        <div className="ProfileCard">
            <div className="CoverImage" style={{ backgroundImage: `url(${coverImage || 'https://via.placeholder.com/1000x320?text=Cover'})` }} />
            <div className="ProfileImages">
                <img src={avatar || 'https://via.placeholder.com/150?text=Profile'} alt="Profile" />
            </div>

            <div className="ProfileName">
                <span>{`${profileData?.firstname || 'Unnamed'} ${profileData?.lastname || ''}`.trim() || 'Your Name'}</span>
                <span>{profileData?.worksAt || 'Add your tagline here'}</span>
            </div>

            <p className='profile-about'>{profileData?.about || 'About you...'} </p>
            <div className='profile-meta'>
                <span>{profileData?.livesIn ? `Lives in ${profileData.livesIn}` : 'Set your city'}</span>
                <span>{profileData?.relationship ? `Relationship: ${profileData.relationship}` : 'Relationship status'}</span>
            </div>

            <div className="followStatus">
                <hr />
                <div>
                    <div className="follow">
                        <span>{profileData?.following?.length || 0}</span>
                        <span>Followings</span>
                    </div>
                    <div className="vl"></div>
                    <div className="follow">
                        <span>{profileData?.followers?.length || 0}</span>
                        <span>Followers</span>
                    </div>

                    {ProfilePage && (
                        <>
                            <div className="vl"></div>
                            <div className="follow">
                                <span>{profileData?.posts?.length || 0}</span>
                                <span>Posts</span>
                            </div>
                        </>
                    )}
                </div>
                <hr />
            </div>

            <div className='profile-buttons'>
                <button className='button edit-profile' onClick={() => setModalOpened(true)}>
                    Edit Profile
                </button>
                {!ProfilePage && (
                    <button className='button follow-btn' onClick={toggleFollow}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            <ProfileModal
                modalOpened={modalOpened}
                setModalOpened={setModalOpened}
                profileData={profileData}
                onUpdate={handleUpdate}
                onChangePassword={handleChangePassword}
            />
        </div>
    )
}

export default ProfileCard
