import { useQuery } from 'react-query';
import axios from 'axios';
import { backendEndpoint } from '../config';

export const getUsers = async (page = 1) => {
  const { data } = await axios({
    method: 'GET',
    withCredentials: true,
    url: `${backendEndpoint}/getusers/page/${page}`,
  });
  return data;
};

export default function useUsersGet(page) {
  return useQuery(['users', page], () => getUsers(page), {
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}
