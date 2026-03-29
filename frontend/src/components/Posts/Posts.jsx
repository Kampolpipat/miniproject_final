import React from 'react'
import './Posts.css'
import { PostsData } from '../../Data/PostsData'
import Pots from '../Post/Post'

const Posts = () => {
  return (
    <div className="Posts">
        {PostsData.map((post, id) => {
            return <Pots data={post} id={id}/>
        })}
    </div>
  )
}

export default Posts
