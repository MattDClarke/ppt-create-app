import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { useTitle } from '../../hooks/useTitle';
import { userValidationSchema } from '../../validators/validationSchemas';
import { getCookie } from '../../helpers/utils';
import { backendEndpoint } from '../../config';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';

import GoogleIcon from '../icons/GoogleIcon';
import { classes, Root, Form } from './styles/FormStyles';

export default function SignUp() {
  useTitle('ppt Create | Sign Up');
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: userValidationSchema,
    onSubmit: (inputs) => {
      // eslint-disable-next-line
      handleSubmit(inputs);
    },
  });
  const [errorMsgs, setErrorMsgs] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();

  const googleLogin = () => {
    window.open(`${backendEndpoint}/auth/google`, '_self');
  };

  function handleSubmit(inputs) {
    setIsFetching(true);
    const { name, email, password, passwordConfirm } = inputs;

    axios({
      method: 'POST',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/signup`,
    })
      .then((res) => {
        history.push({
          pathname: '/login',
          state: { detail: res.data },
        });
      })
      .catch((err) => {
        setCountMsgs(countMsgs + 1);
        setErrorMsgs(err.response.data);
        setIsFetching(false);
        // error message may return same response - msg wnt show again.
        // Add msg count so that msg shown again if response is the same.
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      {/* popup error messages */}
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
        <Typography variant="h1">Sign Up</Typography>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
                error={
                  formik.touched.passwordConfirm &&
                  Boolean(formik.errors.passwordConfirm)
                }
                helperText={
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
                }
                variant="outlined"
                required
                fullWidth
                name="passwordConfirm"
                label="Confirm Password"
                id="passwordConfirm"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submitBtn}
            disabled={isFetching}
          >
            {!isFetching ? (
              'Sign Up'
            ) : (
              <LoaderThreeDots height={12} width={25} />
            )}
          </Button>
          <FormHelperText>
            Password should be at least 8 characters long and contain at least 1
            lowercase word, 1 uppercase word, 1 number and 1 symbol.
          </FormHelperText>

          <Grid container>
            <Grid item sx={{ pt: 2 }}>
              <Link component={RouterLink} to="/login">
                Already have an account? Log in
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
  );
}
