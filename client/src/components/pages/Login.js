import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';

import axios from 'axios';
import { useFormik } from 'formik';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { loginValidationSchema } from '../../validators/validationSchemas';
import { useMountedState } from '../../hooks/useMountedState';
import { useTitle } from '../../hooks/useTitle';
import { wait, getCookie } from '../../helpers/utils';
import { backendEndpoint } from '../../config';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import GoogleIcon from '../icons/GoogleIcon';
import { classes, Root, Form } from './styles/FormStyles';

// eslint-disable-next-line
export default function Login({ token = null }) {
  useTitle('ppt Create | Login');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (inputs) => {
      // eslint-disable-next-line
      handleSubmit(inputs);
    },
  });
  const [successMsgs, setSuccessMsgs] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState(null);
  const [tooManyRequestsMsg, setTooManyRequestsMsg] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const location = useLocation();
  const isMounted = useMountedState();

  // check token from email validation
  useEffect(() => {
    if (token === null) return;
    axios({
      method: 'GET',
      withCredentials: true,
      url: `${backendEndpoint}/api/emailconfirm/${token}`,
    })
      .then((res) => {
        setSuccessMsgs(res.data);
        // setCountMsgs(countMsgs + 1);
        setCountMsgs((prevState) => prevState + 1);
      })
      .catch((err) => {
        setErrorMsgs(err.response.data);
        setCountMsgs((prevState) => prevState + 1);
        // setCountMsgs(countMsgs + 1);
      });
    // only run if token changes - was causing looping issue in FireFox
  }, [token]);

  useEffect(() => {
    async function showMsg() {
      await wait(1000);
      if (isMounted()) {
        setSuccessMsgs(location.state?.detail);
      }
    }
    showMsg();
  }, [location, isMounted]);

  const googleLogin = () => {
    window.open(`${backendEndpoint}/auth/google`, '_self');
  };

  function handleSubmit(values) {
    setIsFetching(true);
    const { email, password } = values;
    axios({
      method: 'POST',
      data: {
        email,
        password,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/login`,
    })
      .then(() => {
        window.location.href = '/create';
      })
      .catch((err) => {
        if (err.response.status === 429) {
          setTooManyRequestsMsg(err.response.data);
        }
        setErrorMsgs(err.response.data);
        setCountMsgs(countMsgs + 1);
        setIsFetching(false);
      });
  }

  return (
    <div>
      {tooManyRequestsMsg ? (
        <div>{tooManyRequestsMsg}</div>
      ) : (
        <Container component="main" maxWidth="xs">
          {/* popup messages */}
          <MsgSnackbar
            msgType="success"
            msgs={successMsgs}
            autoHideDuration={null}
            countMsgs={countMsgs}
          />
          <MsgSnackbar
            msgType="error"
            msgs={errorMsgs}
            autoHideDuration={10000}
            countMsgs={countMsgs}
          />
          <Root className={classes.root}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h1">Log In</Typography>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <TextField
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submitBtn}
                disabled={isFetching}
              >
                {!isFetching ? (
                  'Log In'
                ) : (
                  <LoaderThreeDots height={12} width={25} />
                )}
              </Button>

              <Grid container gap={1}>
                <Grid item xs justifySelf="start" textAlign="left">
                  <Link
                    component={RouterLink}
                    to="/account/forgot"
                    sx={{ whiteSpace: 'nowrap', pr: 2 }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/signup">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>

              <Box className={classes.socialSignInBtn}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<GoogleIcon />}
                  onClick={googleLogin}
                >
                  Google Sign In
                </Button>
              </Box>
            </Form>
          </Root>
        </Container>
      )}
    </div>
  );
}
