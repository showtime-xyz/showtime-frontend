import { useState, useEffect, useMemo, useRef } from "react";

import type { Bytes } from "@ethersproject/bytes";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { useLatestValueRef } from "app/hooks/use-latest-value-ref";
import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { useWeb3 } from "app/hooks/use-web3";

import { ConnectResult, UseWalletReturnType } from "./types";
import { useRandomWallet } from "./use-random-wallet";

const useWallet = (): UseWalletReturnType => {
  const walletConnectedPromiseResolveCallback = useRef<any>(null);
  const connector = useWalletConnect();
  const { web3, isMagic, magicWalletAddress } = useWeb3();
  const mobileSDK = useWalletMobileSDK();
  const [address, setAddress] = useState<string | undefined>();

  // we use this hook to prevent stale values in closures
  const walletConnectInstanceRef = useLatestValueRef(connector);
  const coinbaseMobileSDKInstanceRef = useLatestValueRef(mobileSDK);

  const walletConnected = connector.connected || mobileSDK.connected;

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

  // WalletConnect connected
  useEffect(() => {
    if (walletConnectedPromiseResolveCallback.current && connector.connected) {
      const getAddress = require("@ethersproject/address").getAddress;
      walletConnectedPromiseResolveCallback.current({
        address: getAddress(connector.session?.accounts?.[0]),
        walletName: connector.peerMeta?.name,
      });
      walletConnectedPromiseResolveCallback.current = null;
    }
  }, [connector, address, connector.peerMeta?.name]);

  // Coinbase connected
  useEffect(() => {
    if (walletConnectedPromiseResolveCallback.current && mobileSDK.connected) {
      walletConnectedPromiseResolveCallback.current({
        address: mobileSDK.address,
        walletName: mobileSDK.metadata?.name,
      });
      walletConnectedPromiseResolveCallback.current = null;
    }
  }, [walletConnected, address, mobileSDK]);

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
        walletConnectInstanceRef.current.connect();
        return new Promise<ConnectResult>((resolve) => {
          walletConnectedPromiseResolveCallback.current = resolve;
        });
      },
      disconnect: async () => {
        if (walletConnectInstanceRef.current.connected) {
          await walletConnectInstanceRef.current.killSession();
        } else if (coinbaseMobileSDKInstanceRef.current.connected) {
          await coinbaseMobileSDKInstanceRef.current.disconnect();
        }
      },
      name: walletName,
      connected: walletConnected || isMagic,
      networkChanged: undefined,
      signMessageAsync: async (args: { message: string | Bytes }) => {
        if (walletConnectInstanceRef.current.connected) {
          const getAddress = (await import("@ethersproject/address"))
            .getAddress;

          const signature =
            await walletConnectInstanceRef.current.signPersonalMessage([
              args.message,
              getAddress(walletConnectInstanceRef.current.session.accounts[0]),
            ]);
          return signature;
        } else if (
          coinbaseMobileSDKInstanceRef.current.connected &&
          coinbaseMobileSDKInstanceRef.current.address
        ) {
          const signature =
            await coinbaseMobileSDKInstanceRef.current.personalSign(
              args.message,
              coinbaseMobileSDKInstanceRef.current.address
            );
          return signature;
        }
      },
    };
  }, [
    connector.connected,
    connector.peerMeta?.name,
    mobileSDK.connected,
    mobileSDK.metadata?.name,
    address,
    walletConnected,
    isMagic,
    walletConnectInstanceRef,
    coinbaseMobileSDKInstanceRef,
  ]);

  if (process.env.E2E) {
    // env variables won't change between renders, so this looks safe

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRandomWallet();
  }

  return result;
};

export { useWallet };
