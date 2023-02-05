import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import { useTitle } from '../../hooks/useTitle';
import { passwordForgotValidationSchema } from '../../validators/validationSchemas';
import { getCookie } from '../../helpers/utils';
import { backendEndpoint } from '../../config';
import Loader from '../reuseable/Loader';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import { classes, Root, Form } from './styles/FormStyles';

export default function PasswordResetForm() {
  useTitle('ppt Create | Password Reset');
  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirm: '',
    },
    validationSchema: passwordForgotValidationSchema,
    onSubmit: (inputs) => {
      // eslint-disable-next-line
      handleSubmit(inputs);
    },
  });
  const [valid, setValid] = useState(false);
  const [successMsgs, setSuccessMsgs] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();
  const { token } = useParams();

  useEffect(() => {
    axios({
      method: 'GET',
      withCredentials: true,
      url: `${backendEndpoint}/api/account/reset/${token}`,
    })
      .then((res) => {
        if (res.data) {
          setValid(true);
          setSuccessMsgs(res.data);
        }
      })
      .catch(function (err) {
        setValid(false);
        setErrorMsgs(err.response.data);
      });
  }, [token]);

  function handleSubmit(inputs) {
    setIsFetching(true);
    const { password, passwordConfirm } = inputs;

    axios({
      method: 'POST',
      data: {
        password,
        passwordConfirm,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/account/reset/${token}`,
    })
      .then((res) => {
        history.push({
          pathname: '/create',
          state: { detail: res.data },
        });
      })
      .catch((err) => {
        setErrorMsgs(err.response.data);
        setCountMsgs(countMsgs + 1);
        setIsFetching(false);
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      {/* popup error messages */}
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
        <Typography variant="h1">Password Reset</Typography>

        {valid !== false ? (
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
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
                  autoFocus
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
                'Submit'
              ) : (
                <LoaderThreeDots height={12} width={25} />
              )}
            </Button>
          </Form>
        ) : (
          <Loader />
        )}
      </Root>
    </Container>
  );
}
