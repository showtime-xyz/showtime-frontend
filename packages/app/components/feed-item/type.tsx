import { StyleProp, ViewStyle } from "react-native";

import { NFT } from "app/types";

export type FeedItemProps = {
  nft: NFT;
  detailStyle?: StyleProp<ViewStyle>;
  bottomPadding?: number;
  bottomMargin?: number;
  itemHeight?: number;
  setMomentumScrollCallback?: (callback: any) => void;
  index?: number;
  listLength?: number;
  slideToNext?: () => void;
  slideToPrev?: () => void;
};
