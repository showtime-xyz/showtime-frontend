import { useState, useEffect, useMemo, useRef } from "react";

import type { Bytes } from "@ethersproject/bytes";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { useWeb3 } from "app/hooks/use-web3";

import { ConnectResult, UseWalletReturnType } from "./types";
import { useRandomWallet } from "./use-random-wallet";

const useWallet = (): UseWalletReturnType => {
  const walletConnectedPromiseResolveCallback = useRef<any>(null);
  const connector = useWalletConnect();
  const walletConnectInstanceRef = useRef(connector);
  const isWalletConnectConnected = useRef<boolean>();
  const isCoinbaseConnectedRef = useRef<boolean>();
  const { web3, isMagic, magicWalletAddress } = useWeb3();
  const mobileSDK = useWalletMobileSDK();
  const [address, setAddress] = useState<string | undefined>();
  const addressRef = useRef<string | undefined>();

  const walletConnected = connector.connected || mobileSDK.connected;

  useEffect(() => {
    isWalletConnectConnected.current = connector.connected;
    isCoinbaseConnectedRef.current = mobileSDK.connected;
    addressRef.current = address;
    walletConnectInstanceRef.current = connector;
  });

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

  useEffect(() => {
    if (
      walletConnectedPromiseResolveCallback.current &&
      walletConnected &&
      address
    ) {
      walletConnectedPromiseResolveCallback.current({
        address: address,
        walletName: connector.peerMeta?.name,
      });
      walletConnectedPromiseResolveCallback.current = null;
    }
  }, [walletConnected, address, connector.peerMeta?.name]);

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
        connector.connect();
        return new Promise<ConnectResult>((resolve) => {
          walletConnectedPromiseResolveCallback.current = resolve;
        });
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
      connected: walletConnected || isMagic,
      networkChanged: undefined,
      signMessageAsync: async (args: { message: string | Bytes }) => {
        if (isWalletConnectConnected.current) {
          const signature =
            await walletConnectInstanceRef.current.signPersonalMessage([
              args.message,
              addressRef.current,
            ]);
          return signature;
        } else if (isCoinbaseConnectedRef.current && addressRef.current) {
          const signature = await mobileSDK.personalSign(
            args.message,
            addressRef.current
          );
          return signature;
        }
      },
    };
  }, [address, connector, isMagic, mobileSDK, walletConnected]);

  if (process.env.E2E) {
    // env variables won't change between renders, so this looks safe

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRandomWallet();
  }

  return result;
};

export { useWallet };
