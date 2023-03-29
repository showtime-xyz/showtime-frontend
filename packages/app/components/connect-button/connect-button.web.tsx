import { LoginButton } from "app/components/login/login-button";

import { ConnectButtonProps } from "./connect-button";

export const ConnectButton = ({ handleSubmitWallet }: ConnectButtonProps) => {
  return <LoginButton onPress={() => handleSubmitWallet()} type="wallet" />;
};
