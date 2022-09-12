import * as React from "react";
import { Text } from "react-native";

import { useUser } from "app/hooks/use-user";

export const AddWalletOrSetPrimary = () => {
  const { user } = useUser();

  const hasWallet =
    user?.data.profile.wallet_addresses_excluding_email_v2 &&
    user.data.profile.wallet_addresses_excluding_email_v2.length > 0;

  const primary = user?.data.profile.primary_wallet;

  if (!primary) {
    return <Text>Set primary wallet</Text>;
  }

  if (!hasWallet) {
    return <Text>add wallet</Text>;
  }

  return <></>;
};
