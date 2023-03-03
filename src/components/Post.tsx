import { Avatar } from '@mui/material'
import React, { useState } from 'react'
import styles from './Post.module.css'
import { db } from '../firebase'
import { useSelector } from 'react-redux'
import firebase from 'firebase/app'
import SendIcon from '@mui/icons-material/Send'
import { selectUser } from '../features/userSlice'

interface PROPS {
  postId: string
  avatar: string
  image: string
  text: string
  timestamp: any
  username: string
}

const Post = (props: PROPS) => {
  const user = useSelector(selectUser)
  const { postId, avatar, image, text, timestamp, username } = props
  const [comment, setComment] = useState('')
  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('evoked')
    e.preventDefault()
    db.collection('posts').doc(postId).collection('comments').add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    })
    setComment('')
  }
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
        <form onSubmit={newComment}>
          <div className={styles.post_form}>
            <input
              className={styles.post_input}
              type='text'
              placeholder='Type new comment ...'
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button
              type='submit'
              disabled={!comment}
              className={
                comment ? styles.post_button : styles.post_buttonDisable
              }>
              <SendIcon className={styles.post_sendIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Post
