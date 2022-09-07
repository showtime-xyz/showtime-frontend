import { useCallback, useRef, useState, useEffect } from "react";

import {
  initiateHandshake,
  makeRequest,
  isConnected,
  resetSession,
} from "@coinbase/wallet-mobile-sdk";
import { ethers } from "ethers";
import { MMKV } from "react-native-mmkv";

import { WalletMobileSDKContext } from "app/context/wallet-mobile-sdk-context";

const CB_WALLET_METADATA = {
  name: "Coinbase Wallet",
};

const CACHED_ADDRESS_KEY = "mobile_sdk.address";
const storage = new MMKV();

type OnConnectedListener = (success: boolean) => void;

interface WalletMobileSDKProviderProps {
  children: React.ReactNode;
}

export function WalletMobileSDKProvider({
  children,
}: WalletMobileSDKProviderProps) {
  const onConnectedListenerRef = useRef<OnConnectedListener | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      const action = {
        method: "eth_requestAccounts",
        params: {},
      };
      const [, account] = await initiateHandshake([action]);

      if (account && account.address) {
        setConnected(true);
        setAddress(account.address);
        storage.set(CACHED_ADDRESS_KEY, account.address);
        onConnectedListenerRef.current?.(true);
      } else {
        onConnectedListenerRef.current?.(false);
      }
    } catch (error) {
      resetSession();
      setAddress(null);
      setConnected(false);
      onConnectedListenerRef.current?.(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    resetSession();
    setConnected(false);
    setAddress(null);
    storage.delete(CACHED_ADDRESS_KEY);
  }, []);

  const onConnected = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      onConnectedListenerRef.current = (success) => {
        if (success) {
          resolve();
        } else {
          reject();
        }

        onConnectedListenerRef.current = null;
      };
    });
  }, []);

  const personalSign = useCallback(
    async (message: string | ethers.utils.Bytes, address: string) => {
      const action = {
        method: "personal_sign",
        params: {
          address,
          message,
        },
      };
      const [res] = await makeRequest([action]);
      if (res.result) {
        return JSON.parse(res.result);
      } else {
        throw new Error(res.errorMessage ?? "Personal sign failed");
      }
    },
    []
  );

  useEffect(() => {
    setConnected(isConnected());
    setAddress(storage.getString(CACHED_ADDRESS_KEY) ?? null);
  }, []);

  return (
    <WalletMobileSDKContext.Provider
      value={{
        address,
        connected,
        metadata: connected ? CB_WALLET_METADATA : null,
        onConnected,
        connect,
        disconnect,
        personalSign,
      }}
    >
      {children}
    </WalletMobileSDKContext.Provider>
  );
}
