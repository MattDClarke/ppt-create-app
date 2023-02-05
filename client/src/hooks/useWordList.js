import { useMutation } from 'react-query';
import axios from 'axios';
import { getCookie } from '../helpers/utils';
import { backendEndpoint } from '../config';

export default function useWordList() {
  return useMutation((wordList) =>
    axios({
      method: 'POST',
      data: {
        title: wordList.title,
        words: wordList.words,
        order: wordList.order,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/user/wordlists/change`,
    })
  );
}
