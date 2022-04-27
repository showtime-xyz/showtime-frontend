import { useEffect } from "react";
import { Platform, ScrollView } from "react-native";

import {
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";
import type { NFT } from "app/types";

import { ListingCard } from "./listing-card";
import { ListingModal } from "./listing-modal";

type Props = {
  nft?: NFT;
};

const ListingScrollView =
  Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

const List = ({ nft }: Props) => {
  const router = useRouter();
  const { isAuthenticated } = useUser();

  /**
   * Redirect on log out
   */
  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated]);

  return (
    <BottomSheetModalProvider>
      <ListingModal>
        <ListingScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <ListingCard nft={nft} />
        </ListingScrollView>
      </ListingModal>
    </BottomSheetModalProvider>
  );
};

export { List };
