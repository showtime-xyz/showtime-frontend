import { useCallback, useRef } from "react";

import { useFocusEffect } from "app/lib/react-navigation/native";

type Callback = (...args: any[]) => void;

export function useStableBlurEffect(callback: Callback) {
  const callbackRef = useRef<Callback>();
  callbackRef.current = callback;

  useFocusEffect(
    useCallback(() => {
      return () => {
        const handleBlur = callbackRef.current;
        if (handleBlur) {
          handleBlur();
        }

        callbackRef.current = undefined;
      };
    }, [])
  );
}
