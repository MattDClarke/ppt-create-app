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
import { addListOtherValidationSchema } from '../../validators/validationSchemas';

import { getCookie } from '../../helpers/utils';
import { listItems } from '../../helpers/listsValues';
import { backendEndpoint } from '../../config';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import useInputState from '../../hooks/useInputState';

import { classes, Root, Form } from './styles/FormStyles';

export default function AddListOther() {
  useTitle('ppt Create | Add List - Other');
  const formik = useFormik({
    initialValues: {
      list: '',
      title: '',
    },
    validationSchema: addListOtherValidationSchema,

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
    if (wordsLen >= MAX_NUM_WORDS) return;
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
    const { list, title } = inputs;
    axios({
      method: 'POST',
      data: { title, pageKey: list, words },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/add-list-other`,
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
        <Typography variant="h1">Add Other List</Typography>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            className={classes.select}
            label="Select a list"
            id="list-select"
            name="list"
            select
            value={formik.values.list}
            onChange={formik.handleChange}
            error={formik.touched.list && Boolean(formik.errors.list)}
            helperText={formik.touched.list && formik.errors.list}
            fullWidth
            margin="normal"
            autoFocus
          >
            {listItems.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

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
            label="Title e.g. 'Herbivores'"
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
