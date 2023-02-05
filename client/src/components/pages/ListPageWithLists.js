import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DispatchWordsContext } from '../../contexts/words.context';
import Loader from '../reuseable/Loader';
import { sentenceCase } from '../../helpers/utils';
import { listItems } from '../../helpers/listsValues';
import useListsGet from '../../hooks/useListsGet';
import { useTitle } from '../../hooks/useTitle';
import { classes, GridRoot } from './styles/ListPageWithListsStyles';

function sortLists(a, b) {
  const titleA = a.title;
  const titleB = b.title;
  if (titleA < titleB) {
    return -1;
  }
  if (titleA > titleB) {
    return 1;
  }

  // names must be equal
  return 0;
}

export default function ListPageWithLists() {
  // The <List> that rendered this component has a
  // path of `/lists/:listId`. The `:listId` portion
  // of the URL indicates a placeholder that we can
  // get from `useParams()`.
  const { list, level, grade, book } = useParams();
  useTitle('ppt Create | Lists');
  // make arr of params that are not undefined
  const [checkedState, setCheckedState] = useState([]);
  // useListsGet argument passed in depends on list type
  let pageKeyStr = '';
  if (list === 'korea-textbook') {
    pageKeyStr = `${list}_${level}_${grade}_${book}`;
  } else {
    pageKeyStr = list;
  }
  const { status, data, error, isFetching } = useListsGet(pageKeyStr);
  const dispatchWords = useContext(DispatchWordsContext);
  const history = useHistory();

  const checkedLists = checkedState
    .filter((lst) => lst.checked === true)
    .map((li) => li.title);

  // set state of checkboxes once data in
  useEffect(() => {
    if (data?.lists) {
      const listCheckedState = data?.lists
        .sort((a, b) => sortLists(a, b))
        .map((li) => ({
          title: li.title,
          words: li.words,
          checked: false,
        }));
      setCheckedState(listCheckedState);
    }
  }, [data?.lists]);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === position ? { ...item, checked: !item.checked } : item
    );
    setCheckedState(updatedCheckedState);
  };
  // disable checkboxes if 3 selected
  const isDisabled = (title) => {
    const checkedItems = checkedState.filter((item) => item.checked);

    return (
      checkedItems.length > 2 &&
      checkedItems.filter((itm) => itm.title === title).length === 0
      // title === '1) lesson 1'
    );
  };

  const handleCreateNavigation = () => {
    const checkedItems = checkedState.filter((item) => item.checked);
    const selectedTitles = checkedItems.map((itm) => itm.title).join(' + ');
    const selectedWords = checkedItems.map((obj) => obj.words).flat();

    if (checkedItems.length === 1) {
      dispatchWords({ type: 'ADD_ALL', newWords: selectedWords });
    }
    if (checkedItems.length > 1) {
      // removes duplicate words
      const comboSelectedWords = selectedWords.filter(
        (
          (obj) =>
          ({ word }) =>
            !obj.has(word) && obj.add(word)
        )(new Set())
      );
      dispatchWords({ type: 'ADD_ALL', newWords: comboSelectedWords });
    }

    history.push({
      pathname: '/create',
      state: { selectedTitles },
    });
  };

  const bookInfoDisplay = (bookStr) => {
    const infoArrRaw = bookStr.split('_');
    const infoArr = infoArrRaw.map((str) => {
      if (str === 'ybm') {
        return str.toUpperCase();
      }
      return sentenceCase(str);
    });
    return infoArr.join(' ');
  };

  const otherListCheck = (value) => {
    if (listItems.map((option) => option.value).includes(value)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {list === 'korea-textbook' ? (
        <>
          <Typography variant="h1">
            {sentenceCase(level)} School Grade {grade}
          </Typography>
          <Typography variant="h2">{bookInfoDisplay(book)}</Typography>
        </>
      ) : (
        ''
      )}

      {otherListCheck(list) ? (
        <Typography variant="h1">{sentenceCase(list)}</Typography>
      ) : (
        ''
      )}
      <Box sx={{ display: 'block', marginBottom: (theme) => theme.spacing(2) }}>
        <Typography variant="h2" component="p">
          Select up to 3
        </Typography>
      </Box>

      {/* eslint-disable-next-line  */}
      {status === 'loading' ? (
        <Loader fullScreen={false} />
      ) : status === 'error' ? (
        <span>Error: {error.response.data}</span>
      ) : (
        <GridRoot container justifyContent="center" className={classes.root}>
          <Grid item xs={11} md={8} lg={6}>
            <Paper>
              <List>
                {data.lists
                  .sort((a, b) => sortLists(a, b))
                  .map(({ _id, title, words }, i) => (
                    <React.Fragment key={_id}>
                      <ListItem key={_id} className={classes.ListItem} divider>
                        <Box className={classes.ListItemFormControls}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                id={`checkbox-${_id}`}
                                name={title}
                                value={title}
                                checked={checkedState[i]?.checked ?? false}
                                onChange={() => handleOnChange(i)}
                                icon={<CheckCircleOutlinedIcon />}
                                checkedIcon={<CheckCircleIcon />}
                                disabled={isDisabled(title)}
                                className={classes.ListCheckbox}
                                sx={{
                                  color: (theme) => theme.palette.success.light,
                                  '&.Mui-checked': {
                                    color: (theme) =>
                                      theme.palette.success.main,
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography variant="h4" component="h2">
                                {title}
                              </Typography>
                              // <Typography variant="h3">{title}</Typography>
                            }
                          />
                          <Box className={classes.ListItemWords}>
                            {words.map((word) => word.word).join(', ')}
                          </Box>
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  ))}
              </List>
              <Button
                variant="contained"
                color="primary"
                className={classes.createBtn}
                onClick={handleCreateNavigation}
                disabled={checkedLists.length === 0 || !!isFetching}
              >
                Create
              </Button>
            </Paper>
          </Grid>
        </GridRoot>
      )}
    </>
  );
}
