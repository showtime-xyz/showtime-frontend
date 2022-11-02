import { memo, useCallback } from "react";
import { Linking, Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import WCProvider, {
  RenderQrcodeModalProps,
  WalletService,
} from "@walletconnect/react-native-dapp";
import { FullWindowOverlay } from "react-native-screens";

import { Image } from "@showtime-xyz/universal.image";
import { ModalHeader } from "@showtime-xyz/universal.modal";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { scheme } from "app/lib/scheme";

const WALLET_CONNECT_CLIENT_META = {
  description: "Connect with Showtime",
  url: `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`,
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

const WALLETS = [
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
  "cf21952a9bc8108bf13b12c92443751e2cc388d27008be4201b92bbc6d83dd46", // Argent
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow
  "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927", // Ledger Live
];

function WalletConnectQRCodeModalComponent(props: RenderQrcodeModalProps) {
  const insets = useSafeAreaInsets();
  const mobileSDK = useWalletMobileSDK();

  const connectMobileSDK = useCallback(async () => {
    await mobileSDK.connect();
    props.onDismiss(); // close modal after connecting
  }, [mobileSDK, props]);

  if (!props.visible) {
    return null;
  }

  const wallets = props.walletServices.filter((wallet) => {
    return WALLETS.includes(wallet.id);
  });

  return (
    <FullWindowOverlay
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <View tw="flex-1 bg-white dark:bg-black">
        <View style={{ paddingTop: insets.top }} />
        <ModalHeader title="Connect my wallet" onClose={props.onDismiss} />
        <View tw="justify-center bg-white p-4 dark:bg-black">
          <PressableScale
            key={`wallet-cbw`}
            onPress={connectMobileSDK}
            style={{
              marginVertical: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={require("./coinbase-wallet-icon.png")}
              tw="rounded-md"
              width={40}
              height={40}
              alt="Coinbase Wallet"
            />
            <View tw="w-4" />
            <Text tw="text-lg text-black dark:text-white">Coinbase Wallet</Text>
          </PressableScale>

          {wallets.map((walletService: WalletService, i: number) => {
            return (
              <PressableScale
                key={`wallet-${i}`}
                onPress={() => {
                  if (Platform.OS === "android" && props.uri) {
                    Linking.openURL(props.uri);
                  } else {
                    props.connectToWalletService(walletService, props.uri);
                  }
                }}
                style={{
                  marginVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  // @ts-ignore
                  source={{ uri: walletService.image_url.lg }}
                  tw="rounded-md"
                  width={40}
                  height={40}
                  alt={walletService.name}
                />
                <View tw="w-4" />
                <Text tw="text-lg text-black dark:text-white">
                  {walletService.name}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </View>
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

export const WalletProvider = memo(WalletConnectProviderComponent);
