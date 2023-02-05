import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { classes, Root } from './styles/FooterStyles';

function Footer() {
  return (
    <Root className={classes.root}>
      <Box sx={{ pb: 2 }}>
        <Link component={RouterLink} to="/privacy-policy" className={classes.link}>
          Privacy Policy
        </Link>
      </Box>
      <span>
        ©{' '}
        <Link href="https://www.mattdclarke.tech/" target="_blank" rel="noopener" className={classes.link}>
          Matthew Clarke
        </Link>
        {' '}
        2021
      </span>
    </Root>
  );
}

export default Footer;
