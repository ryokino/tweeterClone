import * as React from 'react'
import styles from './Auth.module.css'

import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import CameraIcon from '@mui/icons-material/Camera'
import SendIcon from '@mui/icons-material/Send'
import { auth, provider, storage } from '../firebase'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserProfile } from '../features/userSlice'

const theme = createTheme()

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const Auth = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avaterImage, setAvaterImage] = useState<File | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false)
        setResetEmail('')
      })
      .catch(err => {
        alert(err.message)
        setResetEmail('')
      })
  }

  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch(err => alert(err.message))
  }

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password)
  }

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // これが走る時は必ずfileが存在するので！をつけている
    if (e.target.files![0]) {
      setAvaterImage(e.target.files![0])
      e.target.value = ''
    }
  }

  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password)
    // 画像を保存するときのurl
    let url = ''
    if (avaterImage) {
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 16
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map(n => S[n % S.length])
        .join('')
      const fileName = randomChar + '_' + avaterImage.name

      await storage.ref(`avatars/${fileName}`).put(avaterImage)
      url = await storage.ref('avatars').child(fileName).getDownloadURL()
    }
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    })
    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      }),
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component='main' sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1565630916779-e303be97b6f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: t =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              {isLogin ? 'Sign in' : 'Register'}
            </Typography>
            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}>
              {!isLogin && (
                <>
                  <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='username'
                    label='username'
                    name='username'
                    autoComplete='username'
                    autoFocus
                    value={username}
                    onChange={e => {
                      setUsername(e.target.value)
                    }}
                  />
                  <Box textAlign='center'>
                    <IconButton>
                      <label>
                        <AccountCircleIcon
                          fontSize='large'
                          className={
                            avaterImage
                              ? styles.login_addIconLoaded
                              : styles.login_addIcon
                          }
                        />
                        <input
                          className={styles.login_hiddenIcon}
                          type='file'
                          onChange={onChangeImageHandler}
                        />
                      </label>
                    </IconButton>
                  </Box>
                </>
              )}

              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                disabled={
                  isLogin
                    ? !email || password.length < 6
                    : !username || !email || password.length < 6 || !avaterImage
                }
                fullWidth
                variant='contained'
                color='primary'
                className={styles.submit}
                startIcon={<EmailIcon />}
                onClick={
                  isLogin
                    ? async () => {
                        try {
                          await signInEmail()
                        } catch (error: any) {
                          alert(error.message)
                        }
                      }
                    : async () => {
                        try {
                          await signUpEmail()
                        } catch (error: any) {
                          alert(error.message)
                        }
                      }
                }>
                {isLogin ? 'Sign in' : 'Register'}
              </Button>

              <Grid container>
                <Grid item xs>
                  <span
                    className={styles.login_reset}
                    onClick={() => setOpenModal(true)}>
                    Forget password?
                  </span>
                </Grid>
                <Grid item>
                  <span
                    className={styles.login_toggleMode}
                    onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Create new account' : 'Back to login'}
                  </span>
                </Grid>
              </Grid>

              <Button
                onClick={signInGoogle}
                fullWidth
                startIcon={<CameraIcon />}
                variant='contained'
                color='primary'
                sx={{ mt: 3, mb: 2 }}>
                SignIn with Google
              </Button>
            </Box>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <div style={getModalStyle()} className=''>
                <div className={styles.login_modal}>
                  <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type='email'
                    name='email'
                    label='Reset Email'
                    value={resetEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setResetEmail(e.target.value)
                    }
                  />
                  <IconButton onClick={sendResetEmail}>
                    <SendIcon />
                  </IconButton>
                </div>
              </div>
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default Auth
