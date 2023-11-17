import { usePrivy } from "@privy-io/react-auth";

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
