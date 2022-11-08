import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { LoginButton } from "app/components/login/login-button";

export type ConnectButtonProps = {
  handleSubmitWallet: ({
    onOpenConnectModal,
  }: {
    onOpenConnectModal: () => void;
  }) => void;
};

export const ConnectButton: React.FC<ConnectButtonProps> = () => {
  const { connect } = useWalletConnect();
  return <LoginButton onPress={() => connect()} type="wallet" />;
};
