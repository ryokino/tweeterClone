import { Avatar } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import { auth, db, storage } from '../firebase'
import firebase from 'firebase/app'

import styles from './TweetInput.module.css'

const TweetInput = () => {
  const user = useSelector(selectUser)
  const [tweetImage, setTweetImage] = useState<File | null>(null)
  const [tweetMessage, setTweetMessage] = useState('')

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0])
      e.target.value = ''
    }
  }

  const sendTweet = async (e: React.MouseEvent<HTMLElement>) => {
    // reactでは、defaultの挙動として、formのsubmitボタンを押すと、ページがリロードされる
    // しかし、今回はasync/awaitを使っているので、ページがリロードされると、
    // その後の処理が走らなくなってしまう
    // これを防ぐために、preventDefaultを使う
    e.preventDefault()

    if (tweetImage) {
      // 画像がある場合
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 16
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map(n => S[n % S.length])
        .join('')
      const fileName = randomChar + '_' + tweetImage.name
      const uploadImage = storage.ref(`images/${fileName}`).put(tweetImage)
      uploadImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, // 進捗度合いを取得できる
        err => {
          alert(err.message)
        }, // エラーを取得できる
        async () => {
          // 画像のurlを取得できる
          await storage
            .ref('images')
            .child(fileName)
            .getDownloadURL()
            .then(async url => {
              await db.collection('posts').add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMessage,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              })
            })
        },
      )
    } else {
      // 画像がない場合
      await db.collection('posts').add({
        avatar: user.photoUrl,
        image: '',
        text: tweetMessage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      })
    }
    setTweetMessage('')
    setTweetImage(null)
  }

  return (
    <div>
      <Avatar
        className={styles.tweet_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await auth.signOut()
        }}
      />
    </div>
  )
}

export default TweetInput
