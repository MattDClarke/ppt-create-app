import React from 'react';
import PropTypes from 'prop-types';
import { classes, Root } from './styles/LoaderStyles';

function Loader({ fullScreen = false }) {
  return (
    <Root
      className={classes.root}
      style={{
        margin: fullScreen ? 'calc(50vh - 50px) auto' : '40px auto',
        width: fullScreen ? '100px' : '50px',
        height: fullScreen ? '100px' : '50px',
        borderWidth: fullScreen ? '16px' : '8px',
      }}
    />
  );
}

Loader.propTypes = {
  fullScreen: PropTypes.bool,
};

export default Loader;
