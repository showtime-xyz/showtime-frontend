import { useCallback, useRef } from "react";

import { useFocusEffect } from "app/lib/react-navigation/native";

type Callback = (...args: any[]) => void;

export function useStableFocusEffect(callback: Callback) {
  const callbackRef = useRef<Callback>();
  callbackRef.current = callback;

  useFocusEffect(
    useCallback(() => {
      const handleFocus = callbackRef.current;
      if (handleFocus) {
        handleFocus();
      }

      return () => {
        callbackRef.current = undefined;
      };
    }, [])
  );
}
