import { styled } from '@mui/material/styles';

const PREFIX = 'Form';
export const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  submitBtn: `${PREFIX}-submitBtn`,
  addBtn: `${PREFIX}-addBtn`,
  socialSignInBtn: `${PREFIX}-socialSignInBtn`,
  select: `${PREFIX}-select`,
  BookImageUploaderHelperText: `${PREFIX}-BookImageUploaderHelperText`,
  addWordFormGroup: `${PREFIX}-addWordFormGroup`,
};
export const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  [`& .${classes.submitBtn}`]: {
    margin: theme.spacing(3, 0, 2),
  },
  [`& .${classes.addBtn}`]: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(1.5),
  },
  [`& .${classes.socialSignInBtn}`]: {
    margin: theme.spacing(4, 0, 2, 0),
  },
  [`& .${classes.select}`]: {
    textAlign: 'left',
  },
  [`& .${classes.BookImageUploaderHelperText}`]: {
    textAlign: 'center',
  },
  [`& .${classes.addWordFormGroup}`]: {
    display: 'flex',
    alignItems: 'stretch',
    marginTop: theme.spacing(2),
    '& div': {
      flex: '1',
    },
  },
}));

export const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));
