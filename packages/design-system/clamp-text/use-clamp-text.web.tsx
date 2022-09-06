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

const countLines = (element: Element | null) => {
  if (!element) return 0;
  const styles = window.getComputedStyle(element, null);

  const lh = parseInt(styles.lineHeight, 10);
  const h = parseInt(styles.height, 10);
  const lc = Math.round(h / lh);
  return lc;
};

export const useClampText = ({
  element,
  text = "",
  rows = 3,
  ellipsis = "...",
  expandButtonWidth = 6,
}: ClampTextProps) => {
  const innerText = text.replace(/[\r\n]/g, "");
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const defaultText = useRef(text);
  const collapseText = useRef("");

  useLayoutEffect(() => {
    if (Platform.OS !== "web" || !element) return;
    const initRows = countLines(element);
    if (initRows <= rows) return;
    const sliceText = (pos: number) => `${innerText.slice(0, pos)}${ellipsis}`;
    const fillText = (str: any) => {
      element.innerHTML = str;
    };
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
    setShowMore(true);
  }, [element, ellipsis, expandButtonWidth, rows, text, innerText]);

  const onShowLess = useCallback(() => {
    setShowLess(false);
    setShowMore(true);
    if (!element) return;
    element.childNodes[0].nodeValue = collapseText.current;
  }, [element]);

  const onShowMore = useCallback(() => {
    setShowMore(false);
    setShowLess(true);
    if (!element) return;
    element.childNodes[0].nodeValue = defaultText.current;
  }, [element]);
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
