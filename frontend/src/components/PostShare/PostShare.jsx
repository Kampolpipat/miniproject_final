import React, { useState, useRef } from 'react'
import ProfileSC from '../../img/ProfileSC.jpg'
import './PostShare.css'
import { UilScenery } from '@iconscout/react-unicons'
import { UilPlayCircle } from '@iconscout/react-unicons'
import { UilLocationPoint } from '@iconscout/react-unicons'
import { UilSchedule } from '@iconscout/react-unicons'
import { UilTimes } from '@iconscout/react-unicons'
import { createPost } from '../../api/PostRequest'
import { useSelector } from 'react-redux'


const PostShare = () => {
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();
  const { authData } = useSelector((state) => state.authReducer);
  const userId = authData?.user?._id || authData?.user?.id || authData?.id;

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage({
        image: URL.createObjectURL(img),
      });
    }
  }

  const handleShare = async () => {
    if (!userId) return;
    if (!desc.trim() && !image) return;
    setLoading(true);

    try {
      const postBody = {
        userId,
        desc: desc.trim(),
        img: image?.image || ''
      };
      await createPost(postBody);
      setDesc('');
      setImage(null);
      window.dispatchEvent(new Event('timelineUpdated'));
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="PostShare">
      <img src={ProfileSC} alt="Profile" />
      <div>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          type="text"
          placeholder="What's happening"
        />
        <div className="postOptions">
          <div className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>
          <div className="option"
            style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>
          <div className="option"
            style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option"
            style={{ color: "var(--schedule)" }}>
            <UilSchedule />
            Schedule
          </div>
          <button className="button ps-button" onClick={handleShare} disabled={loading}>
            {loading ? 'Sharing...' : 'Share'}
          </button>
          <div style={{ display: "none" }}>
            <input type="file"
              name="myImage"
              ref={imageRef} onChange={onImageChange} />
          </div>
        </div>

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={image.image} alt="Preview" />
          </div>
        )}

      </div>
    </div>
  )
}

export default PostShare
