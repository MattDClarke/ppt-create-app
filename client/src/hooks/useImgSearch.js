import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useFirstRun from './useFirstRun';
import { useMountedState } from './useMountedState';
import { backendEndpoint } from '../config';

export default function useImgSearch(query, pageNumber) {
  const isFirstRun = useFirstRun();
  const isMounted = useMountedState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reqErrorMsg, setReqErrorMsg] = useState('');
  const [pics, setPics] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const fetchPhotosCallback = useCallback(
    function fetchAPI(source) {
      axios({
        method: 'GET',
        cancelToken: source.token,
        params: {
          query,
          page: pageNumber,
        },
        // cross site access request, send cookie
        withCredentials: true,
        url: `${backendEndpoint}/api/search/photos`,
      })
        .then((res) => {
          // add pics to previous state -> accumulating pics
          setPics((prevPics) => [...prevPics, ...res.data.filteredResults]);
          // backend - per page = 10
          setHasMore(10 * pageNumber < res.data.total);
          setLoading(false);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            if (err.response?.status === 429) {
              setReqErrorMsg(`${err.response.data}`);
            }
            setLoading(false);
            setError(true);
          }
        });
    },
    [pageNumber, query]
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isFirstRun) return;
    if (query.length !== 0 && isMounted()) {
      setError(false);
      setLoading(true);
      fetchPhotosCallback(source);
    }
    return () => {
      source.cancel();
    };
  }, [query, pageNumber, isFirstRun, fetchPhotosCallback, isMounted]);

  return { loading, error, reqErrorMsg, pics, hasMore };
}
