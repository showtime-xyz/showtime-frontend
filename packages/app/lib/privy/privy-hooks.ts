export { useLoginWithSMS } from "@privy-io/expo";

export const useExportPrivyWallet = () => {
  const exportPrivyWallet = async () => {};
  return exportPrivyWallet;
};

export const usePrivyFundWallet = () => {
  const fundWallet = (currencyCode: "eth" | "usdc") => {};

  return { fundWallet, isAvailable: false };
};

export const usePrivyLoginModal = () => {
  return {
    login: () => {},
  };
};
