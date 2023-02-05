import { styled } from '@mui/material/styles';

const PREFIX = 'Loader';
export const classes = {
  root: `${PREFIX}-root`,
};

export const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    border: `16px solid ${theme.palette.info.dark}`,
    borderRightColor: theme.palette.secondary.dark,
    borderBottomColor: theme.palette.error.dark,
    borderLeftColor: theme.palette.warning.dark,
    borderRadius: '10%',
    animation: 'coloredspin 4s linear infinite',
    '@keyframes coloredspin': {
      '0%': {
        transform: 'rotate(0)',
      },
      '25%': {
        transform: 'rotate(50deg)',
        borderTopColor: theme.palette.info.main,
        borderRightColor: theme.palette.secondary.main,
        borderBottomColor: theme.palette.error.main,
        borderLeftColor: theme.palette.warning.main,
      },
      '50%': {
        transform: 'rotate(220deg)',
        borderTopColor: theme.palette.info.light,
        borderRightColor: theme.palette.secondary.light,
        borderBottomColor: theme.palette.error.light,
        borderLeftColor: theme.palette.warning.light,
      },
      '75%': {
        transform: 'rotate(300deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  },
}));
