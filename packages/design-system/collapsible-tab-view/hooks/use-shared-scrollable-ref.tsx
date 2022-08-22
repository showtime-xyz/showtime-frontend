import React, { useEffect } from "react";

import { useAnimatedRef } from "react-native-reanimated";

import type { ForwardRefType } from "../types";

export function useSharedScrollableRef<T extends React.Component>(
  forwardRef: ForwardRefType<T>
) {
  const ref = useAnimatedRef<T>();

  useEffect(() => {
    if (!forwardRef) {
      return;
    }
    if (typeof forwardRef === "function") {
      forwardRef(ref.current);
    } else {
      forwardRef.current = ref.current;
    }
  });

  return ref;
}
