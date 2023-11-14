import { useOAuthFlow } from "@privy-io/expo";

import { LoginButton } from "./login-button";

export const LoginWithApple = () => {
  const { start } = useOAuthFlow();

  return (
    <LoginButton
      type="apple"
      onPress={async () => {
        start({
          provider: "apple",
          redirectUri: "privy-success",
        });
      }}
    />
  );
};
