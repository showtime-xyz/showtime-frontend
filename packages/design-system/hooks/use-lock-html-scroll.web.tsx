import { useEffect, useState, useMemo } from "react";

import { getGapWidth } from "react-remove-scroll-bar";

import { useIsomorphicLayoutEffect } from "./index";

export function useLockHtmlScroll(isLocked = true) {
  const [isMounted, setIsMounted] = useState(false);
  const gap = useMemo(() => getGapWidth("padding"), []);

  useIsomorphicLayoutEffect(() => {
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
      document.documentElement.classList.add("no-scroll");
      document.documentElement.style.paddingRight = `${gap.gap}px`;
    }

    return () => {
      if (
        typeof window !== "undefined" &&
        window.document &&
        isMounted &&
        isLocked
      ) {
        document.documentElement.classList.remove("no-scroll");
        document.documentElement.style.paddingRight = `0px`;
      }
    };
  }, [isMounted, isLocked, gap.gap]);
}
