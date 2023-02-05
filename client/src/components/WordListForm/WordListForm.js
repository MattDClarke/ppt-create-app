import { useState, useContext, useEffect } from 'react';
import { useQueryClient, useIsFetching } from 'react-query';
import { useLocation } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { arraysEqualByProp, wait } from '../../helpers/utils';
import {
  DispatchWordsContext,
  WordsContext,
} from '../../contexts/words.context';
import { WordList } from './WordList';
import WordListsDialog from '../WordListsDialog/WordListsDialog';
import ImagesSelectDialog from '../ImagesSelectDialog/ImagesSelectDialog';
import { useMountedState } from '../../hooks/useMountedState';
import useInputState from '../../hooks/useInputState';
import useWordList from '../../hooks/useWordList';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import { classes, FormRoot } from './styles/WordListFormStyles';

function WordListForm() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const [isSaving, setIsSaving] = useState(false);
  const [word, updateWord, resetWord] = useInputState('');
  const [wordLists, setWordLists] = useState([]);
  const [title, setTitle] = useState('');
  const [imagesSelectDialogShowing, imagesSelectDialogShow] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);
  const addOrEditWordList = useWordList();
  const dispatchWords = useContext(DispatchWordsContext);
  const words = useContext(WordsContext);
  const [wordListsLength, setWordListsLength] = useState(0);
  const [isNewTitle, setIsNewTitle] = useState(false);
  const location = useLocation();
  const isMounted = useMountedState();

  const MAX_NUM_WORDS = 30;
  const MAX_CHARS_TITLE = 50;
  const wordsLen = words.length;
  const titleLen = title.length;
  const warn = wordsLen >= MAX_NUM_WORDS;

  useEffect(() => {
    // context used in /create. Make sure it is empty on page load
    // dnt empty if navigating from List page -> title and words passed in
    if (!location.state?.selectedTitles) {
      dispatchWords({ type: 'REMOVE_ALL' });
    }
  }, [location, dispatchWords]);

  useEffect(() => {
    async function showMsg() {
      await wait(500);
      // only change state if wait completes. E.g. in case user, after account update
      // and redirect to this page, navigates to another page right away
      if (isMounted()) {
        if (location.state?.selectedTitles) {
          setTitle(location.state.selectedTitles);
        }
      }
    }
    showMsg();
  }, [location, isMounted]);

  useEffect(() => {
    setWordListsLength(wordLists.length);
  }, [wordLists]);

  // when wordLists or title changes - check if title exists in existing wordLists
  useEffect(() => {
    if (wordLists.filter((obj) => obj.title === title).length === 0) {
      setIsNewTitle(true);
    } else {
      setIsNewTitle(false);
    }
  }, [wordLists, title]);

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

  const handleKeyDownTitleInput = (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSetTitle = (e) => {
    setTitle(e.target.value);
  };

  return (
    <>
      {/* popup error messages */}
      <MsgSnackbar
        msgType="error"
        msgs={errorMsgs}
        autoHideDuration={10000}
        countMsgs={countMsgs}
      />

      <WordListsDialog
        setTitle={setTitle}
        wordLists={wordLists}
        setWordLists={setWordLists}
      />

      <FormRoot
        className={classes.root}
        onSubmit={(e) => {
          e.preventDefault();
          if (titleLen > MAX_CHARS_TITLE) return;
          // only mutate if word list (title and words (order NB)) in react state is different to word list in react-query cache
          // if ( title ===  && words)
          // const cacheWordLists = queryClient.getQueryData(['wordLists']);
          // const wordListsLength = cacheWordLists?.data?.lists.length;
          const currWordList = wordLists?.find((li) => li.title === title);

          // open ImageSelectDialog if save and create ppt and max num of word lists not reached
          const actionType =
            document.activeElement.getAttribute('data-action-type');
          if (
            (actionType === 'save-and-make' || actionType === 'make') &&
            wordListsLength <= 20
          ) {
            imagesSelectDialogShow(true);
          }

          // if no save -> skip mutation
          if (actionType === 'make') {
            return;
          }

          if (
            currWordList?.title === title &&
            arraysEqualByProp(currWordList?.words, words, 'word')
          ) {
            return;
          }
          setIsSaving(true);
          // const wordListsLength = cacheWordLists?.data?.lists.length;
          const order = wordListsLength + 1;

          addOrEditWordList.mutate(
            { title, words, order },
            {
              onSuccess: (res) => {
                queryClient.invalidateQueries('wordLists');
              },
              onError: (error) => {
                setErrorMsgs(error.response.data);
                setCountMsgs((prevCount) => prevCount + 1);
              },
              onSettled: async () => {
                // clear error and data of mutation request
                addOrEditWordList.reset();
                setErrorMsgs(null);
                setIsSaving(false);
              },
            }
          );
        }}
      >
        <Paper className={classes.formPaper}>
          <TextField
            label="Add Word List Title"
            margin="normal"
            onChange={handleSetTitle}
            value={title}
            required
            autoFocus
            onKeyDown={handleKeyDownTitleInput}
          />
          <FormHelperText
            style={{
              textAlign: 'center',
              padding: '0.5rem 1rem',
              color: 'red',
            }}
          >
            {titleLen > MAX_CHARS_TITLE ? (
              <span>
                <span>Current character count: {titleLen}</span>
                <br />
                <span>Max of {MAX_CHARS_TITLE} characters.</span>
              </span>
            ) : (
              ''
            )}
          </FormHelperText>
          <Box className={classes.addWordFormGroup}>
            <TextField
              label="Add Word"
              margin="dense"
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
              disabled={wordsLen >= MAX_NUM_WORDS || isSaving}
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
        </Paper>

        <WordList isSubmitting={isSaving} sx={{ minHeight: '20px' }} />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-action-type="save"
          className={classes.submitBtn}
          disabled={
            titleLen > MAX_CHARS_TITLE ||
            wordsLen < 3 ||
            wordsLen > MAX_NUM_WORDS ||
            !!isFetching ||
            wordListsLength > 20 ||
            (wordListsLength === 20 && isNewTitle) ||
            isSaving === true
          }
        >
          {/* eslint-disable  */}
          {isFetching
            ? 'Saving...'
            : 'Save List'}
          {/* eslint-enable  */}
        </Button>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-action-type="save-and-make"
          className={classes.submitBtn}
          disabled={
            titleLen > MAX_CHARS_TITLE ||
            wordsLen < 3 ||
            wordsLen > MAX_NUM_WORDS ||
            !!isFetching ||
            wordListsLength > 20 ||
            (wordListsLength === 20 && isNewTitle) ||
            isSaving === true
          }
        >
          Save List and Make PowerPoint Presentation
        </Button>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-action-type="make"
          className={classes.submitBtn}
          disabled={
            titleLen > MAX_CHARS_TITLE ||
            wordsLen < 3 ||
            wordsLen > MAX_NUM_WORDS ||
            !!isFetching ||
            wordListsLength > 20 ||
            isSaving === true
          }
        >
          Make PowerPoint Presentation
        </Button>

        <FormHelperText
          style={{
            textAlign: 'center',
            padding: '0.5rem 1rem',
            color: 'red',
          }}
        >
          {wordListsLength >= 20 && isNewTitle ? (
            <span>Max of 20 word lists allowed.</span>
          ) : (
            ''
          )}
        </FormHelperText>
      </FormRoot>

      {imagesSelectDialogShowing && (
        <ImagesSelectDialog
          imagesSelectDialogShow={imagesSelectDialogShow}
          title={title}
        />
      )}
    </>
  );
}

export default WordListForm;
