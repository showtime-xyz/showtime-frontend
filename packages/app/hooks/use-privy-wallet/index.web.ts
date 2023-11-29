import { useMemo } from "react";

import { useWallets, usePrivy } from "@privy-io/react-auth";

export const usePrivyWallet = () => {
  const wallets = useWallets();
  const privy = usePrivy();
  const privyConnectedWallet = useMemo(() => {
    if (typeof localStorage !== "undefined" && privy.authenticated) {
      const loginMethod = localStorage.getItem("loginMethod");
      if (loginMethod === "wallet") {
        const wallet = wallets?.wallets?.find((wallet) => {
          return wallet.walletClientType !== "privy";
        });
        return wallet;
      } else {
        return wallets.wallets[0];
      }
    }
  }, [privy.authenticated, wallets.wallets]);
  console.log("privyConnectedWallet", privyConnectedWallet);

  return privyConnectedWallet;
};
