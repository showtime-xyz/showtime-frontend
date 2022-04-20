import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { LayoutProvider } from "app/lib/recyclerlistview";

const LIST_HEADER_HEIGHT = 80;

const useNFTCardDimensions = () => {
  const { width } = useWindowDimensions();

  if (width < 768) {
    return { height: width / 3, width: width / 3 };
  }

  return {
    height: 600,
    width: width / 3,
  };
};

function useNFTCardsListLayoutProvider({ newData }: { newData: any }) {
  const { height, width } = useNFTCardDimensions();
  const { width: windowWidth } = useWindowDimensions();

  const _layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        (index) => {
          if (newData && newData[index] === "header") {
            return "header";
          }

          return "item";
        },
        (_type, dim) => {
          if (_type === "item") {
            dim.width = width;
            dim.height = height;
          } else if (_type === "header") {
            dim.width = windowWidth;
            dim.height = LIST_HEADER_HEIGHT;
          }
        }
      ),
    [width, windowWidth, newData]
  );

  return _layoutProvider;
}

export { useNFTCardsListLayoutProvider };
