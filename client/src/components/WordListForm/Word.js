import { useState, useContext, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { Draggable } from 'react-beautiful-dnd';
import { DispatchWordsContext } from '../../contexts/words.context';

function Word({ id, word, index }) {
  const dispatchWords = useContext(DispatchWordsContext);
  const [wordInput, setWordInput] = useState(word);

  const handleEdit = (e) => {
    setWordInput(e.target.value);
  };

  const handleDelete = () => {
    dispatchWords({ type: 'REMOVE', id });
  };

  // wordInput does not get set immediately in handleEdit (React may batch state changes for efficiency). If edit dispatch left in handleEdit, dispatch may occur before wordInput set, so old wordInput used for dispatch. No change in list item because it's value is the word state (Word rendered using old wordInput). useEffect waits for wordInput to change before dispatch occurs - new wordInput used
  useEffect(() => {
    dispatchWords({ type: 'EDIT', id, newWord: wordInput });
  }, [dispatchWords, id, wordInput]);

  const handleKeyDown = (e) => {
    if (e.code === 'Enter') {
      // prevent accidental submit
      e.preventDefault();
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <ListItem
          // eslint-disable-next-line
          {...provided.draggableProps}
          // eslint-disable-next-line
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          divider
          sx={{
            transition: 'background-color 0.3s ease',
            padding: '0',
            backgroundColor: (theme) =>
              snapshot.isDragging.toString() === 'true'
                ? `${theme.palette.action.selected}`
                : `${theme.palette.background.def}`,
          }}
          // spread in draggable props styles
          style={{
            ...provided.draggableProps.style,
          }}
          aria-roledescription="Press space bar to lift the word"
        >
          <Tooltip TransitionComponent={Zoom} title="Reorder" placement="top">
            <DragIndicatorIcon
              sx={{
                marginRight: (theme) => theme.spacing(2),
                color: (theme) => theme.palette.grey[500],
              }}
            />
          </Tooltip>
          <>
            <TextField
              margin="dense"
              value={word}
              onChange={handleEdit}
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
              onKeyDown={handleKeyDown}
              sx={{ input: { paddingTop: 1, paddingBottom: 1 } }}
            />
            <IconButton aria-label="Delete" onClick={handleDelete} size="large">
              <DeleteIcon />
            </IconButton>
          </>
        </ListItem>
      )}
    </Draggable>
  );
}

Word.propTypes = {
  id: PropTypes.string.isRequired,
  word: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default memo(Word);
