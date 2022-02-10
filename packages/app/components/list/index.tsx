import { useEffect, useContext, useState } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { Platform, ScrollView } from "react-native";
import { useMemo, useReducer } from "react";
import { useRouter } from "app/navigation/use-router";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { ListingModal } from "./listing-modal";
import { ListingCard } from "./listing-card";
import { useUser } from "app/hooks/use-user";
import { AppContext } from "app/context/app-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

type Props = {
  nftId?: string;
};

const ListingScrollView =
  Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

const List = (props: Props) => {
  const nftId = props.nftId;
  const router = useRouter();
  const context = useContext(AppContext);
  const connector = useWalletConnect();
  const { user, isAuthenticated } = useUser();
  const [activeAddress, setActiveAddress] = useState<string>();
  const isWalletConnectSession = connector.connected;
  const isMagic = Boolean(context.web3);

  const getActiveAddress = async () => {
    if (isWalletConnectSession) {
      const [connectedAddress] = connector?.session?.accounts;
      setActiveAddress(connectedAddress);
    }

    // Only use magic if it's active + no wallet
    if (isMagic && !isWalletConnectSession) {
      const signer = context.web3.getSigner();
      const magicAddress = await signer.getAddress();
      setActiveAddress(magicAddress);
    }
  };

  /**
   * Redirect on log out
   */
  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getActiveAddress();
  }, [isWalletConnectSession, isMagic]);

  console.log("active address", activeAddress);
  return (
    <BottomSheetModalProvider>
      <ListingModal>
        <ListingScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <ListingCard nftId={nftId} address={activeAddress} />
        </ListingScrollView>
      </ListingModal>
    </BottomSheetModalProvider>
  );
};

export { List };
