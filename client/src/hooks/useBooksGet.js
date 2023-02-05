import { useQuery } from 'react-query';
import axios from 'axios';
import { backendEndpoint } from '../config';

export const getBooks = async (levelAndGrade) => {
  const { data } = await axios({
    method: 'GET',
    withCredentials: true,
    url: `${backendEndpoint}/getbooks/${levelAndGrade}`,
  });
  return data;
};

export default function useBooksGet(levelAndGrade) {
  return useQuery(['books', levelAndGrade], () => getBooks(levelAndGrade), {
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });
}
