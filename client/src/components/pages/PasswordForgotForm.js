import React, { useState } from 'react';
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
import { forgotValidationSchema } from '../../validators/validationSchemas';
import { getCookie } from '../../helpers/utils';
import { backendEndpoint } from '../../config';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import { classes, Root, Form } from './styles/FormStyles';

export default function PasswordForgotForm() {
  useTitle('ppt Create | Forgot Password');
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotValidationSchema,
    onSubmit: (inputs) => {
      // eslint-disable-next-line
      handleSubmit(inputs);
    },
  });
  const [successMsgs, setSuccessMsgs] = useState(null);
  const [errorMsgs, setErrorMsgs] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  function handleSubmit(inputs) {
    setIsFetching(true);
    const { email } = inputs;

    axios({
      method: 'POST',
      data: {
        email,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/account/forgot`,
    })
      .then((res) => {
        setSuccessMsgs(res.data);
        setCountMsgs(countMsgs + 1);
        setIsFetching(false);
      })
      .catch((err) => {
        setErrorMsgs(err.response.data);
        setCountMsgs(countMsgs + 1);
        setIsFetching(false);
      });
  }

  return (
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
        <Typography variant="h1">Forgot Password</Typography>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
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
                autoFocus
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
      </Root>
    </Container>
  );
}
