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
import { nameUpdateValidationSchema } from '../../validators/validationSchemas';
import { getCookie } from '../../helpers/utils';
import { backendEndpoint } from '../../config';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import { classes, Root, Form } from './styles/FormStyles';

export default function UpdateName() {
  useTitle('ppt Create | Update Name');
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: nameUpdateValidationSchema,
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
    const { name } = inputs;

    axios({
      method: 'PUT',
      data: {
        name,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/account/name`,
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
        msgType="error"
        msgs={errorMsgs}
        autoHideDuration={10000}
        countMsgs={countMsgs}
      />
      <Root className={classes.root}>
        <Avatar className={classes.avatar}>
          <EditIcon />
        </Avatar>
        <Typography variant="h1">Change Name</Typography>
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
