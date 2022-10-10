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
  return <Button onPress={connect}>I already have a wallet</Button>;
};
