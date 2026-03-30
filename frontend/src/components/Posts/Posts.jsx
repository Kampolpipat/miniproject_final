import React, { useState, useEffect } from 'react';
import './Posts.css';
import Post from '../Post/Post';
import { getTimelinePosts } from '../../api/PostRequest';
import { useSelector } from 'react-redux';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { authData } = useSelector((state) => state.authReducer);
  const userId = authData?.user?._id || authData?.user?.id || null;

  const fetchTimeline = React.useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await getTimelinePosts(userId);
      setPosts(data);
    } catch (error) {
      console.error('Fetch timeline failed', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchTimeline();
    const listener = () => fetchTimeline();
    window.addEventListener('timelineUpdated', listener);
    return () => window.removeEventListener('timelineUpdated', listener);
  }, [fetchTimeline]);

  return (
    <div className="Posts">
      {posts?.map((post) => (
        <Post key={post._id} data={post} currentUserId={userId} refreshTimeline={fetchTimeline} />
      ))}
    </div>
  );
};

export default Posts;
