import { styled } from '@mui/material/styles';

const PREFIX = 'BookImageUploader';
export const classes = {
  root: `${PREFIX}-root`,
  imageContainer: `${PREFIX}-imageContainer`,
};

export const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(2),
  },
  [`& .${classes.imageContainer}`]: {
    position: 'relative',
    width: '200px',
    margin: '0 auto',
  },
}));

export const ImgRoot = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(4),
  width: '200px',
  height: 'auto',
}));
