import React, { useState, useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MsgSnackbar from '../reuseable/MsgSnackbar';
import { useMountedState } from '../../hooks/useMountedState';
import { useTitle } from '../../hooks/useTitle';
import { wait } from '../../helpers/utils';
import GoogleIcon from '../icons/GoogleIcon';
import { backendEndpoint } from '../../config';
import coverImageLight from '../../assets/images/undraw_content_team_3epn_light.svg';
import coverImageDark from '../../assets/images/undraw_content_team_3epn_dark.svg';
import { classes, Root, ImgRoot } from './styles/HomeStyles';

const googleLogin = () => {
  window.open(`${backendEndpoint}/auth/google`, '_self');
};

export default function Home() {
  useTitle('ppt Create | Home');
  const [successMsgs, setSuccessMsgs] = useState(null);
  const location = useLocation();
  const isMounted = useMountedState();
  const currTheme = useTheme();

  useEffect(() => {
    async function showMsg() {
      await wait(1000);
      if (isMounted()) {
        setSuccessMsgs(location.state?.detail);
      }
    }
    showMsg();
  }, [location, isMounted]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        padding: { xs: 2, md: 10 },
      }}
    >
      <MsgSnackbar
        msgType="success"
        msgs={successMsgs}
        autoHideDuration={null}
      />
      <Root
        className={classes.root}
        sx={{
          flexDirection: {
            xs: 'column',
            smSmMd: 'row',
          },
          marginTop: {
            xs: 4,
            md: 0,
          },
        }}
      >
        <div className={classes.infoContainer}>
          <Typography
            variant="h4"
            component="h1"
            className={classes.heading}
            gutterBottom
            sx={{
              fontSize: {
                xs: 20,
                sm: 25,
                smMd: 28,
                md: 34,
              },
            }}
          >
            Add Images and text to presentation slides with{' '}
            <span className={classes.wordUnderline}>ease</span>
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            className={classes.subHeading}
            gutterBottom
            sx={{
              fontSize: {
                xs: 15,
                sm: 19,
                smMd: 21,
                md: 24,
              },
            }}
          >
            Sign up or log in to start creating
          </Typography>

          <Button
            variant="contained"
            color="primary"
            className={classes.btn}
            component={RouterLink}
            to="/signup"
            sx={{
              fontSize: {
                md: 20,
              },
            }}
          >
            Sign Up
          </Button>
          <Button
            className={classes.btn}
            variant="outlined"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={googleLogin}
            sx={{
              fontSize: {
                md: 20,
              },
            }}
          >
            Google Sign In
          </Button>
        </div>
        <ImgRoot
          src={
            currTheme.palette.mode === 'dark' ? coverImageDark : coverImageLight
          }
          alt="Illustration of cartoon characters building a layout on a laptop"
          sx={{
            width: {
              xs: 250,
              xsSm: 350,
              sm: 400,
              smSmMd: 300,
              md: 350,
              lg: 450,
            },
            marginTop: {
              xs: 4,
              smSmMd: 0,
            },
          }}
        />
      </Root>
    </Box>
  );
}
