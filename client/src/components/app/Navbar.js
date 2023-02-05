import React, { useContext, useState, useEffect } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import axios from 'axios';
import { useIsFetching } from 'react-query';
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import { Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { classes, AppBarRoot, ListItemRoot } from './styles/NavbarStyles';
import { userContext } from '../../contexts/user.context';
import { ColorModeContext } from '../../contexts/colorMode.context';
import { getCookie } from '../../helpers/utils';
import { backendEndpoint } from '../../config';
import { MaterialUISwitch } from './MaterialUISwitch';
import LOGO from '../../assets/images/logo.svg';

function Navbar() {
  const user = useContext(userContext);
  const currTheme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isFetching = useIsFetching();
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  // eslint-disable-next-line
  const navBarData = user.isAdmin
    ? [
        {
          label: 'Create',
          href: '/create',
          borderColorLight: '#1565c0',
          borderColorDark: '#42a5f5',
        },
        {
          label: 'Lists',
          href: '/lists',
          borderColorLight: '#c62828',
          borderColorDark: '#ef5350',
        },
        {
          label: 'Guide',
          href: '/guide',
          borderColorLight: '#7b1fa2',
          borderColorDark: '#ba68c8',
        },
        {
          label: 'Admin',
          href: '/admin',
          borderColorLight: '#e65100',
          borderColorDark: '#ff9800',
        },
        {
          label: 'Account',
          href: '/account',
          borderColorLight: '#01579b',
          borderColorDark: '#03a9f4',
        },
        {
          label: 'Contact',
          href: '/contact',
          borderColorLight: '#1b5e20',
          borderColorDark: '#4caf50',
        },
        {
          label: 'colorModeToggle',
        },
        {
          label: 'Log Out',
          href: '/logout',
        },
      ]
    : user.isEmailConfirmed || user.auth === 'provider'
    ? [
        {
          label: 'Create',
          href: '/create',
          borderColorLight: '#1565c0',
          borderColorDark: '#42a5f5',
        },
        {
          label: 'Lists',
          href: '/lists',
          borderColorLight: '#c62828',
          borderColorDark: '#ef5350',
        },
        {
          label: 'Guide',
          href: '/guide',
          borderColorLight: '#7b1fa2',
          borderColorDark: '#ba68c8',
        },
        {
          label: 'Account',
          href: '/account',
          borderColorLight: '#01579b',
          borderColorDark: '#03a9f4',
        },
        {
          label: 'Contact',
          href: '/contact',
          borderColorLight: '#1b5e20',
          borderColorDark: '#4caf50',
        },
        {
          label: 'colorModeToggle',
        },
        {
          label: 'Log Out',
          href: '/logout',
        },
      ]
    : [
        {
          label: 'Home',
          href: '/',
          borderColorLight: '#1565c0',
          borderColorDark: '#42a5f5',
        },
        {
          label: 'Guide',
          href: '/guide',
          borderColorLight: '#7b1fa2',
          borderColorDark: '#ba68c8',
        },
        {
          label: 'Log In',
          href: '/login',
          borderColorLight: '#c62828',
          borderColorDark: '#ef5350',
        },
        {
          label: 'Sign Up',
          href: '/signup',
          borderColorLight: '#e65100',
          borderColorDark: '#ff9800',
        },
        {
          label: 'Contact',
          href: '/contact',
          borderColorLight: '#1b5e20',
          borderColorDark: '#4caf50',
        },
        {
          label: 'colorModeToggle',
        },
      ];

  async function logout() {
    const res = await axios({
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/logout`,
    }).catch(console.error);
    if (res.data === 'success') {
      window.location.href = '/';
    }
  }

  const handleLogout = () => {
    // eslint-disable-next-line
    handleDrawerClose();
    logout();
  };

  useEffect(() => {
    const setResponsiveness = () =>
      window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    setResponsiveness();
    window.addEventListener('resize', () => setResponsiveness());
  }, []);

  const handleDrawerOpen = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: true }));
  const handleDrawerClose = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: false }));

  const getDrawerChoices = () =>
    navBarData.map(({ label, href, borderColorLight, borderColorDark }) => {
      if (label === 'Log Out') {
        return (
          <Button
            className={classes.logOutBtn}
            sx={
              {
                // margin: '0 auto',
                // padding: (theme) => `${theme.spacing(1)} ${theme.spacing(3)}`,
              }
            }
            color="primary"
            key={label}
            onClick={handleLogout}
          >
            {label}
          </Button>
        );
      }
      if (label === 'colorModeToggle') {
        return (
          <MaterialUISwitch
            key={label}
            className={classes.colorModeToggleSwitch}
            sx={{
              my: {
                xs: 2,
                md: 0,
              },
            }}
            checked={currTheme.palette.mode === 'dark'}
            onChange={colorMode.toggleColorMode}
            inputProps={{ 'aria-label': 'dark mode - light mode toggle' }}
          />
        );
      }
      return (
        <ListItemRoot
          key={label}
          onClick={handleDrawerClose}
          sx={{ my: { xs: 1, md: 0 } }}
        >
          <Link
            to={href}
            exact
            component={RouterNavLink}
            activeClassName="selected"
            activeStyle={{
              borderBottom: `5px solid ${
                currTheme.palette.mode === 'dark'
                  ? borderColorDark
                  : borderColorLight
              }`,
            }}
          >
            {label}
          </Link>
        </ListItemRoot>
      );
    });

  const pptCreateLogo = (
    <Link to="/" className={classes.logo} component={RouterLink}>
      <Typography fontSize={{ xs: 20 }}>
        <img src={LOGO} alt="P (Logo)" />
        pt Create
      </Typography>
      <Box sx={{ position: 'absolute', top: 25 }}>
        <LinearProgress
          sx={{
            backgroundColor: 'rgba(0,0,0,0)',
            opacity: isFetching ? '0.5' : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </Box>
    </Link>
  );

  const displayMobileNav = () => (
    <Toolbar>
      {pptCreateLogo}
      <Box className={classes.spacer} />
      <IconButton
        // pass in props
        {...{
          edge: 'start',
          'aria-label': 'menu',
          'aria-haspopup': 'true',
          onClick: handleDrawerOpen,
        }}
        size="large"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        transitionDuration={300}
        {...{
          anchor: 'right',
          open: drawerOpen,
          onClose: handleDrawerClose,
        }}
      >
        <IconButton
          {...{
            edge: 'start',
            'aria-label': 'menu close',
            'aria-haspopup': 'true',
            onClick: handleDrawerClose,
          }}
          className={classes.closeBtn}
          size="large"
          sx={{
            margin: {
              xs: '0.9rem auto',
              sm: '0.7rem auto',
            },
          }}
        >
          <CloseIcon color="primary" />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            width: '50vw',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            textDecoration: 'none',
            margin: '0 auto',
          }}
        >
          {getDrawerChoices()}
        </Box>
      </Drawer>
    </Toolbar>
  );

  const getNavbarLinks = () =>
    navBarData.map(({ label, href, borderColorLight, borderColorDark }) => {
      if (label === 'Log Out') {
        return (
          <Button
            className={classes.logOutBtn}
            color="primary"
            key={label}
            onClick={handleLogout}
          >
            {label}
          </Button>
        );
      }
      if (label === 'colorModeToggle') {
        return (
          <MaterialUISwitch
            key={label}
            className={classes.colorModeToggleSwitch}
            checked={currTheme.palette.mode === 'dark'}
            onChange={colorMode.toggleColorMode}
            inputProps={{ 'aria-label': 'dark mode toggle' }}
          />
        );
      }
      return (
        <ListItemRoot key={label}>
          <Link
            to={href}
            exact
            component={RouterNavLink}
            activeClassName="selected"
            activeStyle={{
              borderBottom: `5px solid ${
                currTheme.palette.mode === 'dark'
                  ? borderColorDark
                  : borderColorLight
              }`,
            }}
          >
            {label}
          </Link>
        </ListItemRoot>
      );
    });

  const displayDesktopNav = () => (
    <Toolbar>
      {pptCreateLogo}
      {getNavbarLinks()}
    </Toolbar>
  );

  return (
    <nav>
      <AppBarRoot className={classes.root}>
        {mobileView ? displayMobileNav() : displayDesktopNav()}
      </AppBarRoot>
    </nav>
  );
}

export default Navbar;
