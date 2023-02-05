import { useMutation } from 'react-query';
import axios from 'axios';
import { getCookie } from '../helpers/utils';
import { backendEndpoint } from '../config';

export default function useWordListDelete() {
  return useMutation((titleObj) =>
    axios({
      method: 'DELETE',
      data: {
        title: titleObj.title,
        order: titleObj.order,
        numberOfWordLists: titleObj.numberOfWordLists,
      },
      headers: {
        'Content-type': 'application/json',
        'XSRF-TOKEN': getCookie(),
      },
      withCredentials: true,
      url: `${backendEndpoint}/user/wordlists/delete`,
    })
  );
}
