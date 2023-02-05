import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import { useTitle } from '../../hooks/useTitle';
import DeleteConfirmDialog from '../reuseable/DeleteConfirmDialog';
import { userContext } from '../../contexts/user.context';
import Loader from '../reuseable/Loader';
import MsgSnackbar from '../reuseable/MsgSnackbar';

export default function Account() {
  useTitle('ppt Create | Account');
  const user = useContext(userContext);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState(null);
  const [countMsgs, setCountMsgs] = useState(0);

  const handleClickOpenDeleteForm = () => {
    setOpenDeleteForm(true);
  };

  const handleCloseDeleteForm = () => {
    setOpenDeleteForm(false);
  };

  return (
    <div>
      {/* popup error messages */}
      <MsgSnackbar
        msgType="error"
        msgs={errorMsgs}
        autoHideDuration={10000}
        countMsgs={countMsgs}
      />
      <Typography variant="h1">Account</Typography>
      {user !== undefined ? (
        <Grid
          container
          justifyContent="center"
          sx={{ marginTop: (theme) => theme.spacing(2) }}
        >
          <Grid item xs={11} md={8} lg={6}>
            <Paper>
              <List>
                <ListItem>
                  <Box
                    sx={{
                      fontWeight: 'bold',
                      marginRight: 1,
                    }}
                  >
                    Name:
                  </Box>
                  {user.name}
                </ListItem>
                {user.auth === 'local' && (
                  <ListItem>
                    <Box
                      sx={{
                        fontWeight: 'bold',
                        marginRight: 1,
                      }}
                    >
                      Email:
                    </Box>
                    {user.email}
                  </ListItem>
                )}
                <Divider />
              </List>

              {user.auth === 'local' && (
                <List>
                  <ListItem>
                    <Link component={RouterLink} to="/account/name">
                      Change name
                    </Link>
                  </ListItem>
                  <Divider />

                  <ListItem>
                    <Link component={RouterLink} to="/account/email">
                      Change email
                    </Link>
                  </ListItem>
                  <Divider />

                  <ListItem>
                    <Link component={RouterLink} to="/account/password">
                      Change password
                    </Link>
                  </ListItem>
                  <Divider />
                </List>
              )}

              <Button
                variant="contained"
                color="error"
                sx={{
                  margin: (theme) => theme.spacing(4, 0),
                  color: (theme) => theme.palette.background.paper,
                }}
                startIcon={<DeleteIcon />}
                onClick={handleClickOpenDeleteForm}
              >
                Delete Account
              </Button>

              <DeleteConfirmDialog
                open={openDeleteForm}
                onClose={handleCloseDeleteForm}
                route="account"
                setErrorMsgs={setErrorMsgs}
                setCountMsgs={setCountMsgs}
                countMsgs={countMsgs}
              />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Loader />
      )}
    </div>
  );
}
