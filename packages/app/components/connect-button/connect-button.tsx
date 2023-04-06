import { LoginButton } from "app/components/login/login-button";

export type ConnectButtonProps = {
  handleSubmitWallet: () => void;
};

export const ConnectButton: React.FC<ConnectButtonProps> = (
  props: ConnectButtonProps
) => {
  return (
    <LoginButton onPress={() => props.handleSubmitWallet()} type="wallet" />
  );
};
