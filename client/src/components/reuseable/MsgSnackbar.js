import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

export default function MsgSnackbar({
  msgType,
  msgs,
  autoHideDuration,
  countMsgs,
  countSuccessMsgs,
}) {
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [transition, setTransition] = useState(undefined);

  function TransitionUp(props) {
    // eslint-disable-next-line
    return <Slide {...props} direction="up" />;
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMessage(false);
    setMessage('');
  };

  // only set and open message when msg changes
  useEffect(() => {
    if (msgs === null || msgs === undefined) return;
    setMessage(msgs, countMsgs);
    setTransition(() => TransitionUp);
    setOpenMessage(true);
    // also set and open if msg count changes - user tries to login twice and same msg returned
    // from server -> same msg shown twice.
  }, [msgs, countMsgs]);

  // only set and open message when success count or msg changes
  // for case where potentially multiple success msgs on same page sequentially - no redirects
  useEffect(() => {
    if (msgs === null || msgs === undefined) return;
    setMessage(msgs);
    setTransition(() => TransitionUp);
    setOpenMessage(true);
    // also set and open if msg count changes - user tries to login twice and same msg returned
    // from server -> same msg shown twice.
  }, [msgs, countSuccessMsgs]);

  return (
    <Snackbar
      open={openMessage}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      TransitionComponent={transition}
    >
      <Alert onClose={handleClose} severity={msgType}>
        {message}
      </Alert>
    </Snackbar>
  );
}

MsgSnackbar.propTypes = {
  msgType: PropTypes.string,
  msgs: PropTypes.string,
  autoHideDuration: PropTypes.number,
  countMsgs: PropTypes.number,
  countSuccessMsgs: PropTypes.number,
};
