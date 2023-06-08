import type { IProviderMetadata } from "app/lib/react-native-web3-modal";
import { Web3Modal } from "app/lib/react-native-web3-modal";

export const providerMetadata: IProviderMetadata = {
  name: "React Native V2 dApp",
  description: "RN dApp by WalletConnect",
  url: "https://showtime.xyz/",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  redirect: {
    native: "io.showtime.development://",
  },
};

export const sessionParams = {
  namespaces: {
    eip155: {
      methods: [
        "eth_sendTransaction",
        "eth_signTransaction",
        "eth_sign",
        "personal_sign",
        "eth_signTypedData",
      ],
      chains: ["eip155:1"],
      events: ["chainChanged", "accountsChanged"],
      rpcMap: {},
    },
  },
};

export function WalletProvider({ children }: any) {
  return (
    <>
      {children}
      <Web3Modal
        projectId={"81ad3fc9d9d9a2958b53fd0855af4f2a"}
        providerMetadata={providerMetadata}
        sessionParams={sessionParams}
      />
    </>
  );
}
