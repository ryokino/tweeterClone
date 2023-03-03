import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import TweetInput from './TweetInput'
import styles from './Feed.module.css'
import { db } from '../firebase'

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: '',
      avatar: '',
      image: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ])
  useEffect(() => {
    const unSub = db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          })),
        )
      })
    return () => {
      unSub()
    }
  }, [])
  return (
    <div className={styles.feed}>
      Feed
      <TweetInput />
      {posts.map(post => (
        <h3>{post.id}</h3>
      ))}
    </div>
  )
}

export default Feed
