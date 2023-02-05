import { useMutation } from 'react-query';
import axios from 'axios';
import { getCookie } from '../helpers/utils';
import { backendEndpoint } from '../config';

export default function useUsersDelete() {
  return useMutation((ids) =>
    axios({
      method: 'DELETE',
      data: {
        ids,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/deleteusers`,
    })
  );
}
