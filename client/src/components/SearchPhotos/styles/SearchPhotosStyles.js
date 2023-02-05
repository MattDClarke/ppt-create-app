import { styled } from '@mui/material/styles';

const PREFIX = 'SearchPhotos';
export const classes = {
  root: `${PREFIX}-root`,
  card: `${PREFIX}-card`,
  cardImageContainer: `${PREFIX}-cardImageContainer`,
  imageCaption: `${PREFIX}-imageCaption`,
  selected: `${PREFIX}-selected`,
};
export const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  [`& .${classes.card}`]: {
    display: 'flex',
    animation: 'expand .3s ease-in',
  },
  [`& .${classes.cardImageContainer}`]: {
    display: 'grid',
    gridTemplateRows: '1fr 40px',
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.imageCaption}`]: {
    margin: '0 auto',
    padding: `${theme.spacing(0.5)} ${theme.spacing(0.5)}`,
    borderRadius: '0 0 5px 5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.7rem',
    backgroundColor: theme.palette.divider,
    '& a': {
      whiteSpace: 'nowrap',
    },
  },
  [`& .${classes.selected}`]: {
    opacity: '0.5',
    borderRadius: '5px 5px 0 0',
  },

  '@keyframes expand': {
    from: {
      transform: 'scale(0.8)',
      opacity: 0.8,
    },
  },
}));

export const CardImage = styled('img')(({ theme }) => ({
  objectFit: 'contain',
  height: 'auto',
  margin: `auto ${theme.spacing(0.5)} 0 ${theme.spacing(0.5)}`,
  '&:hover': {
    cursor: 'pointer',
  },
}));
