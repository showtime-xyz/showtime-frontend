import { memo } from "react";
import WCProvider, {
  RenderQrcodeModalProps,
  QrcodeModal,
} from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FullWindowOverlay } from "react-native-screens";

const scheme = `io.showtime${
  process.env.STAGE === "development"
    ? ".development"
    : process.env.STAGE === "staging"
    ? ".staging"
    : ""
}`;

const WALLET_CONNECT_CLIENT_META = {
  description: "Connect with Showtime",
  url: "https://showtime.io",
  icons: ["https://storage.googleapis.com/showtime-cdn/showtime-icon-sm.jpg"],
  name: "Showtime",
  scheme,
};

const WALLET_CONNECT_STORAGE_OPTIONS = {
  asyncStorage: AsyncStorage,
} as any;

interface WalletConnectProviderProps {
  children: React.ReactNode;
}

function WalletConnectQRCodeModalComponent(props: RenderQrcodeModalProps) {
  if (!props.visible) {
    return null;
  }

  return (
    <FullWindowOverlay
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <QrcodeModal division={4} {...props} />
    </FullWindowOverlay>
  );
}

const WalletConnectQRCodeModal = memo(WalletConnectQRCodeModalComponent);

function WalletConnectProviderComponent({
  children,
}: WalletConnectProviderProps) {
  return (
    <WCProvider
      clientMeta={WALLET_CONNECT_CLIENT_META}
      redirectUrl={`${scheme}://`}
      storageOptions={WALLET_CONNECT_STORAGE_OPTIONS}
      renderQrcodeModal={(props) => <WalletConnectQRCodeModal {...props} />}
    >
      {children}
    </WCProvider>
  );
}

export const WalletConnectProvider = memo(WalletConnectProviderComponent);
