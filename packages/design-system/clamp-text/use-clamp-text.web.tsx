import { useLayoutEffect, useState, useRef, useCallback } from "react";
import { Platform } from "react-native";

import type { ClampTextProps } from "./use-clamp-text";

const int = (v: string) => parseFloat(v);
const countRows = (h: number, l: number) => Math.round(h / l);
const binarySearch = (text: string | any[], cb: (arg0: number) => any) => {
  let min = 0,
    max = text.length - 1;
  while (min <= max) {
    const mid = (max + min) / 2;
    const result = cb(mid);
    max = result > 0 ? mid - 1 : max;
    min = result < 0 ? mid + 1 : min;
    if (result === 0) return mid;
  }
};
const getStyle = (attr: keyof CSSStyleDeclaration, ele: any) =>
  window.getComputedStyle
    ? window.getComputedStyle(ele, null)[attr]
    : ele.currentStyle[attr];

export const useClampText = ({
  element,
  text = "",
  rows = 3,
  ellipsis = "...",
  expandButtonWidth = 6,
}: ClampTextProps) => {
  const innerText =
    typeof text === "string" ? text.replace(/[\r\n]/g, "") : text;

  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const collapseText = useRef("");
  const lh = useRef(0);
  useLayoutEffect(() => {
    if (Platform.OS !== "web" || !element) return;
    const styles = window.getComputedStyle(element, null);
    lh.current = parseInt(styles.lineHeight, 10);
    const h = parseInt(styles.height, 10);
    const initRows = Math.round(h / lh.current);

    if (initRows <= rows) return;
    const fillText = (str: any) => {
      element.innerHTML = str;
    };

    if (typeof innerText === "string") {
      const sliceText = (pos: number) =>
        `${innerText.slice(0, pos)}${ellipsis}`;
      const contentHeight = () => {
        if (!element) return 0;
        const height = (element as any).offsetHeight;
        const attrs = [
          "borderTop",
          "borderBottom",
          "paddingTop",
          "paddingBottom",
        ];
        return (
          height -
          attrs.reduce(
            (total, cur) =>
              total + int(getStyle(cur as keyof CSSStyleDeclaration, element)),
            0
          )
        );
      };
      const singleLineHeight = int(getStyle("lineHeight", element));

      const textRows = (str: string) => {
        fillText(str);
        return countRows(contentHeight(), singleLineHeight);
      };

      const lastStrPosition = binarySearch(innerText, (cur) => {
        const curRows = textRows(sliceText(cur));

        if (curRows !== rows) return curRows - rows;
        return textRows(sliceText(cur + 1)) - rows - 1;
      });

      if (typeof lastStrPosition !== "number") return;

      const lastPosition = Math.max(
        lastStrPosition - expandButtonWidth,
        expandButtonWidth
      );

      collapseText.current = sliceText(lastPosition);
      fillText(collapseText.current);
    } else if (Array.isArray(text)) {
      (element as any).style.height = `${lh.current * rows}px`;
      (element as any).style.overflow = "hidden";
    }
    setShowMore(true);
  }, [element, ellipsis, expandButtonWidth, rows, text, innerText]);

  const onShowLess = useCallback(() => {
    setShowLess(false);
    setShowMore(true);
    if (!element) return;
    if (typeof text === "string") {
      element.childNodes[0].nodeValue = collapseText.current;
    } else {
      (element as any).style.height = `${lh.current * rows}px`;
    }
  }, [element, rows, text]);

  const onShowMore = useCallback(() => {
    setShowMore(false);
    setShowLess(true);
    if (!element) return;
    if (typeof text === "string") {
      element.childNodes[0].nodeValue = text;
    } else {
      element.innerHTML = text as any;
      (element as any).style.height = "auto";
    }
  }, [element, text]);
  const onTextLayout = () => undefined;
  return {
    showMore,
    showLess,
    onShowLess,
    onShowMore,
    innerText,
    onTextLayout,
  };
};
