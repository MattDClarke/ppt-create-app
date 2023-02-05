import { useQuery } from 'react-query';
import axios from 'axios';
import { backendEndpoint } from '../config';

export const getLists = async (pageKey) => {
  const { data } = await axios({
    method: 'GET',
    withCredentials: true,
    url: `${backendEndpoint}/getlists/${pageKey}`,
  });
  // return sorted data
  return data;
};

export default function useListsGet(pageKey) {
  return useQuery(['lists', pageKey], () => getLists(pageKey), {
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}
