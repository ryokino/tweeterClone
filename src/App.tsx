import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './App.module.css'
import Auth from './components/Auth'
import Feed from './components/Feed'
import { login, logout, selectUser } from './features/userSlice'
import { auth } from './firebase'

const App = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  useEffect(() => {
    // onAuthStateChanged is a listener that will fire when the user's authentication state changes
    const unSub = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          }),
        )
      } else {
        dispatch(logout())
      }
    })
    console.log('useEffect is called')
    return () => {
      unSub()
    }
  }, [dispatch])

  return (
    <>
      {/* userが存在しているならFeed Pageへ。存在しないならAuthページへ */}
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <div>
          <Auth />
        </div>
      )}
    </>
  )
}
export default App
