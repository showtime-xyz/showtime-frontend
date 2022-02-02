import { useRef, useCallback, useEffect } from "react";

type Callback = (...args: any[]) => any;

export function useStableCallback(callback: Callback) {
  const callbackRef = useRef<Callback>();
  const memoCallback = useCallback(
    (...args) => callbackRef.current && callbackRef.current(...args),
    []
  );
  useEffect(() => {
    callbackRef.current = callback;
    return () => (callbackRef.current = undefined);
  });
  return memoCallback;
}
