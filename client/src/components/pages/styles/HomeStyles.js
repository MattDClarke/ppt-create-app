import { styled } from '@mui/material/styles';

const PREFIX = 'ListPageWithLists';
export const classes = {
  root: `${PREFIX}-root`,
  infoContainer: `${PREFIX}-infoContainer`,
  heading: `${PREFIX}-heading`,
  wordUnderline: `${PREFIX}-wordUnderline`,
  subHeading: `${PREFIX}-subHeading`,
  btn: `${PREFIX}-btn`,
};
export const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    textAlign: 'left',
  },
  [`& .${classes.infoContainer}`]: {
    flex: 1,
    paddingRight: theme.spacing(4),
  },
  [`& .${classes.heading}`]: {
    opacity: 0,
    transform: 'translateX(-5%)',
    animation: 'slideFromleft 1s ease-in forwards',
  },
  [`& .${classes.wordUnderline}`]: {
    display: 'inline-block',
    position: 'relative',
    '&::after': {
      content: "''",
      position: 'absolute',
      display: 'block',
      height: '.35em',
      width: '120%',
      marginLeft: '-60%',
      left: '50%',
      bottom: '-.35em',
      borderRadius: '50%',
      zIndex: '-1',
      background: theme.palette.background.paper,
      transform: 'translateY(-30%) translateX(-30%)',
      animation: 'slideFromleft 1s ease-in forwards',
    },
    '&::before': {
      content: "''",
      position: 'absolute',
      display: 'block',
      height: '.3em',
      width: '110%',
      marginLeft: '-55%',
      left: '50%',
      bottom: '-.22em',
      borderRadius: '50%',
      zIndex: '-2',
      background: `linear-gradient(to right, ${theme.palette.text.primary} 25%,${theme.palette.background.paper} 100%)`,
    },
  },
  [`& .${classes.subHeading}`]: {
    paddingBottom: theme.spacing(2),
    opacity: 0,
    transform: 'translateX(-3%)',
    animation: 'slideFromleft 0.8s ease-in forwards',
    animationDelay: '0.2s',
  },
  [`& .${classes.btn}`]: {
    opacity: 0,
    transform: 'translateX(-10%)',
    animation: 'slideFromleft 0.5s ease-in forwards',
    animationDelay: '0.5s',
  },
  '@keyframes slideFromleft': {
    to: {
      transform: 'translateX(0%)',
      opacity: 1,
    },
  },
  '@keyframes widthExpand': {
    to: {
      transform: 'scaleX(2)',
      opacity: 1,
    },
  },
}));

export const ImgRoot = styled('img')(() => ({
  height: 'auto',
}));
