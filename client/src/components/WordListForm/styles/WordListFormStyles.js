import { styled } from '@mui/material/styles';

const PREFIX = 'WordListForm';
export const classes = {
  root: `${PREFIX}-root`,
  formPaper: `${PREFIX}-formPaper`,
  addWordFormGroup: `${PREFIX}-addWordFormGroup`,
  addBtn: `${PREFIX}-addBtn`,
  addBtnCaption: `${PREFIX}-addBtnCaption`,
  submitBtn: `${PREFIX}-submitBtn`,
};
export const FormRoot = styled('form')(({ theme }) => ({
  // [`&.${classes.root}`]: {
  // },
  [`& .${classes.formPaper}`]: {
    margin: `${theme.spacing(2)} 0`,
    padding: `0 ${theme.spacing(2)}`,
  },
  [`& .${classes.addWordFormGroup}`]: {
    display: 'flex',
    alignItems: 'stretch',
    padding: `0 ${theme.spacing(2)}`,
    '& div': {
      flex: '1',
    },
  },
  [`& .${classes.addBtn}`]: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  [`& .${classes.addBtnCaption}`]: {
    display: 'block',
    marginLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'left',
  },
  [`& .${classes.submitBtn}`]: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));
