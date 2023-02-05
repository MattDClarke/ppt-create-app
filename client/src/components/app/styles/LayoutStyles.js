import { styled } from '@mui/material/styles';

const PREFIX = 'Layout';
export const classes = {
  root: `${PREFIX}-root`,
};
export const Root = styled('div')(() => ({
  [`&.${classes.root}`]: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    minHeight: '100vh',
    fontSize: '16px',
    textAlign: 'center',
  },
}));
