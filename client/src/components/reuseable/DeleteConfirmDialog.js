import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import useWordListsDeleteAll from '../../hooks/useWordListsDeleteAll';
import { getCookie } from '../../helpers/utils';
import { backendEndpoint } from '../../config';

export default function DeleteConfirmDialog(props) {
  const {
    onClose,
    open,
    route,
    setErrorMsgs,
    setCountMsgs,
    setCheckboxTitles,
  } = props;
  const queryClient = useQueryClient();
  const deleteAllWordLists = useWordListsDeleteAll();

  const history = useHistory();

  function dialogMsg() {
    if (route === 'account') {
      return 'your account';
    }
    if (route === 'wordLists') {
      return 'all of your word lists';
    }
  }

  const msg = dialogMsg();

  const handleClose = () => {
    onClose();
  };

  const handleDeleteAccount = () => {
    axios({
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/account/delete`,
    })
      .then((res) => {
        history.push({
          pathname: '/',
          state: { detail: res.data },
        });
      })
      .catch((err) => {
        onClose();
        setErrorMsgs(err.response.data);
        setCountMsgs((prevCount) => prevCount + 1);
      });
  };

  async function handleDeleteAll() {
    try {
      await deleteAllWordLists.mutateAsync();
      queryClient.invalidateQueries('wordLists');
      setCheckboxTitles([]);
    } catch (error) {
      setErrorMsgs('Delete Failed');
      setCountMsgs((prevCount) => prevCount + 1);
    } finally {
      deleteAllWordLists.reset();
      // make sure Delete confirm dialog closes and reset Error msgs
      setErrorMsgs(null);
      onClose();
    }
  }

  const handleDelete = () => {
    if (route === 'account') {
      handleDeleteAccount();
    }
    if (route === 'wordLists') {
      handleDeleteAll();
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="delete-confirm-title"
      open={open}
    >
      <DialogTitle id="delete-confirm-title">
        Are you sure that you want to delete {msg}?
      </DialogTitle>
      <Divider />
      <DialogActions
        sx={{
          justifyContent: 'center',
          padding: (theme) => theme.spacing(2.5, 0),
        }}
      >
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Yes
        </Button>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteConfirmDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  route: PropTypes.string.isRequired,
  setErrorMsgs: PropTypes.func.isRequired,
  setCountMsgs: PropTypes.func.isRequired,
  setCheckboxTitles: PropTypes.func,
};
