import { useCallback } from "react";

import { FullWindowOverlay } from "react-native-screens";

import { Image } from "@showtime-xyz/universal.image";
import { ModalHeader } from "@showtime-xyz/universal.modal";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import type { IProviderMetadata } from "app/lib/react-native-web3-modal";
import { Web3Modal } from "app/lib/react-native-web3-modal";
import { RenderModalProps } from "app/lib/react-native-web3-modal/components/Web3Modal";
import { scheme } from "app/lib/scheme";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
export const providerMetadata: IProviderMetadata = {
  name: "Showtime",
  description: "Connect with Showtime",
  url: "https://showtime.xyz/",
  icons: ["https://storage.googleapis.com/showtime-cdn/showtime-icon-sm.jpg"],
  redirect: {
    native: scheme + "://",
  },
};

export const sessionParams = {
  namespaces: {
    eip155: {
      methods: ["personal_sign"],
      chains: ["eip155:1"],
      events: ["chainChanged", "accountsChanged"],
      rpcMap: {},
    },
  },
};

const wallets = {
  rainbow: {
    id: "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    name: "Rainbow",
    homepage: "https://rainbow.me/",
    image_id: "7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500",
    order: 0,
    app: {
      browser: null,
      ios: "https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021",
      android: "https://play.google.com/store/apps/details?id=me.rainbow",
      mac: null,
      windows: null,
      linux: null,
      chrome: "https://rainbow.me/extension",
      firefox: null,
      safari: null,
      edge: null,
      opera: null,
    },
    injected: [
      {
        injected_id: "isRainbow",
        namespace: "eip155",
      },
    ],
    mobile: {
      native: "rainbow://",
      universal: "https://rnbwapp.com",
    },
    desktop: {
      native: null,
      universal: null,
    },
  },
  argent: {
    id: "bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6",
    name: "Argent",
    homepage: "https://www.argent.xyz",
    image_id: "215158d2-614b-49c9-410f-77aa661c3900",
    order: 7,
    app: {
      browser: "",
      ios: "https://apps.apple.com/us/app/argent-defi-in-a-tap/id1358741926",
      android:
        "https://play.google.com/store/apps/details?id=im.argent.contractwalletclient&hl=en&gl=US&pli=1",
      mac: null,
      windows: null,
      linux: null,
      chrome: null,
      firefox: null,
      safari: null,
      edge: null,
      opera: null,
    },
    injected: null,
    mobile: {
      native: "argent://app/",
      universal: "https://www.argent.xyz/app",
    },
    desktop: {
      native: null,
      universal: null,
    },
  },
  trustWallet: {
    id: "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
    name: "Trust Wallet",
    homepage: "https://trustwallet.com/",
    image_id: "0528ee7e-16d1-4089-21e3-bbfb41933100",
    order: 1,
    app: {
      browser: null,
      ios: "https://apps.apple.com/app/apple-store/id1288339409",
      android:
        "https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp",
      mac: null,
      windows: null,
      linux: null,
      chrome:
        "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph",
      firefox: null,
      safari: null,
      edge: null,
      opera: null,
    },
    injected: [
      {
        injected_id: "isTrust",
        namespace: "eip155",
      },
      {
        injected_id: "isTrustWallet",
        namespace: "eip155",
      },
    ],
    mobile: {
      native: "trust://",
      universal: "https://link.trustwallet.com",
    },
    desktop: {
      native: null,
      universal: null,
    },
  },
  metamask: {
    id: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    name: "MetaMask",
    slug: "metamask",
    description:
      "Whether you are an experienced user or brand new to blockchain, MetaMask helps you connect to the decentralized web: a new internet.",
    homepage: "https://metamask.io/",
    chains: ["eip155:1"],
    versions: ["1", "2"],
    sdks: ["sign_v1", "sign_v2"],
    app_type: "wallet",
    image_id: "5195e9db-94d8-4579-6f11-ef553be95100",
    image_url: {
      sm: "https://explorer-api.walletconnect.com/v3/logo/sm/5195e9db-94d8-4579-6f11-ef553be95100?projectId=0417507b5ad9f15326f376c50fc4439a",
      md: "https://explorer-api.walletconnect.com/v3/logo/md/5195e9db-94d8-4579-6f11-ef553be95100?projectId=0417507b5ad9f15326f376c50fc4439a",
      lg: "https://explorer-api.walletconnect.com/v3/logo/lg/5195e9db-94d8-4579-6f11-ef553be95100?projectId=0417507b5ad9f15326f376c50fc4439a",
    },
    app: {
      browser: null,
      ios: "https://apps.apple.com/us/app/metamask/id1438144202",
      android: "https://play.google.com/store/apps/details?id=io.metamask",
      mac: null,
      windows: null,
      linux: null,
      chrome:
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/",
      safari: null,
      edge: "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US",
      opera: "https://addons.opera.com/en-gb/extensions/details/metamask-10/",
    },
    injected: [
      {
        namespace: "eip155",
        injected_id: "isMetaMask",
      },
    ],
    mobile: {
      native: "metamask://",
      universal: "https://metamask.app.link",
    },
    desktop: {
      native: "",
      universal: "",
    },
    supported_standards: [],
    metadata: {
      shortName: "MetaMask",
      colors: {
        primary: "#ffffff",
        secondary: null,
      },
    },
    updatedAt: "2021-07-30T17:48:12.565532+00:00",
  },
  ledgerLive: {
    id: "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
    name: "Ledger Live",
    homepage: "https://www.ledger.com/ledger-live",
    image_id: "a7f416de-aa03-4c5e-3280-ab49269aef00",
    order: 14,
    app: {
      browser: "https://www.ledger.com/ledger-live/download",
      ios: "https://itunes.apple.com/app/id1361671700",
      android: "https://play.google.com/store/apps/details?id=com.ledger.live",
      mac: null,
      windows: null,
      linux: null,
      chrome: null,
      firefox: null,
      safari: null,
      edge: null,
      opera: null,
    },
    injected: null,
    mobile: {
      native: "ledgerlive://",
      universal: "",
    },
    desktop: {
      native: "ledgerlive://",
      universal: "",
    },
  },
} as const;

const getImageUrl = (imageId: string) => {
  const W3M_API = "https://explorer-api.walletconnect.com";

  return `${W3M_API}/w3m/v1/getWalletImage/${imageId}?projectId=${projectId}`;
};
const WALLETS = [
  "metamask", // MetaMask
  "argent", // Argent
  "trustWallet", // Trust Wallet
  "rainbow", // Rainbow
  "ledgerLive", // Ledger Live
] as const;

function WalletConnectQRCodeModal(props: RenderModalProps) {
  const insets = useSafeAreaInsets();
  const mobileSDK = useWalletMobileSDK();

  const connectMobileSDK = useCallback(async () => {
    await mobileSDK.connect();
    props.onDismiss(); // close modal after connecting
  }, [mobileSDK, props]);

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

          {WALLETS.map((wallet) => {
            const w = wallets[wallet];
            return (
              <PressableScale
                key={`wallet-${wallet}`}
                onPress={() => {
                  props.connectWallet(w);
                }}
                style={{
                  marginVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: getImageUrl(w.image_id) }}
                  tw="rounded-md"
                  width={40}
                  height={40}
                  alt={w.name}
                />
                <View tw="w-4" />
                <Text tw="text-lg text-black dark:text-white">{w.name}</Text>
              </PressableScale>
            );
          })}
        </View>
      </View>
    </FullWindowOverlay>
  );
}

export function WalletProvider({ children }: any) {
  return (
    <>
      {children}
      <Web3Modal
        projectId={projectId}
        providerMetadata={providerMetadata}
        sessionParams={sessionParams}
        renderQrcodeModal={(props: any) => (
          <WalletConnectQRCodeModal {...props} />
        )}
      />
    </>
  );
}
