import { styled } from '@mui/material/styles';

const PREFIX = 'ImageUploader';
export const classes = {
  root: `${PREFIX}-root`,
  imageContainer: `${PREFIX}-imageContainer`,
  imageCloseBtn: `${PREFIX}-imageCloseBtn`,
  selected: `${PREFIX}-selected`,
};
export const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    backgroundColor: theme.palette.background.def,
    paddingBottom: theme.spacing(4),
    textAlign: 'center',
  },
  [`& .${classes.imageContainer}`]: {
    position: 'relative',
    width: '200px',
    margin: `0 auto`,
  },
  [`& .${classes.imageCloseBtn}`]: {
    position: 'absolute',
    right: -theme.spacing(4),
  },
  [`& .${classes.selected}`]: {
    opacity: 0.5,
    borderRadius: '5px',
  },
}));

export const ImgRoot = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(4),
  width: '200px',
  height: 'auto',
  '&:hover': {
    cursor: 'pointer',
  },
}));
