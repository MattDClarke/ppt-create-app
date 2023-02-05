import { useMutation } from 'react-query';
import axios from 'axios';
import { getCookie } from '../helpers/utils';
import { backendEndpoint } from '../config';

export default function useWordListsDeleteAll() {
  return useMutation(() =>
    axios({
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/user/wordlists/delete-all`,
    })
  );
}
