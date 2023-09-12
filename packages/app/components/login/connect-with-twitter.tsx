import * as React from "react";
import { Button } from "react-native";

import { authenticateWithTwitter } from "app/lib/social-logins/twitter-auth";

export function ConnectWithTwitter() {
  return (
    <Button
      title="Login"
      onPress={async () => {
        const token = await authenticateWithTwitter();
        console.log("token ", token);
      }}
    />
  );
}
