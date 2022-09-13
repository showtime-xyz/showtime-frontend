import { useRef, useEffect } from "react";

export const useLatestValueRef = <T>(v: T) => {
  const ref = useRef(v);
  useEffect(() => {
    ref.current = v;
  });

  return ref;
};
