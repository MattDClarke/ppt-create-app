import React, { useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import AddIcon from '@mui/icons-material/Add';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { useFormik } from 'formik';
import { addBookValidationSchema } from '../../validators/validationSchemas';
import BookImageUploader from '../admin/BookImageUploader';
import { useTitle } from '../../hooks/useTitle';
import { getCookie } from '../../helpers/utils';
import { levelAndGradeOptions } from '../../helpers/listsValues';
import { backendEndpoint } from '../../config';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import { classes, Root, Form } from './styles/FormStyles';

export default function AddBook() {
  useTitle('ppt Create | Add Book');
  const formik = useFormik({
    initialValues: {
      levelAndGrade: '',
      year: 2021,
      publisher: '',
      authorSurname: '',
      coverImg: {},
    },
    validationSchema: addBookValidationSchema,
    onSubmit: (inputs) => {
      // eslint-disable-next-line
      handleSubmit(inputs);
    },
  });

  const [errorMsgs, setErrorMsgs] = useState(null);
  const [successMsgs, setSuccessMsgs] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);
  const [countSuccessMsgs, setCountSuccessMsgs] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const bodyFormData = new FormData();

  function handleSubmit(inputs) {
    setIsFetching(true);
    const { levelAndGrade, publisher, authorSurname, year, coverImg } = inputs;
    bodyFormData.append('levelAndGrade', levelAndGrade);
    bodyFormData.append('publisher', publisher);
    bodyFormData.append('authorSurname', authorSurname);
    bodyFormData.append('year', year);
    bodyFormData.append('coverImg', coverImg);
    axios({
      method: 'POST',
      data: bodyFormData,
      headers: {
        'Content-Type': `multipart/form-data`,
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/add-book`,
    })
      .then(() => {
        formik.resetForm({
          values: {
            levelAndGrade,
            year,
            publisher,
            authorSurname: '',
            coverImg: {},
          },
        });
        setSuccessMsgs('Book added successfully');
        // multiple books may be added - multiple success messages
        setCountSuccessMsgs(countSuccessMsgs + 1);
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
      {/* popup error messages */}
      <MsgSnackbar
        msgType="error"
        msgs={errorMsgs}
        autoHideDuration={10000}
        countMsgs={countMsgs}
      />
      <MsgSnackbar
        msgType="success"
        msgs={successMsgs}
        autoHideDuration={null}
        countSuccessMsgs={countSuccessMsgs}
      />
      <Root className={classes.root}>
        <Avatar className={classes.avatar}>
          <AddIcon />
        </Avatar>

        <Typography variant="h1">Add Book</Typography>

        <Form
          noValidate
          onSubmit={formik.handleSubmit}
          encType="multipart/form-data"
        >
          <TextField
            className={classes.select}
            label="Select a level and grade"
            id="levelAndGrade-select"
            name="levelAndGrade"
            select
            value={formik.values.levelAndGrade}
            onChange={formik.handleChange}
            error={
              formik.touched.levelAndGrade &&
              Boolean(formik.errors.levelAndGrade)
            }
            helperText={
              formik.touched.levelAndGrade && formik.errors.levelAndGrade
            }
            fullWidth
            margin="normal"
            autoFocus
          >
            {levelAndGradeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="text"
            value={formik.values.publisher}
            onChange={formik.handleChange}
            error={formik.touched.publisher && Boolean(formik.errors.publisher)}
            helperText={formik.touched.publisher && formik.errors.publisher}
            name="publisher"
            variant="outlined"
            fullWidth
            id="publisher"
            label="Publisher (English name e.g. YBM)"
            margin="normal"
          />

          <TextField
            type="text"
            value={formik.values.authorSurname}
            onChange={formik.handleChange}
            error={
              formik.touched.authorSurname &&
              Boolean(formik.errors.authorSurname)
            }
            helperText={
              formik.touched.authorSurname && formik.errors.authorSurname
            }
            name="authorSurname"
            variant="outlined"
            fullWidth
            id="authorSurname"
            label="First author surname"
            margin="normal"
          />

          <TextField
            type="number"
            value={formik.values.year}
            onChange={formik.handleChange}
            error={formik.touched.year && Boolean(formik.errors.year)}
            helperText={formik.touched.year && formik.errors.year}
            name="year"
            variant="outlined"
            fullWidth
            id="year"
            label="Year"
            min="2014"
            max="2030"
            step="1"
            margin="normal"
          />

          <BookImageUploader
            setFieldValue={formik.setFieldValue}
            isFetching={isFetching}
          />
          {formik.touched.coverImg && Boolean(formik.errors.coverImg) && (
            <FormHelperText
              error={Boolean(formik.errors.coverImg)}
              className={classes.BookImageUploaderHelperText}
            >
              {formik.touched.coverImg && formik.errors.coverImg}
            </FormHelperText>
          )}

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
