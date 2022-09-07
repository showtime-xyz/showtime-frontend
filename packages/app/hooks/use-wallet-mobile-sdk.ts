import { useContext } from "react";

import { WalletMobileSDKContext } from "app/context/wallet-mobile-sdk-context";

export function useWalletMobileSDK() {
  const context = useContext(WalletMobileSDKContext);

  if (!context) {
    throw "You need to add `WalletMobileSDKProvider` to your root component";
  }

  return context;
}
