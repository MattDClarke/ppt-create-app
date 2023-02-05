import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import WordListForm from '../WordListForm/WordListForm';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import { useMountedState } from '../../hooks/useMountedState';
import { useTitle } from '../../hooks/useTitle';
import { wait } from '../../helpers/utils';

function Create() {
  useTitle('ppt Create | Create');
  const [successMsgs, setSuccessMsgs] = useState(null);
  const location = useLocation();
  const isMounted = useMountedState();

  useEffect(() => {
    async function showMsg() {
      await wait(1000);
      // only change state if wait completes. E.g. in case user, after account update
      // and redirect to this page, navigates to another page right away
      if (isMounted()) {
        setSuccessMsgs(location.state?.detail);
        window.history.replaceState({}, '');
      }
    }
    showMsg();
  }, [location, isMounted]);

  return (
    <div>
      <MsgSnackbar
        msgType="success"
        msgs={successMsgs}
        autoHideDuration={null}
      />

      <Typography variant="h1">Create</Typography>
      <Typography variant="subtitle1" component="p">
        Add your list of words
      </Typography>
      <Paper
        style={{
          padding: 0,
          margin: 0,
        }}
        elevation={0}
      >
        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item xs={11} md={8} lg={6}>
            <WordListForm />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Create;
