import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { Button } from "@showtime-xyz/universal.button";

export type ConnectButtonProps = {
  handleSubmitWallet: ({
    onOpenConnectModal,
  }: {
    onOpenConnectModal: () => void;
  }) => void;
};

export const ConnectButton = () => {
  const { connect } = useWalletConnect();
  return <Button onPress={connect}>Connect Wallet</Button>;
};
