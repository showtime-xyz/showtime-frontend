import { useEffect } from "react";
import { Platform, ScrollView } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";

import { ListingCard } from "./listing-card";
import { ListingModal } from "./listing-modal";

type Props = {
  nftId?: string;
};

const ListingScrollView =
  Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

const List = (props: Props) => {
  const nftId = props.nftId;
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
          <ListingCard nftId={nftId} />
        </ListingScrollView>
      </ListingModal>
    </BottomSheetModalProvider>
  );
};

export { List };
