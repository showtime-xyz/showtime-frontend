import { useLayoutEffect, RefObject, useMemo, useState } from "react";
import { Platform, View } from "react-native";

import { PlatformRect } from "./get-placement";

export const useWebScroll = (
  ele: RefObject<HTMLElement | View | null>,
  onScroll: (evt: Event) => void,
  deps: any[] = []
) => {
  useLayoutEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }
    const handleScroll = (evt: Event) => {
      onScroll(evt);
    };
    if (ele.current) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ele, onScroll, ...deps]);
};

export const useWebClientRect = (ele: RefObject<HTMLElement | View | null>) => {
  const [clientRect, setClientRect] = useState<PlatformRect | null>(null);

  const updateClientRect = useMemo(() => {
    return () => {
      setClientRect((ele.current as HTMLElement)!.getBoundingClientRect());
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
};

export const usePlatformResize = (onResize: (evt: Event) => any) => {
  useLayoutEffect(() => {
    const handleResize = (evt: Event) => {
      onResize(evt);
    };
    Platform.OS === "web" && window.addEventListener("resize", handleResize);
    return function cleanup() {
      Platform.OS === "web" &&
        window.removeEventListener("resize", handleResize);
    };
  }, [onResize]);
};
