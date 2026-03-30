import React, { useState } from 'react'
import './Post.css'
import CommentIcon from '../../img/comment.png'
import Share from '../../img/share.png'
import Heart from '../../img/like.png'
import NotLike from '../../img/notlike.png'
import { likePost, commentPost } from '../../api/PostRequest'

const Post = ({ data, currentUserId, refreshTimeline }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [localLiked, setLocalLiked] = useState(data.likes?.includes(currentUserId))
  const [likesCount, setLikesCount] = useState(data.likes?.length || 0)

  const handleLike = async () => {
    if (!currentUserId) return;
    try {
      await likePost(data._id, currentUserId);
      setLocalLiked(!localLiked);
      setLikesCount(localLiked ? likesCount - 1 : likesCount + 1);
      if (refreshTimeline) refreshTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await commentPost(data._id, { userId: currentUserId, text: commentText.trim() });
      setCommentText('');
      if (refreshTimeline) refreshTimeline();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="Post">
      {data.img && <img src={data.img} alt="" />}

      <div className="postReact">
        <img src={localLiked ? Heart : NotLike} alt="like" onClick={handleLike} style={{cursor:'pointer'}} />
        <img src={CommentIcon} alt="comment" onClick={() => setIsCommentOpen(prev => !prev)} style={{cursor:'pointer'}} />
        <img src={Share} alt="share" />
      </div>

      <span style={{color:'var(--gray)', fontSize:'12px'}}>{likesCount} likes</span>

      <div className="detail">
        <span><b>{data.userId}</b></span>
        <span> {data.desc}</span>
      </div>

      <div className="timestamp" style={{ fontSize: '11px', color: 'gray' }}>
        {new Date(data.createdAt).toLocaleString()}
      </div>

      {isCommentOpen && (
        <div className="comment-section" style={{marginTop:'10px'}}>
          <div style={{ display:'flex', gap:'8px' }}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1 }}
            />
            <button onClick={handleComment}>Send</button>
          </div>
          <div style={{ marginTop: '8px' }}>
            {data.comments?.length ? data.comments.map((c, idx) => (
              <div key={idx} style={{ fontSize: '12px', marginTop: '4px' }}>
                <b>{c.userId}</b>: {c.text}
              </div>
            )) : <span style={{color:'gray'}}>No comments yet</span>}
          </div>
        </div>
      )}

    </div>
  )
}

export default Post
