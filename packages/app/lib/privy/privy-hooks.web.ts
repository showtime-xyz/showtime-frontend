import { usePrivy } from "@privy-io/react-auth";

import { usePrivyWallet } from "app/hooks/use-privy-wallet";

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
  const wallet = usePrivyWallet();
  const fundWallet = (currencyCode: "eth" | "usdc") => {
    // @ts-ignore Privy native types are not compatible with web types
    return wallet.fund({
      config: {
        currencyCode: currencyCode === "usdc" ? "USDC_BASE" : "ETH_BASE",
      },
    });
  };

  return {
    fundWallet,
    isAvailable: true,
  };
};

export const usePrivyLoginModal = () => {
  const privy = usePrivy();
  return {
    login: privy.login,
  };
};
