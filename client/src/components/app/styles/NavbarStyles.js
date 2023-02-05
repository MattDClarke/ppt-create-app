import { styled } from '@mui/material/styles';
import { AppBar } from '@mui/material';
import ListItem from '@mui/material/ListItem';

const PREFIX = 'Navbar';
export const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  logOutBtn: `${PREFIX}-logOutBtn`,
  colorModeToggleSwitch: `${PREFIX}-colorModeToggleSwitch`,
  closeBtn: `${PREFIX}-closeBtn`,
  spacer: `${PREFIX}-spacer`,
};
export const AppBarRoot = styled(AppBar)(({ theme }) => ({
  [`&.${classes.root}`]: {
    position: 'static',
    backgroundColor: theme.palette.action.selected,
    paddingBottom: theme.spacing(2),
    boxShadow: 'none',
    clipPath: 'polygon(0 0, 100% 0, 100% 78%, 0 100%)',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23ba68c8' fill-opacity='0.05'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    '& div': {
      width: '100%',
      maxWidth: '1500px',
      margin: '0 auto',
    },
  },
  [`& .${classes.logo}`]: {
    position: 'relative',
    marginRight: theme.spacing(2.5),
    color: theme.palette.primary.dark,
    fontWeight: theme.typography.fontWeightBold,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  [`& .${classes.logOutBtn}`]: {
    padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
  },
  [`& .${classes.colorModeToggleSwitch}`]: {
    marginLeft: 'auto',
  },
  [`& .${classes.spacer}`]: {
    flex: '1',
  },
  [`& .${classes.closeBtn}`]: {
    width: '2.5rem',
    padding: '0.5rem 0',
    borderRadius: '50%',
  },
}));

export const ListItemRoot = styled(ListItem)(({ theme }) => ({
  width: theme.spacing(12),
  position: 'relative',
  justifyContent: 'center',
  '& .selected': {
    position: 'absolute',
    transition: 'border ease 0.25s',

    '&::after': {
      content: "''",
      display: 'block',
      height: '2.5px',

      // background: theme.palette.text.primary,
      position: 'absolute',
      left: '0',
      right: '0',
      borderRadius: '10px',
      transform: 'scale(1,1)',
      transition: 'transform ease 0.25s',
    },
  },
  '& a': {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    position: 'absolute',
    padding: `0 ${theme.spacing(1)}`,
    '&::after': {
      content: "''",
      display: 'block',
      height: '2.5px',
      background: theme.palette.text.primary,
      position: 'absolute',
      left: '0',
      right: '0',
      borderRadius: '10px',
      transform: 'scale(0)',
      transition: 'transform ease 0.25s',
    },
    '&:hover::after': {
      transform: 'scale(1,1)',
    },
    '&:focus::after': {
      transform: 'scale(1,1)',
    },
  },
}));
