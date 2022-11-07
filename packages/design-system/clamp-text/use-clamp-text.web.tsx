import { useLayoutEffect } from "react";
import { Platform } from "react-native";

import { MultiClamp } from "./clamp.web";
import type { ClampTextParams } from "./use-clamp-text";

const tw =
  "text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-600 rounded-sm px-0.5";
export const useClampText = ({
  element,
  text = "",
  rows = 3,
  ellipsis = "...",
  expandText = "More",
  foldText = "Less",
}: ClampTextParams) => {
  useLayoutEffect(() => {
    if (Platform.OS !== "web" || !element) return;
    new MultiClamp(element, {
      rows,
      ellipsis,
      expandable: true,
      foldable: true,
      foldTagClassName: tw,
      expendTagClassName: tw,
      expandText: expandText,
      foldText,
      // @ts-ignore
      originText: text,
    });
  }, [element, ellipsis, expandText, foldText, rows, text]);

  return {
    showMore: false,
    showLess: false,
    onShowLess: () => {},
    onShowMore: () => {},
    innerText: text,
    onTextLayout: () => undefined,
  };
};
