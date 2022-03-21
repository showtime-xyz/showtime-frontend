import { useEffect } from "react";
import { Platform, ScrollView } from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";

import { UnlistingCard } from "./unlisting-card";
import { UnlistingModal } from "./unlisting-modal";

type Props = {
  nftId?: string;
};

const UnlistingScrollView =
  Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

const Unlist = (props: Props) => {
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
      <UnlistingModal>
        <UnlistingScrollView
          contentContainerStyle={{
            paddingBottom: 80,
          }}
        >
          <UnlistingCard nftId={nftId} />
        </UnlistingScrollView>
      </UnlistingModal>
    </BottomSheetModalProvider>
  );
};

export { Unlist };
