import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';

const PREFIX = 'LayoutTypesDialogListItem';
export const classes = {
  root: `${PREFIX}-root`,
  ListItemFormControls: `${PREFIX}-ListItemFormControls`,
  DragIndicatorIcon: `${PREFIX}-DragIndicatorIcon`,
  ListItemLabel: `${PREFIX}-ListItemLabel`,
};
export const ListItemRoot = styled(ListItem)(({ theme }) => ({
  [`&.${classes.root}`]: {
    transition: 'background-color 0.3s ease',
    padding: `${theme.spacing(1.5)} 0`,
  },
  [`& .${classes.ListItemFormControls}`]: {
    display: 'flex',
    alignContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  [`& .${classes.DragIndicatorIcon}`]: {
    color: theme.palette.grey[500],
  },
  [`& .${classes.ListItemLabel}`]: {
    marginTop: 'auto',
    marginRight: '0',
    marginBottom: 'auto',
  },
}));

export const ListItemImg = styled('img')(() => ({
  width: 'auto',
}));
