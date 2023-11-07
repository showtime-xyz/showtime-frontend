import { useRef, useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { TopCreatorTokens } from "app/components/creator-token/top-creator-token";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { Sticky } from "app/lib/stickynode";

import { breakpoints } from "design-system/theme";

const RIGHT_SIDE_WIDTH = 300;
export const Home = () => {
  const { width, height } = useWindowDimensions();

  const is2XlWidth = width >= breakpoints["2xl"];
  const loadQuantity = useMemo(() => {
    return Math.floor((height - 100) / 54);
  }, [height]);
  const listRef = useRef<any>();
  useScrollToTop(listRef);

  return (
    <View
      tw=""
      style={{
        width: RIGHT_SIDE_WIDTH,
        marginLeft: is2XlWidth ? 160 : 110,
      }}
    >
      <Sticky enabled>
        <TopCreatorTokens isSimplified limit={loadQuantity} disableFetchMore />
      </Sticky>
    </View>
  );
};
