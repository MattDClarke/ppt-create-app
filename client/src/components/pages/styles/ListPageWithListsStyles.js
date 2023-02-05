import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

const PREFIX = 'ListPageWithLists';
export const classes = {
  root: `${PREFIX}-root`,
  ListItem: `${PREFIX}-ListItem`,
  ListItemFormControls: `${PREFIX}-ListItemFormControls`,
  ListItemWords: `${PREFIX}-ListItemWords`,
  createBtn: `${PREFIX}-createBtn`,
};
export const GridRoot = styled(Grid)(({ theme }) => ({
  [`&.${classes.root}`]: {
    marginTop: theme.spacing(2),
  },
  [`& .${classes.ListItem}`]: {
    width: '100%',
    backgroundColor: theme.palette.background.def,
    padding: theme.spacing(1.5),
  },
  [`& .${classes.ListItemFormControls}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    '& .Mui-disabled:hover': {
      cursor: 'not-allowed',
    },
  },

  [`& .${classes.ListItemWords}`]: {
    width: '100%',
  },
  [`& .${classes.createBtn}`]: {
    margin: theme.spacing(4),
  },
}));
