import { styled } from '@mui/material/styles';

export const PageRoot = styled('main')(({ theme }) => ({
  padding: `${theme.spacing(4)} ${theme.spacing(1.5)}`,
  maxWidth: '1500px',
  margin: '0 auto',
}));
