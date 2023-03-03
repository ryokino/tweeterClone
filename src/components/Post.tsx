import { Avatar } from '@mui/material'
import React from 'react'
import styles from './Post.module.css'

interface PROPS {
  id: string
  avatar: string
  image: string
  text: string
  timestamp: any
  username: string
}

const Post = (props: PROPS) => {
  const { id, avatar, image, text, timestamp, username } = props
  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={avatar} />
      </div>
      <div className={styles.post_body}>
        <div className={styles.post_header}>
          <h3>
            <span className={styles.post_headerUser}>@{username}</span>
            <span className={styles.post_headerTime}>
              {new Date(timestamp?.toDate()).toLocaleString()}
            </span>
          </h3>
          <div className={styles.post_tweet}>
            <p>{text}</p>
          </div>
        </div>
        {image && (
          <div className={styles.post_tweetImage}>
            <img src={image} alt='tweet' />
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
