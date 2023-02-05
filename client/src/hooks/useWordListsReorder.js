import { useMutation } from 'react-query';
import axios from 'axios';
import { getCookie } from '../helpers/utils';
import { backendEndpoint } from '../config';

export default function useWordListsReorder() {
  return useMutation((wordListsTitles) =>
    axios({
      method: 'PUT',
      data: {
        wordListsTitles,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/user/wordlists/reorder`,
    })
  );
}
