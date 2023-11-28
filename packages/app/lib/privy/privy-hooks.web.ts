import { usePrivy, useWallets } from "@privy-io/react-auth";

import { useWallet } from "app/hooks/use-wallet";

export const useLoginWithSMS = () => {
  return {
    loginWithCode: () => {},
    sendCode: () => {},
  };
};

export const useExportPrivyWallet = () => {
  const { exportWallet } = usePrivy();
  return exportWallet;
};

export const usePrivyFundWallet = () => {
  const wallets = useWallets();
  const wallet = useWallet();
  const fundWallet = (currencyCode: "eth" | "usdc") => {
    return wallets.wallets
      .find((w) => w.walletClientType === "privy")
      ?.fund({
        config: {
          currencyCode: currencyCode === "usdc" ? "USDC_BASE" : "ETH_BASE",
        },
      });
  };

  return {
    fundWallet,
    isAvailable: wallet?.walletClientType === "privy",
  };
};
