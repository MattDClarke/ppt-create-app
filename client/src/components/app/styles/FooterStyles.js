import { styled } from '@mui/material/styles';

const PREFIX = 'Footer';
export const classes = {
  root: `${PREFIX}-root`,
  link: `${PREFIX}-link`,
};
export const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    transition: '5s',
    backgroundSize: '200% auto',
    backgroundImage: `
                    ${
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(to bottom left, #ba68c8 0%, #9c27b0 20%, #0288d1 100%)'
                        : 'linear-gradient(to bottom left, #9c27b0 0%, #ba68c8 20%, #42a5f5 100%)'
                    }
                    `,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    marginTop: `${theme.spacing(10)}`,
    paddingTop: '90px',
    paddingBottom: '40px',
    clipPath: 'polygon(0px 100px, 100% 0px, 100% 100%, 0% 100%)',
    '&:hover': {
      backgroundPosition: 'right center',
    },
  },
  [`& .${classes.link}`]: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
}));
