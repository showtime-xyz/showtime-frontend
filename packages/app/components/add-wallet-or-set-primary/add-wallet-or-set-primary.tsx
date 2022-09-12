import * as React from "react";
import { useMemo, useState } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Select } from "@showtime-xyz/universal.select";
import { View } from "@showtime-xyz/universal.view";

import { useSetPrimaryWallet } from "app/hooks/api/use-set-primary-wallet";
import { useAddWallet } from "app/hooks/use-add-wallet";
import { useUser } from "app/hooks/use-user";
import { formatAddressShort } from "app/utilities";

export const AddWalletOrSetPrimary = () => {
  const { user } = useUser();
  const { setPrimaryWallet } = useSetPrimaryWallet();
  const { addWallet } = useAddWallet();
  const [selectedWallet, setSelectedWallet] = useState<any>(
    user?.data.profile.wallet_addresses_excluding_email_v2?.[0]?.address ?? null
  );

  const hasWallet =
    user?.data.profile.wallet_addresses_excluding_email_v2 &&
    user.data.profile.wallet_addresses_excluding_email_v2.length > 0;
  const primary = user?.data.profile.primary_wallet;

  const wallets = useMemo(() => {
    return user?.data.profile.wallet_addresses_excluding_email_v2.map(
      (wallet) => {
        return {
          label: formatAddressShort(wallet.address) ?? wallet.address,
          value: wallet.address,
        };
      }
    );
  }, [user]);

  if (!hasWallet) {
    return (
      <View>
        <Button onPress={addWallet}>Add a wallet</Button>
      </View>
    );
  }

  if (!primary) {
    return (
      <View>
        <Select
          options={wallets}
          onChange={setSelectedWallet}
          value={selectedWallet}
        />
        <Button onPress={() => setPrimaryWallet(selectedWallet)}>
          Set primary wallet
        </Button>
      </View>
    );
  }

  return <></>;
};
