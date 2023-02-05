// custom hook used to prevent useEffect from running onMount (prevents first time run on page load)
import { useRef, useEffect } from 'react';

export default function useFirstRun() {
  const isFirstRun = useRef(true);

  useEffect(() => {
    isFirstRun.current = false;
  }, []);

  return isFirstRun.current;
}
