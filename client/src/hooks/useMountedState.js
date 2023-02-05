import { useEffect, useRef, useCallback } from 'react';

// returns a function that when called will
// return `true` if the component is mounted
export const useMountedState = () => {
  const mountedRef = useRef(false);
  // only runs once when called ( [] ), mountedRef keeps state across re-renders
  const isMounted = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    // cleanup function to prevent memory leaks
    // it is run before the the component is removed from the UI.
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return isMounted;
};
