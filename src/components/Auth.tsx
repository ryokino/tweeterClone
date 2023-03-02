import * as React from 'react'
import styles from './Auth.module.css'

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EmailIcon from '@mui/icons-material/Email'
import { auth, provider } from '../firebase'
import { useState } from 'react'

const theme = createTheme()

const Auth = () => {
  /* Here is the explanation for the code above:
1. The auth library is imported from firebase. 
2. signInWithPopup is a method from the auth library. 
3. It takes in "provider" as a parameter. 
4. Provider is a variable that holds the GoogleAuthProvider from firebase. 
5. The GoogleAuthProvider is a class that is imported from firebase. 
6. The GoogleAuthProvider is a class that has the sign in method from Google. 
7. The signInWithPopup method is what allows the user to sign in with a popup window. 
8. The catch method is there to catch any errors that might occur. 
9. If an error occurs, it will alert the error message. */
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch(err => alert(err.message))
  }
  /**
   *
   * これを有効にするにはFirebaseの設定を変更する必要があります。
   * Authentication > ログイン方法 > Googleを有効にする
   */

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [userName, setUserName] = useState('')
  const [avaterImage, setAvaterImage] = useState<File | null>(null)

  const [isLogin, setIsLogin] = useState(true)

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password)
  }

  const signUpEmail = async () => {
    await auth.createUserWithEmailAndPassword(email, password)
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
                  <span className={styles.login_reset}>Forget password?</span>
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
                variant='contained'
                sx={{ mt: 3, mb: 2 }}>
                SignIn with Google
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default Auth
