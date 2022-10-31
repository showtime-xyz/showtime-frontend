import { useState, useRef, useCallback, ReactNode } from "react";
import { NativeSyntheticEvent, TextLayoutEventData } from "react-native";

import { ClampTextProps } from "./clamp-text";

export type ClampTextParams = Pick<
  ClampTextProps,
  "expandText" | "foldText"
> & {
  element?: HTMLElement;
  text: string | Iterable<ReactNode> | null;
  rows?: number;
  ellipsis?: string;
  expandButtonWidth?: number;
  expandable?: boolean;
  foldable?: boolean;
};
export const useClampText = ({
  text = "",
  rows = 3,
  ellipsis = "...",
  expandButtonWidth = 10,
}: ClampTextParams) => {
  const [innerText, setInnerText] = useState(
    typeof text === "string" ? text.replace(/[\r\n]/g, " ") : text
  );
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const collapseText = useRef("");
  const isLayouted = useRef(false);

  const onTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (e.nativeEvent.lines.length <= rows || isLayouted.current) return;

    const finalText = e.nativeEvent.lines
      .slice(0, rows)
      .map((item) => item.text)
      .join("");

    const text = `${finalText.slice(
      0,
      finalText.length - expandButtonWidth
    )}${ellipsis}`;

    collapseText.current = text;
    setInnerText(text);
    setShowMore(true);
    isLayouted.current = true;
  };
  const onShowMore = useCallback(() => {
    setShowMore(false);
    setShowLess(true);
    setInnerText(text);
  }, [text]);

  const onShowLess = useCallback(() => {
    setShowLess(false);
    setShowMore(true);
    setInnerText(collapseText.current);
  }, []);
  return {
    showMore,
    showLess,
    onShowLess,
    onShowMore,
    innerText,
    onTextLayout,
  };
};
