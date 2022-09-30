/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState, useMemo, useLayoutEffect } from "react";
import { LayoutChangeEvent, Platform } from "react-native";

import { useSharedValue } from "react-native-reanimated";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { getScrollParent } from "@showtime-xyz/universal.utils";

export type PlatformRect = Pick<
  DOMRect,
  "top" | "left" | "width" | "height"
> | null;

export const useIsDarkMode = () => {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark";
};

export const useOnFocus = () => {
  const focused = useSharedValue(0);
  // use state on web for now till useAnimatedStyle bug is resolved
  const [state, setFocused] = useState(0);

  const focusHandler = useMemo(() => {
    return {
      onFocus: () => {
        focused.value = 1;
        if (Platform.OS === "web") {
          setFocused(1);
        }
      },
      onBlur: () => {
        focused.value = 0;
        if (Platform.OS === "web") {
          setFocused(0);
        }
      },
      focused: Platform.select({ default: focused, web: { value: state } }),
    };
  }, [state]);

  return focusHandler;
};

export const useOnHover = () => {
  const hovered = useSharedValue(0);
  // use state on web for now till useAnimatedStyle bug is resolved
  const [state, setHovered] = useState(0);

  const hoverHandler = useMemo(() => {
    return {
      onHoverIn: () => {
        hovered.value = 1;
        if (Platform.OS === "web") {
          setHovered(1);
        }
      },
      onHoverOut: () => {
        hovered.value = 0;
        if (Platform.OS === "web") {
          setHovered(0);
        }
      },
      hovered: Platform.select({ default: hovered, web: { value: state } }),
    };
  }, [state]);

  return hoverHandler;
};

export const useOnPress = () => {
  const pressed = useSharedValue(0);
  // use state on web for now till useAnimatedStyle bug is resolved
  const [state, setPressed] = useState(0);

  const pressHandler = useMemo(() => {
    return {
      onPressIn: () => {
        pressed.value = 1;
        if (Platform.OS === "web") {
          setPressed(1);
        }
      },
      onPressOut: () => {
        pressed.value = 0;
        if (Platform.OS === "web") {
          setPressed(0);
        }
      },
      pressed: Platform.select({ default: pressed, web: { value: state } }),
    };
  }, [state]);

  return pressHandler;
};

export function useUpdateEffect(effect: any, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}

export const useLayout = () => {
  const [layout, setLayout] = useState<
    LayoutChangeEvent["nativeEvent"]["layout"] | undefined
  >();
  const onLayout = (e: any) => {
    setLayout(e.nativeEvent.layout);
  };

  return { onLayout, layout };
};

type BlurTint = "light" | "dark" | "default";

function getBackgroundColor(intensity: number, tint: BlurTint): string {
  const opacity = intensity / 100;
  switch (tint) {
    case "dark":
      // From Apple iOS 14 Sketch Kit - https://developer.apple.com/design/resources/
      return `rgba(25,25,25,${opacity * 0.78})`;
    case "light":
      // From Apple iOS 14 Sketch Kit - https://developer.apple.com/design/resources/
      return `rgba(249,249,249,${opacity * 0.78})`;
    case "default":
      // From xcode composition
      return `rgba(255,255,255,${opacity * 0.3})`;
  }
}

export function useBlurredBackgroundStyles(intensity: number): {
  backgroundColor: string;
  backdropFilter: string;
  "-webkit-backdrop-filter": string;
} {
  const isDark = useIsDarkMode();

  return {
    backgroundColor: getBackgroundColor(intensity, isDark ? "dark" : "light"),
    backdropFilter: "blur(20px)",
    "-webkit-backdrop-filter": "blur(20px)",
  };
}

export function useIsMobileWeb() {
  const [userAgent, setUserAgent] = useState("");
  const [isMobileWeb, setIsMobileWeb] = useState(true);

  useEffect(() => {
    const userAgent = window?.navigator?.userAgent;
    setUserAgent(userAgent);
    setIsMobileWeb(
      /android/i.test(userAgent) || /iPad|iPhone|iPod|ios/.test(userAgent)
    );
  }, []);

  return {
    userAgent,
    isMobileWeb,
  };
}

export const usePlatformResize = (
  onResize: (evt?: Event) => any,
  isInit = false
) => {
  useLayoutEffect(() => {
    const handleResize = (evt: Event) => {
      onResize(evt);
    };
    if (isInit) {
      onResize();
    }
    Platform.OS === "web" && window.addEventListener("resize", handleResize);
    return function cleanup() {
      Platform.OS === "web" &&
        window.removeEventListener("resize", handleResize);
    };
  }, [onResize]);
};

export function useWebScroll<T>(
  ele: React.RefObject<T>,
  onScroll: (evt: Event) => void,
  deps: any[] = []
) {
  useLayoutEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }
    const handleScroll = (evt: Event) => {
      onScroll(evt);
    };
    if (ele.current) {
      const parentElement = getScrollParent(ele.current as any);

      parentElement.addEventListener("scroll", handleScroll);

      return () => {
        parentElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [deps]);
}

export function useWebClientRect<T>(ele: React.RefObject<T>) {
  const [clientRect, setClientRect] = useState<PlatformRect | null>(null);

  const updateClientRect = useMemo(() => {
    return () => {
      setClientRect((ele.current as any)?.getBoundingClientRect());
    };
  }, [ele]);

  useLayoutEffect(() => {
    if (ele.current && Platform.OS === "web") {
      updateClientRect();
    }
  }, [ele, updateClientRect]);

  return [clientRect, updateClientRect] as [
    typeof clientRect,
    typeof updateClientRect
  ];
}

export function useLockBodyScroll(isLocked = true) {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && window.document) {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.document &&
      isMounted &&
      isLocked
    ) {
      window.document.body.style.overflow = "hidden";
      window.document.body.style.marginRight = "0px";
      window.document.body.style.position = "fixed";
      // window.document.body.style.top = `-${y}px`;
      window.document.body.style.top = "0px";
      window.document.body.style.left = "0px";
      window.document.body.style.right = "0px";
    }

    return () => {
      if (
        typeof window !== "undefined" &&
        window.document &&
        isMounted &&
        isLocked
      ) {
        window.document.body.style.overflow = "";
        window.document.body.style.marginRight = "";
        window.document.body.style.position = "";
        window.document.body.style.top = "";
        window.document.body.style.left = "";
        window.document.body.style.right = "";
        // window.scrollTo(0, y);
      }
    };
  }, [isMounted, isLocked]);
}
