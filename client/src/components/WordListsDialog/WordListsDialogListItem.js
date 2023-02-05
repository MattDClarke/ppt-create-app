import React from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { Draggable } from 'react-beautiful-dnd';
import useWordListDelete from '../../hooks/useWordListDelete';

import { classes, ListItemRoot } from './styles/WordListsDialogListItemStyles';

export default function WordListsDialogListItem({
  list,
  checkboxTitles,
  setCheckboxTitles,
  id,
  index,
  wordLists,
  setWordLists,
  setErrorMsgs,
  setCountMsgs,
}) {
  const queryClient = useQueryClient();
  const deleteWordList = useWordListDelete();

  const handleChange = (position) => {
    const updatedcheckboxTitlesState = checkboxTitles.map((item, i) =>
      i === position ? { ...item, checked: !item.checked } : item
    );
    setCheckboxTitles(updatedcheckboxTitlesState);
  };

  async function handleDelete(title) {
    // get number of lists and order of item to delete
    const cachedWordLists = queryClient.getQueryData(['wordLists']).data.lists;
    const cachedWordListToDelete = cachedWordLists.find(
      (wordList) => wordList.title === title
    );

    // for optimistic deletion mutation - change state before mutation - better user experience - quicker
    const newWordLists = wordLists.filter(
      (wordList) => wordList.title !== cachedWordListToDelete.title
    );
    // snapshot prev cache state (in case error in mutation -> roll-back)
    const prevWordLists = wordLists;
    // const prevCheckboxTitles = checkboxTitles;

    setWordLists(newWordLists);

    // sort by order before displaying
    const checkedState = newWordLists.map((item) => ({
      title: item.title,
      checked: false,
    }));

    setCheckboxTitles(checkedState);

    // make order props correct
    for (
      let i = cachedWordListToDelete.order;
      i <= newWordLists.length;
      i += 1
    ) {
      newWordLists[i - 1].order = i;
    }

    try {
      await deleteWordList.mutateAsync({
        title,
        order: cachedWordListToDelete.order,
        numberOfWordLists: cachedWordLists.length,
      });
    } catch (error) {
      queryClient.setQueryData('wordLists', prevWordLists);
      setErrorMsgs('Delete Failed');
      setCountMsgs((prevCount) => prevCount + 1);
    } finally {
      queryClient.invalidateQueries('wordLists');
      deleteWordList.reset();
      setErrorMsgs(null);
    }
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <ListItemRoot
          // eslint-disable-next-line
          {...provided.draggableProps}
          // eslint-disable-next-line
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={classes.root}
          sx={{
            py: { xs: 0.5, md: 1 },
            backgroundColor: (theme) =>
              snapshot.isDragging.toString() === 'true'
                ? `${theme.palette.action.selected}`
                : `${theme.palette.background.def}`,
          }}
          // spread in draggable props styles
          style={{
            ...provided.draggableProps.style,
          }}
          divider
          aria-roledescription="Press space bar to lift the word"
        >
          <DragIndicatorIcon
            className={classes.DragIndicatorIcon}
            sx={{
              marginRight: { xs: '0', sm: '24px' },
            }}
          />
          <Box className={classes.ListItemFormControls}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkboxTitles[index]?.checked ?? false}
                  onChange={() => handleChange(index)}
                  name={list.title}
                  icon={<CheckCircleOutlinedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  sx={{
                    color: (theme) => theme.palette.success.light,
                    '&.Mui-checked': {
                      color: (theme) => theme.palette.success.main,
                    },
                  }}
                />
              }
              label={
                <Typography variant="h4" component="h2">
                  {list.title}
                </Typography>
              }
            />
            <Box className={classes.spacer} />
            <IconButton
              aria-label="Delete"
              onClick={() => handleDelete(list.title)}
              disabled={deleteWordList.isLoading}
              size="large"
              sx={{
                order: { xs: '1', smSmMd: '0' },
                marginLeft: { xs: 'auto', smSmMd: '0' },
                p: { xs: 0, md: 1 },
              }}
            >
              <DeleteIcon sx={{ paddingLeft: 'auto' }} />
            </IconButton>
            <Box className={classes.ListItemWords}>
              {list.words.map((word) => word.word).join(', ')}
            </Box>
          </Box>
        </ListItemRoot>
      )}
    </Draggable>
  );
}

WordListsDialogListItem.propTypes = {
  list: PropTypes.object.isRequired,
  checkboxTitles: PropTypes.array.isRequired,
  setCheckboxTitles: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  wordLists: PropTypes.array.isRequired,
  setWordLists: PropTypes.func.isRequired,
  setErrorMsgs: PropTypes.func.isRequired,
  setCountMsgs: PropTypes.func.isRequired,
};
