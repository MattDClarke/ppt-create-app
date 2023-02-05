import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';

const PREFIX = 'WordListsDialogListItem';
export const classes = {
  root: `${PREFIX}-root`,
  ListItemFormControls: `${PREFIX}-ListItemFormControls`,
  DragIndicatorIcon: `${PREFIX}-DragIndicatorIcon`,
  ListItemWords: `${PREFIX}-ListItemWords`,
  spacer: `${PREFIX}-spacer`,
};
export const ListItemRoot = styled(ListItem)(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    transition: 'background-color 0.3s ease',
    paddingLeft: 0,
    paddingRight: 0,
  },
  [`& .${classes.ListItemFormControls}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  [`& .${classes.DragIndicatorIcon}`]: {
    color: theme.palette.grey[500],
  },
  [`& .${classes.ListItemWords}`]: {
    width: '100%',
  },
  [`& .${classes.spacer}`]: {
    flex: 1,
  },
}));
