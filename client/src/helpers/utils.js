export function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getCookie(name = 'XSRF-TOKEN') {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const arraysEqualByProp = (a, b, prop) =>
  a?.length === b?.length && a.every((item, i) => item[prop] === b[i][prop]);

export const sentenceCase = (str) => str[0].toUpperCase() + str.slice(1);
