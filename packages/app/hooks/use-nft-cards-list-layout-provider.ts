import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { LayoutProvider } from "app/lib/recyclerlistview";

import { MAX_CONTENT_WIDTH } from "../constants/layout";

const LIST_HEADER_HEIGHT = 80;

const useNFTCardDimensions = () => {
  const { width } = useWindowDimensions();

  if (width < 768) {
    return { height: width / 3, width: width / 3 };
  }
  return {
    height: 604,
    width: (width < MAX_CONTENT_WIDTH ? width : MAX_CONTENT_WIDTH) / 3,
  };
};

function useNFTCardsListLayoutProvider({
  newData,
  headerHeight = LIST_HEADER_HEIGHT,
}: {
  newData: any;
  headerHeight?: number;
}) {
  const { height, width } = useNFTCardDimensions();
  const { width: windowWidth } = useWindowDimensions();
  const isFirstIndexHeader = newData[0] === "header";

  const _layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        (index) => {
          if (isFirstIndexHeader && index === 0) return "header";

          return "item";
        },
        (_type, dim) => {
          if (_type === "item") {
            dim.width = width;
            dim.height = height;
          } else if (_type === "header") {
            dim.width = windowWidth;
            dim.height = headerHeight;
          }
        }
      ),
    [isFirstIndexHeader, windowWidth, headerHeight]
  );

  return _layoutProvider;
}

export { useNFTCardsListLayoutProvider };
