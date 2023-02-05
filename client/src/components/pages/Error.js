import React from 'react';
import Typography from '@mui/material/Typography';
import { useTitle } from '../../hooks/useTitle';

function Error() {
  useTitle('ppt Create | Page Not Found');
  return (
    <div>
      <Typography variant="h1">Oops! Page not found.</Typography>
    </div>
  );
}

export default Error;
