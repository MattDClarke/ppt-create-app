import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { useQueryClient } from 'react-query';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import Loader from '../reuseable/Loader';
import useUsersDelete from '../../hooks/useUsersDelete';
import useUsersGet, { getUsers } from '../../hooks/useUsersGet';
import { useTitle } from '../../hooks/useTitle';

function Admin() {
  useTitle('ppt Create | Admin');
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [goToPage, setGoToPage] = useState(1);
  const [checkedState, setCheckedState] = useState([]);
  const { status, data, error, isPreviousData, isFetching } = useUsersGet(page);
  const deleteUsers = useUsersDelete();
  const { url } = useRouteMatch();

  const checkedUsers = checkedState
    .filter((user) => user.checked === true)
    .map((usr) => usr.id);

  // Prefetch the next page
  useEffect(() => {
    if (data?.hasMore) {
      // if go to last page with last page button or go to page input
      if (page >= data.pages) return;
      // only prefetch if next page is not in cache already
      const nextPageData = queryClient.getQueryData(['users', page + 1]);
      if (nextPageData === undefined) {
        queryClient.prefetchQuery(['users', page + 1], () =>
          getUsers(page + 1)
        );
      }
    }
  }, [data, page, queryClient]);

  // set state of checkboxes once data in
  useEffect(() => {
    if (data?.users) {
      if (goToPage > data.pages) return;
      const userCheckedState = data?.users.map((usr) => ({
        id: usr._id,
        checked: false,
      }));
      setCheckedState(userCheckedState);
    }
  }, [data?.users, data?.pages, goToPage]);

  const onDelete = () => {
    deleteUsers.mutate(checkedUsers, {
      onSuccess: () => {
        const pageNum = parseInt(data.page);
        // loops thro each query - only trigger refetch of query (page) in cache (marks as stale)
        // if current page or later. No need to refetch previous pages - they wouldnt have changed
        // fine as inactive
        queryClient.invalidateQueries('users', {
          predicate: (query) => query.queryKey[1] >= pageNum,
        });
        // if on last page, move to previous page, in case all users deleted on last page
        if (data.pages === page) {
          setPage((old) => Math.max(old - 1, 1));
        }
      },
      onError: (error) => {
        console.log('Delete failed');
      },
      onSettled: async () => {
        // clear error and data of mutation request
        deleteUsers.reset();
      },
    });
  };

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === position ? { ...item, checked: !item.checked } : item
    );
    setCheckedState(updatedCheckedState);
  };

  const handleGoToPageState = (e) => {
    // make sure page number is int. if string then: 1) go page 5. 2) click next -> goes to page 51.
    // Because "5" + 1 = 51.
    setGoToPage(
      parseInt(
        // eslint-disable-next-line
        e.target.value < 1
          ? 1
          : e.target.value <= data.pages
          ? e.target.value
          : data.pages
      )
    );
  };

  function checkOrUncheckAll(bool) {
    const updatedCheckedState = checkedState.map((item) => ({
      ...item,
      checked: bool,
    }));
    setCheckedState(updatedCheckedState);
  }

  const handleGoToPage = () => {
    setPage(goToPage);
  };

  return (
    <>
      <Typography variant="h1">Admin</Typography>
      <Typography variant="h2">Lists</Typography>
      <Grid
        container
        justifyContent="center"
        sx={{ marginTop: (theme) => theme.spacing(2) }}
      >
        <Grid item xs={11} md={8} lg={6}>
          <Paper>
            <List>
              <ListItem>
                <Link component={RouterLink} to={`${url}/add-book`}>
                  Add book
                </Link>
              </ListItem>
              <Divider />
              <ListItem>
                <Link
                  component={RouterLink}
                  to={`${url}/add-list-korea-textbook`}
                >
                  Add Korean text book list
                </Link>
              </ListItem>
              <Divider />
              <ListItem>
                <Link component={RouterLink} to={`${url}/add-list-other`}>
                  Add other list
                </Link>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="h2" pt={4} pb={2}>
        Delete Users
      </Typography>
      {/* eslint-disable-next-line  */}
      {status === 'loading' ? (
        <Loader fullScreen={false} />
      ) : status === 'error' ? (
        <span>Error: {error.response.data}</span>
      ) : (
        <Grid
          container
          justifyContent="center"
          sx={{ marginTop: (theme) => theme.spacing(2) }}
        >
          <Grid item xs={11} md={8} lg={6}>
            <Paper sx={{ pt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CheckBoxIcon />}
                onClick={() => checkOrUncheckAll(true)}
                disabled={deleteUsers.isLoading}
              >
                Check all
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CheckBoxOutlineBlankIcon />}
                onClick={() => checkOrUncheckAll(false)}
                disabled={deleteUsers.isLoading}
              >
                Uncheck all
              </Button>
              <List>
                {data.users.map(({ _id, name, email }, i) => (
                  <React.Fragment key={i}>
                    <ListItem
                      key={_id}
                      sx={{ padding: (theme) => theme.spacing(0.2, 2) }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={`checkbox-${_id}`}
                            name={_id}
                            value={_id}
                            checked={checkedState[i]?.checked ?? false}
                            onChange={() => handleOnChange(i)}
                            sx={{
                              color: (theme) => theme.palette.error.light,
                              '&.Mui-checked': {
                                color: (theme) => theme.palette.error.main,
                              },
                            }}
                          />
                        }
                        label={`${name} - ${
                          email !== null ? email : 'Google auth'
                        }`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              <Button
                variant="contained"
                color="error"
                sx={{ color: (theme) => theme.palette.background.paper }}
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                disabled={checkedUsers.length === 0 || deleteUsers.isLoading}
              >
                {/* eslint-disable  */}
                {deleteUsers.isLoading
                  ? 'Deleting...'
                  : deleteUsers.isError
                  ? 'Error!'
                  : deleteUsers.isSuccess
                  ? 'Deleted!'
                  : 'Delete Users'}
                {/* eslint-enable  */}
              </Button>
              <Box sx={{ margin: (theme) => theme.spacing(1, 0, 1) }}>
                {
                  // Since the last page's data potentially sticks around between page requests,
                  // we can use `isFetching` to show a background loading
                  // indicator since our `status === 'loading'` state won't be triggered
                  isFetching ? (
                    <LoaderThreeDots />
                  ) : (
                    <div style={{ height: isFetching ? '0' : '35.6px' }} />
                  )
                }
                page {page} of {data.pages}
              </Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setPage(1)}
                disabled={page <= 1 || deleteUsers.isLoading}
              >
                First Page
              </Button>{' '}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page <= 1 || deleteUsers.isLoading}
              >
                Previous Page
              </Button>{' '}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setPage((old) => (data?.hasMore ? old + 1 : old));
                }}
                disabled={
                  isPreviousData || !data?.hasMore || deleteUsers.isLoading
                }
              >
                Next Page
              </Button>{' '}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setPage(data.pages)}
                disabled={page >= data.pages || deleteUsers.isLoading}
              >
                Last Page
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: (theme) => theme.spacing(2, 0),
                  '& input': {
                    width: (theme) => theme.spacing(10),
                    padding: (theme) => theme.spacing(1, 1),
                  },
                }}
              >
                <TextField
                  id="standard-number"
                  type="number"
                  value={goToPage}
                  onChange={handleGoToPageState}
                  min="1"
                  max={data.pages}
                  step="1"
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleGoToPage}
                  disabled={deleteUsers.isLoading}
                >
                  Go to page
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Admin;
