import { usePrivy, useWallets } from "@privy-io/react-auth";

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
  const { wallets } = useWallets();
  const fundWallet = (currencyCode: "eth" | "usdc") => {
    return wallets[0].fund({
      config: {
        currencyCode: currencyCode === "usdc" ? "USDC_BASE" : "ETH_BASE",
      },
    });
  };

  return fundWallet;
};
