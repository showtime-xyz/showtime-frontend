import { useEffect, useContext } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { View, Text, Button } from "design-system";
import { Platform, ScrollView } from "react-native";
import { Modal, ModalSheet } from "design-system";
import { useMemo } from "react";
import { useRouter } from "app/navigation/use-router";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { ListingModal } from "./listing-modal";
import { ListingCard } from "./listing-card";
import { useUser } from "app/hooks/use-user";
import { AppContext } from "app/context/app-context";

type Props = {
  nftId?: string;
};

const ListingScrollView =
  Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

const List = (props: Props) => {
  const nftId = props.nftId;
  const router = useRouter();
  const connector = useWalletConnect();

  const context = useContext(AppContext);
  // test when this is multiple?
  const connectedAddresses = connector?.session?.accounts;
  const connectedAddress = connectedAddresses[0];

  const { user, isAuthenticated } = useUser();

  console.log("user", user);
  console.log("connectedAddresses", connectedAddresses);
  console.log("connectedAddress", connectedAddress);

  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated]);

  return (
    <ListingModal>
      <ListingScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <ListingCard nftId={nftId} />
      </ListingScrollView>
    </ListingModal>
  );
};

export { List };
