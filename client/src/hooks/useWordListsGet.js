import { useQuery } from 'react-query';
import axios from 'axios';
import { backendEndpoint } from '../config';

export const getWordLists = async () => {
  const data = await axios({
    method: 'GET',
    withCredentials: true,
    url: `${backendEndpoint}/user/wordlists/get`,
  });
  return data;
};

export default function useWordListsGet() {
  return useQuery(['wordLists'], () => getWordLists(), {
    staleTime: 1000 * 60 * 20,
  });
}
