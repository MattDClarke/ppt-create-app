import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import { useTitle } from '../../hooks/useTitle';
import { passwordUpdateValidationSchema } from '../../validators/validationSchemas';
import { getCookie } from '../../helpers/utils';
import { backendEndpoint } from '../../config';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import { classes, Root, Form } from './styles/FormStyles';

export default function UpdatePassword() {
  useTitle('ppt Create | Update Password');
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    validationSchema: passwordUpdateValidationSchema,
    onSubmit: (inputs) => {
      // eslint-disable-next-line
      handleSubmit(inputs);
    },
  });
  const [errorMsgs, setErrorMsgs] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();

  function handleSubmit(inputs) {
    setIsFetching(true);
    const { oldPassword, newPassword, newPasswordConfirm } = inputs;

    axios({
      method: 'PUT',
      data: {
        oldPassword,
        newPassword,
        newPasswordConfirm,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/account/password`,
    })
      .then((res) => {
        history.push({
          pathname: '/login',
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
        msgType="error"
        msgs={errorMsgs}
        autoHideDuration={10000}
        countMsgs={countMsgs}
      />
      <Root className={classes.root}>
        <Avatar className={classes.avatar}>
          <EditIcon />
        </Avatar>
        <Typography variant="h1">Change Password</Typography>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="password"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.oldPassword &&
                  Boolean(formik.errors.oldPassword)
                }
                helperText={
                  formik.touched.oldPassword && formik.errors.oldPassword
                }
                variant="outlined"
                required
                fullWidth
                name="oldPassword"
                label="Old Password"
                id="oldPassword"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
                variant="outlined"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                id="newPassword"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                value={formik.values.newPasswordConfirm}
                onChange={formik.handleChange}
                error={
                  formik.touched.newPasswordConfirm &&
                  Boolean(formik.errors.newPasswordConfirm)
                }
                helperText={
                  formik.touched.newPasswordConfirm &&
                  formik.errors.newPasswordConfirm
                }
                variant="outlined"
                required
                fullWidth
                name="newPasswordConfirm"
                label="Confirm New Password "
                id="newPasswordConfirm"
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
