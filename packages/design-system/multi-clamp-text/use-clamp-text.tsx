import { useState, useRef, useCallback } from "react";
import {
  NativeSyntheticEvent,
  TextLayoutEventData,
  LayoutAnimation,
} from "react-native";

const animation = LayoutAnimation.create(
  300,
  LayoutAnimation.Types.easeOut,
  LayoutAnimation.Properties.opacity
);
export type ClampTextProps = {
  element?: Element;
  text: string;
  rows?: number;
  ellipsis?: string;
  expandButtonWidth?: number;
};
export const useClampText = ({
  text = "",
  rows = 3,
  ellipsis = "...",
  expandButtonWidth = 6,
}: ClampTextProps) => {
  const [innerText, setInnerText] = useState(text);
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
    LayoutAnimation.configureNext(animation);
    setShowMore(false);
    setShowLess(true);
    setInnerText(text);
  }, [text]);

  const onShowLess = useCallback(() => {
    LayoutAnimation.configureNext(animation);
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
