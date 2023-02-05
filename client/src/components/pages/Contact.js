import React, { useState, useEffect } from 'react';
import { useForm } from '@formspree/react';

import { useFormik } from 'formik';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormHelperText from '@mui/material/FormHelperText';
import { useTitle } from '../../hooks/useTitle';
import { contactValidationSchema } from '../../validators/validationSchemas';
import MsgSnackbar from '../reuseable/MsgSnackbar';

import { classes, Root, Form } from './styles/FormStyles';

export default function Contact() {
  useTitle('ppt Create | Contact');
  const [formspreeState, formspreeHandleSubmit] = useForm('contact');
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: contactValidationSchema,
    onSubmit: (inputs, { resetForm }) => {
      formspreeHandleSubmit(inputs);
      resetForm();
    },
  });
  const [successMsg, setSuccessMsg] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);
  const [errorMsgs, setErrorMsgs] = useState(null);

  useEffect(() => {
    if (formspreeState.succeeded) {
      setSuccessMsg('Message Sent');
      setCountMsgs((prevState) => prevState + 1);
    }
    // formspreeState is an array (an object) - new one on each render
  }, [formspreeState.errors, formspreeState.succeeded]);

  useEffect(() => {
    if (formspreeState.errors.length !== 0) {
      setErrorMsgs('Message Sending failed');
      setCountMsgs((prevState) => prevState + 1);
    }
  }, [formspreeState.errors]);

  return (
    <Container component="main" maxWidth="xs">
      <MsgSnackbar
        msgType="success"
        msgs={successMsg}
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
          <ConnectWithoutContactIcon />
        </Avatar>
        <Typography variant="h1">Contact</Typography>
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
                type="text"
                value={formik.values.message}
                onChange={formik.handleChange}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
                name="message"
                variant="outlined"
                required
                fullWidth
                id="message"
                label="message"
                multiline
                minRows={10}
                maxRows={25}
              />
              {formik.values.message.length > 800 && (
                <>
                  <FormHelperText sx={{ paddingTop: 1, color: 'red' }}>
                    Current word count: {formik.values.message.length}
                  </FormHelperText>
                  <FormHelperText>Message: max 1000 chars</FormHelperText>
                </>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submitBtn}
            disabled={formspreeState.submitting}
          >
            Submit
          </Button>
        </Form>
      </Root>
    </Container>
  );
}
