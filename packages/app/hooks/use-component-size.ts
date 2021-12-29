import { useState, useCallback } from "react";
import { LayoutChangeEvent } from "react-native";

export function useComponentSize() {
  const [size, setSize] = useState({ height: 0, width: 0 });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setSize({ height, width });
  }, []);

  return { onLayout, size };
}
