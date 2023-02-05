// import React from 'react';
// import PropTypes from 'prop-types';
// import Fade from '@mui/material/Fade';
// import { TransitionGroup } from 'react-transition-group';

// function FadeInAnimate({ children }) {
//   return (
//     <TransitionGroup>
//       <Fade timeout={600}>
//         {/* must be only 1 component child */}
//         <div>{children}</div>
//       </Fade>
//     </TransitionGroup>
//   );
// }

// export default FadeInAnimate;

// FadeInAnimate.propTypes = {
//   children: PropTypes.node.isRequired,
// };

import React from 'react';
import PropTypes from 'prop-types';
import Fade from '@mui/material/Fade';
import { TransitionGroup } from 'react-transition-group';
import { PageRoot } from './styles/PageStyles';

function PageWithFadeIn({ children }) {
  return (
    <TransitionGroup>
      <Fade timeout={500} easing={{ enter: 'ease-in-out' }}>
        {/* must be only 1 component child */}
        <PageRoot>{children}</PageRoot>
      </Fade>
    </TransitionGroup>
  );
}

export default PageWithFadeIn;

PageWithFadeIn.propTypes = {
  children: PropTypes.node.isRequired,
};
