import { useState, useEffect, useMemo } from "react";

import type { Bytes } from "@ethersproject/bytes";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { useWeb3 } from "app/hooks/use-web3";

import { UseWalletReturnType } from "./types";
import { useRandomWallet } from "./use-random-wallet";

const useWallet = (): UseWalletReturnType => {
  const connector = useWalletConnect();
  const { web3, isMagic, magicWalletAddress } = useWeb3();
  const mobileSDK = useWalletMobileSDK();
  const [address, setAddress] = useState<string | undefined>();

  useEffect(() => {
    (async function fetchUserAddress() {
      if (connector.session?.accounts?.[0]) {
        const getAddress = (await import("@ethersproject/address")).getAddress;
        setAddress(getAddress(connector.session.accounts[0]));
      } else if (magicWalletAddress) {
        setAddress(magicWalletAddress);
      } else if (mobileSDK.address) {
        setAddress(mobileSDK.address);
      } else if (web3) {
        const address = await web3.getSigner().getAddress();
        setAddress(address);
      } else {
        setAddress(undefined);
      }
    })();
  }, [web3, connector.session, magicWalletAddress, mobileSDK.address]);

  const result = useMemo(() => {
    const wcConnected = connector.connected;
    const mobileSDKConnected = mobileSDK.connected;

    let walletName: string | undefined;
    if (wcConnected) {
      walletName = connector.peerMeta?.name;
    } else if (mobileSDKConnected) {
      walletName = mobileSDK.metadata?.name;
    }

    return {
      address,
      connect: async () => {
        await Promise.race([connector.connect(), mobileSDK.onConnected()]);
      },
      disconnect: async () => {
        if (wcConnected) {
          localStorage.removeItem("walletconnect");
          await connector.killSession();
        } else if (mobileSDKConnected) {
          mobileSDK.disconnect();
        }
      },
      name: walletName,
      connected: connector.connected || isMagic || mobileSDKConnected,
      networkChanged: undefined,
      signMessageAsync: async (args: { message: string | Bytes }) => {
        if (wcConnected) {
          const signature = await connector.signPersonalMessage([
            args.message,
            address,
          ]);
          return signature;
        } else if (mobileSDKConnected && address) {
          const signature = await mobileSDK.personalSign(args.message, address);
          return signature;
        }
      },
    };
  }, [address, connector, isMagic, mobileSDK]);

  if (process.env.E2E) {
    // env variables won't change between renders, so this looks safe

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRandomWallet();
  }

  return result;
};

export { useWallet };
