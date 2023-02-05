import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';
import { TransitionGroup } from 'react-transition-group';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import DeleteIcon from '@mui/icons-material/Delete';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DeleteConfirmDialog from '../reuseable/DeleteConfirmDialog';
import useWordListsDeleteAll from '../../hooks/useWordListsDeleteAll';
import useWordListsReorder from '../../hooks/useWordListsReorder';
import useWordListsGet from '../../hooks/useWordListsGet';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import MsgSnackbar from '../reuseable/MsgSnackbar';

import WordListsDialogListItem from './WordListsDialogListItem';
import { DispatchWordsContext } from '../../contexts/words.context';

function WordListsDialogRaw(props) {
  const { onClose, open, setTitle, wordLists, setWordLists, ...other } = props;
  const { data, error } = useWordListsGet();
  const radioGroupRef = useRef(null);
  const isFirstWordListLoad = useRef(true);
  const dispatchWords = useContext(DispatchWordsContext);
  const queryClient = useQueryClient();
  const deleteAllWordLists = useWordListsDeleteAll();
  const reorderWordLists = useWordListsReorder();

  // keep track of num of list words checked (if multiple checkboxes checked, so that max num of words not exceeded
  const MAX_NUM_WORDS = 30;

  const [checkboxTitles, setCheckboxTitles] = useState([]);
  // const [wordLists, setWordLists] = useState([]);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);

  // get all words from word lists selected
  function filterCheckboxTitlesChecked() {
    return checkboxTitles.filter((obj) => obj.checked === true);
  }
  const checkboxTitlesChecked = filterCheckboxTitlesChecked();

  const selectedWords = checkboxTitlesChecked
    .map((obj) => obj.title)
    .map(
      (checkedTitle) =>
        wordLists.filter((wordList) => wordList.title === checkedTitle)[0].words
    )
    .flat();
  const selectedWordsLength = selectedWords.length;
  const err = selectedWordsLength > MAX_NUM_WORDS;

  const loadingMsg = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '50px auto',
        padding: 0,
      }}
    >
      <LoaderThreeDots />
    </div>
  );

  // set state of checkboxes once query data in
  useEffect(() => {
    // if error getting word lists
    if (error) {
      setErrorMsgs('There was an error getting your word lists');
    }
    if (data) {
      setErrorMsgs(null);
    }
    // make sure not undefined on page load
    if (data?.data?.lists) {
      const cacheWordLists = queryClient.getQueryData(['wordLists']);
      // sort by order before displaying
      const sortedCacheWordLists = cacheWordLists.data.lists.sort(
        (a, b) => a.order - b.order
      );
      setWordLists(sortedCacheWordLists);
      const checkedState = sortedCacheWordLists.map((item) => ({
        title: item.title,
        checked: false,
      }));

      setCheckboxTitles(checkedState);

      // to only show loading icon on first load
      isFirstWordListLoad.current = false;
    }
  }, [data?.data?.lists, queryClient, error, data, setWordLists]);

  const handleentering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleOk = () => {
    if (checkboxTitlesChecked.length === 1) {
      const wordListTitle = checkboxTitlesChecked[0].title;
      setTitle(wordListTitle);
      dispatchWords({ type: 'ADD_ALL', newWords: selectedWords });
      onClose();
    }
    if (checkboxTitlesChecked.length > 1 && !err) {
      // removes duplicate words
      const comboSelectedWords = selectedWords.filter(
        (
          (obj) =>
          ({ word }) =>
            !obj.has(word) && obj.add(word)
        )(new Set())
      );
      // give new ids - handled in reducer
      setTitle('');
      dispatchWords({ type: 'ADD_ALL', newWords: comboSelectedWords });
      onClose();
    }
  };

  const handleClickOpenDeleteForm = () => {
    setOpenDeleteForm(true);
  };

  const handleCloseDeleteForm = () => {
    setOpenDeleteForm(false);
  };

  // react-beautiful-dnd
  const onDragStart = (start, provided) => {
    provided.announce(
      `You have lifted the word list in position ${start.source.index + 1}`
    );
  };

  const onDragUpdate = (update, provided) => {
    const message = update.destination
      ? `You have moved the word list to position ${
          update.destination.index + 1
        }`
      : 'You are currently not over a droppable area';

    provided.announce(message);
  };

  const onDragEnd = (result, provided) => {
    const message = result.destination
      ? `You have moved the word list from position ${
          result.source.index + 1
        } to ${result.destination.index + 1}`
      : `The word list has been returned to its starting position of ${
          result.source.index + 1
        }`;

    provided.announce(message);

    const { destination, source, draggableId } = result;

    // destination can be null (e.g. dragged outside)
    if (!destination) return;
    // check that destination has changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // sort based on titles - titles unique -> if same title used as a previous word list -> overwrite
    const newWordTitles = wordLists.map((wordList) => wordList.title);
    newWordTitles.splice(source.index, 1);
    newWordTitles.splice(destination.index, 0, draggableId);
    // new order for word lists
    const wordListsWithOrder = newWordTitles.map((wordList, i) => ({
      title: wordList,
      order: i + 1,
    }));

    // determine new state order for optimistic react-query update
    const newWordListsOrder = wordListsWithOrder.map((wordListWithOrder) => {
      const obj = wordLists.filter(
        (wordList) => wordList.title === wordListWithOrder.title
      )[0];
      obj.order = wordListWithOrder.order;
      return obj;
    });
    // snapshot prev cache state (in case error in mutation -> roll-back)
    const prevWordLists = wordLists;
    setWordLists(newWordListsOrder);
    reorderWordLists.mutate(wordListsWithOrder, {
      onMutate: async () => {
        // cancel outgoing query so that they do not overwrite optimistic update
        // refetch will occur on settled - make sure real server state in cache
        await queryClient.cancelQueries();
        // optimistically update
        queryClient.setQueryData('wordLists', newWordListsOrder);
        return { prevWordLists };
      },
      onError: (error, context) => {
        queryClient.setQueryData('wordLists', context.prevWordLists);
        setErrorMsgs('Reorder Failed');
        setCountMsgs((prevCount) => prevCount + 1);
      },
      onSettled: () => {
        queryClient.invalidateQueries('wordLists');
        // clear error and data of mutation request
        reorderWordLists.reset();
        setErrorMsgs(null);
      },
    });
  };

  return (
    <Dialog
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          onClose(event, reason);
        }
      }}
      maxWidth="md"
      TransitionProps={{ onEntering: handleentering }}
      aria-labelledby="Previously used word lists"
      sx={{ '& div': { mx: 0 } }}
      open={open}
      // eslint-disable-next-line
      {...other}
    >
      <DialogTitle id="previously-used-word-lists" sx={{ textAlign: 'center' }}>
        {wordLists.length === 0
          ? 'You have no word lists'
          : `My ${wordLists.length} Word List${
              wordLists.length === 1 ? '' : 's'
            }`}
      </DialogTitle>
      <DialogContent
        dividers
        style={{ margin: '2px' }}
        sx={{
          overflowY: 'unset',
          px: { xs: 0, md: 1.5 },
          py: 0,
          mx: { xs: 0, md: 0.3 },
        }}
      >
        {/* popup error messages */}
        <MsgSnackbar
          msgType="error"
          msgs={errorMsgs}
          autoHideDuration={10000}
          countMsgs={countMsgs}
        />
        {/* eslint-disable-next-line */}
        {isFirstWordListLoad.current ? (
          loadingMsg
        ) : (
          <FormControl
            required
            component="fieldset"
            error={err}
            sx={{ display: 'flex' }}
          >
            <FormGroup
              style={{
                margin: 0,
              }}
            >
              <DragDropContext
                onDragStart={onDragStart}
                onDragUpdate={onDragUpdate}
                onDragEnd={onDragEnd}
              >
                <Droppable droppableId="WordLists">
                  {/* provided is an object */}
                  {/* droppable uses render prop pattern, needs a child that is a function that returns a component */}
                  {(provided) => (
                    // eslint-disable-next-line
                    <List ref={provided.innerRef} {...provided.droppableProps} sx={{
                        padding: 0,
                        '& div': {
                          margin: 0,
                        },
                      }}
                    >
                      <TransitionGroup>
                        {wordLists.map((list, i) => (
                          <Collapse
                            key={list.title}
                            style={{ margin: 0 }}
                            sx={{
                              '& div': {
                                margin: 0,
                              },
                            }}
                          >
                            <WordListsDialogListItem
                              id={list.title}
                              key={list.title}
                              list={list}
                              index={i}
                              checkboxTitles={checkboxTitles}
                              setCheckboxTitles={setCheckboxTitles}
                              wordLists={wordLists}
                              setWordLists={setWordLists}
                              setErrorMsgs={setErrorMsgs}
                              setCountMsgs={setCountMsgs}
                            />
                          </Collapse>
                        ))}
                        {/* it is an element that increases space when needed during drag */}
                        {provided.placeholder}
                      </TransitionGroup>
                    </List>
                  )}
                </Droppable>
              </DragDropContext>

              <Box
                sx={{
                  textAlign: 'center',
                  padding: (theme) => `${theme.spacing(1.5)} 0`,
                }}
              >
                {wordLists.length ? (
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ color: (theme) => theme.palette.background.paper }}
                    startIcon={<DeleteIcon />}
                    onClick={handleClickOpenDeleteForm}
                    disabled={deleteAllWordLists.isLoading}
                  >
                    {/* eslint-disable  */}
                    {deleteAllWordLists.isLoading
                      ? 'Deleting...'
                      : deleteAllWordLists.isError
                      ? 'Error!'
                      : 'Delete All Word Lists'}
                    {/* eslint-enable  */}
                  </Button>
                ) : (
                  <Box sx={{ p: 2, mb: (theme) => theme.spacing(2) }}>
                    No lists
                  </Box>
                )}

                <DeleteConfirmDialog
                  open={openDeleteForm}
                  onClose={handleCloseDeleteForm}
                  route="wordLists"
                  setErrorMsgs={setErrorMsgs}
                  setCountMsgs={setCountMsgs}
                  setCheckboxTitles={setCheckboxTitles}
                />
              </Box>
            </FormGroup>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions>
        {wordLists.length ? (
          <FormHelperText
            style={{ flex: '1', marginLeft: '1rem', color: err && 'red' }}
          >
            {`${selectedWordsLength} words selected ${
              err ? `Max number of words: ${MAX_NUM_WORDS}` : ''
            }`}
          </FormHelperText>
        ) : null}
        <Button
          onClick={handleOk}
          color="primary"
          type="submit"
          disabled={checkboxTitlesChecked.length === 0 || err}
        >
          Ok
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function WordListsDialog({ setTitle, wordLists, setWordLists }) {
  const [open, setOpen] = useState(false);

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickListItem}
        aria-haspopup="true"
        aria-controls="Word Lists - menu"
        aria-label="Previously used word lists"
      >
        My saved lists
      </Button>
      <WordListsDialogRaw
        open={open}
        onClose={handleClose}
        setTitle={setTitle}
        wordLists={wordLists}
        setWordLists={setWordLists}
      />
    </div>
  );
}

WordListsDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setTitle: PropTypes.func.isRequired,
  wordLists: PropTypes.array.isRequired,
  setWordLists: PropTypes.func.isRequired,
};

WordListsDialog.propTypes = {
  setTitle: PropTypes.func.isRequired,
  wordLists: PropTypes.array.isRequired,
  setWordLists: PropTypes.func.isRequired,
};
