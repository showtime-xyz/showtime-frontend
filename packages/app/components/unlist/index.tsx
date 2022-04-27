import { Platform, ScrollView } from "react-native";

import {
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import type { NFT } from "app/types";

import { UnlistingCard } from "./unlisting-card";
import { UnlistingModal } from "./unlisting-modal";

type Props = {
  nft?: NFT;
};

const UnlistingScrollView =
  Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

const Unlist = ({ nft }: Props) => {
  return (
    <BottomSheetModalProvider>
      <UnlistingModal>
        <UnlistingScrollView
          contentContainerStyle={{
            paddingBottom: 80,
          }}
        >
          <UnlistingCard nft={nft} />
        </UnlistingScrollView>
      </UnlistingModal>
    </BottomSheetModalProvider>
  );
};

export { Unlist };
