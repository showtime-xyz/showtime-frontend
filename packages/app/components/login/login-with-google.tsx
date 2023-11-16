import { useOAuthFlow } from "@privy-io/expo";

import { LoginButton } from "./login-button";

export const LoginWithGoogle = () => {
  const { start } = useOAuthFlow();

  return (
    <LoginButton
      type="google"
      onPress={async () => {
        start({
          provider: "google",
          redirectUri: "privy-success",
        });
      }}
    />
  );
};
