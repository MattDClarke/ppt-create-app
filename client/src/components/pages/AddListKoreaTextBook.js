import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import { useTitle } from '../../hooks/useTitle';
import {
  DispatchWordsContext,
  WordsContext,
} from '../../contexts/words.context';
import { WordList } from '../WordListForm/WordList';
import { addListKoreaTextBookValidationSchema } from '../../validators/validationSchemas';

import { getCookie } from '../../helpers/utils';
import { levelAndGradeOptions } from '../../helpers/listsValues';
import { backendEndpoint } from '../../config';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import useInputState from '../../hooks/useInputState';

import { classes, Root, Form } from './styles/FormStyles';

export default function AddListKoreaTextBook() {
  useTitle('ppt Create | Add Korean Textbook');
  const formik = useFormik({
    initialValues: {
      levelAndGrade: '',
      year: 2021,
      publisher: '',
      authorSurname: '',
      title: '',
    },
    validationSchema: addListKoreaTextBookValidationSchema,

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
  const [word, updateWord, resetWord] = useInputState('');

  const dispatchWords = useContext(DispatchWordsContext);
  const words = useContext(WordsContext);

  const MAX_NUM_WORDS = 30;
  const wordsLen = words.length;
  const warn = wordsLen >= MAX_NUM_WORDS;

  useEffect(() => {
    // context used in /create. Make sure it is empty on page load
    dispatchWords({ type: 'REMOVE_ALL' });
  }, [dispatchWords]);

  function addWord() {
    if (wordsLen >= 30) return;
    dispatchWords({ type: 'ADD', word });
    resetWord();
  }

  const handleClick = () => {
    if (word.length === 0) return;
    addWord();
  };

  const handleKeyDown = (e) => {
    if (word.length === 0) return;
    if (e.code === 'Enter') {
      // prevent submit (changes word lists state)
      e.preventDefault();
      addWord();
    }
  };

  function handleSubmit(inputs) {
    // set form state to word context state
    formik.setFieldValue('formWords', words);
    setIsFetching(true);
    // extra check
    if (wordsLen > MAX_NUM_WORDS) return;
    axios({
      method: 'POST',
      data: { ...inputs, words },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/add-list-korea-textbook`,
    })
      .then(() => {
        setSuccessMsgs('List added successfully');
        // multiple books may be added - multiple success messages
        setCountSuccessMsgs(countSuccessMsgs + 1);
        setIsFetching(false);
        // reset words context
        dispatchWords({ type: 'REMOVE_ALL' });
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
        <Typography variant="h1">Add Korean Textbook List</Typography>
        <Form noValidate onSubmit={formik.handleSubmit}>
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

          <TextField
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            name="title"
            variant="outlined"
            fullWidth
            id="title"
            label="Title e.g. '1) Oh! It's a ball!'"
            margin="normal"
            inputProps={{ maxLength: 50 }}
          />

          <Box className={classes.addWordFormGroup}>
            <TextField
              label="Add Word"
              margin="normal"
              type="text"
              value={word}
              onChange={updateWord}
              inputProps={{ maxLength: 50 }}
              onKeyDown={handleKeyDown}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleClick}
              startIcon={<AddIcon />}
              className={classes.addBtn}
              disabled={wordsLen >= MAX_NUM_WORDS || isFetching}
            >
              Add
            </Button>
          </Box>
          <FormHelperText
            style={{ padding: '0.5rem 1rem', color: warn && 'red' }}
          >
            <span>Current word count: {wordsLen}</span>
            <br />
            <span>Min: 3 words, Max: {MAX_NUM_WORDS} words.</span>
          </FormHelperText>

          <WordList isSubmitting={isFetching} />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submitBtn}
            disabled={wordsLen < 3 || !!isFetching || wordsLen > MAX_NUM_WORDS}
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
