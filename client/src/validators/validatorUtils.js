import { levelAndGradeOptions, listItems } from '../helpers/listsValues';
// Password should be at least 8 characters long and contain at least 1 lowercase word, 1 uppercase word, 1 number and 1 symbol.
export function isStrongPassword(password) {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*()_+=\-{}[\]'":;<>./\\|]).{8,}$/.test(
    password
  );
}

export function isValidLevelAndGrade(string) {
  return levelAndGradeOptions.map((option) => option.value).includes(string);
}

export function isValidList(string) {
  return listItems.map((option) => option.value).includes(string);
}
