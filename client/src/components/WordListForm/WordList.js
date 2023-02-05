import { useContext } from 'react';
import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Collapse from '@mui/material/Collapse';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TransitionGroup } from 'react-transition-group';
import {
  DispatchWordsContext,
  WordsContext,
} from '../../contexts/words.context';

import Word from './Word';
// The `props` object contains a `style` prop.
// You need to provide it to the `div` element as shown here.
export function WordList({ isSubmitting }) {
  // function WordList({ isSubmitting }) {

  const words = useContext(WordsContext);
  const dispatchWords = useContext(DispatchWordsContext);

  const handleDelete = () => {
    dispatchWords({ type: 'REMOVE_ALL', words });
  };

  // react-beautiful-dnd
  const onDragStart = (start, provided) => {
    provided.announce(
      `You have lifted the word in position ${start.source.index + 1}`
    );
  };

  const onDragUpdate = (update, provided) => {
    const message = update.destination
      ? `You have moved the word to position ${update.destination.index + 1}`
      : 'You are currently not over a droppable area';

    provided.announce(message);
  };

  const onDragEnd = (result, provided) => {
    const message = result.destination
      ? `You have moved the word from position ${result.source.index + 1} to ${
          result.destination.index + 1
        }`
      : `The word has been returned to its starting position of ${
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
    // For example:
    // [
    // { id: 1, word: 'cat' },
    // { id: 2, word: 'dog' }
    // ]
    const newWordIds = words.map((word) => word.id);
    // [1, 2]
    // remove word from start of drag, add to destination
    newWordIds.splice(source.index, 1);
    // [2]
    newWordIds.splice(destination.index, 0, draggableId);

    // [2, 1]
    // pass the new id order to dispatch (make a reorder dispatch type)
    dispatchWords({ type: 'REORDER', newWordIds });
  };

  return (
    <Paper>
      <DragDropContext
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId="Words">
          {/* provided is an object */}
          {/* droppable uses render prop pattern, needs a child that is a function that returns a component */}
          {(provided) => (
            <List
              ref={provided.innerRef}
              style={{ padding: '0' }}
              // eslint-disable-next-line
                {...provided.droppableProps}
            >
              <TransitionGroup>
                {words.map((word, i) => (
                  <Collapse key={word.id}>
                    {/* eslint-disable-next-line */}
                    <Word {...word} index={i} key={word.id}   />
                  </Collapse>
                ))}
                {/* it is an element that increases space when needed during drag */}
                {provided.placeholder}
              </TransitionGroup>
            </List>
          )}
        </Droppable>
      </DragDropContext>

      {words.length ? (
        <Button
          variant="contained"
          color="error"
          sx={{
            margin: (theme) => theme.spacing(3),
            color: (theme) => theme.palette.background.paper,
          }}
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          Delete All List Items
        </Button>
      ) : null}
    </Paper>
  );
}

WordList.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
};
