import { useEffect, useRef } from "react";
import { Keyboard, ScrollView } from "react-native";

export const useScrollToEnd = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", () => {
      requestAnimationFrame(() => scrollViewRef?.current?.scrollToEnd?.());
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return { scrollViewRef };
};
