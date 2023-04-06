import { useRef, useCallback, useEffect } from "react";

export function useStableCallback<Callback extends (...args: any) => any>(
  callback: Callback
) {
  const callbackRef = useRef<Callback>();
  const memoCallback = useCallback(
    (...args: Parameters<Callback>) =>
      callbackRef.current && callbackRef.current(...args),
    []
  );
  useEffect(() => {
    callbackRef.current = callback;
    return () => (callbackRef.current = undefined);
  });
  return memoCallback;
}
