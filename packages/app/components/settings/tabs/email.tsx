import { useEffect, useMemo } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { useUser } from "app/hooks/use-user";
import { WalletAddressesV2 } from "app/types";

import {
  SettingEmailSlotHeader,
  SettingsEmailSkeletonSlot,
  SettingsEmailSlot,
  SettingsEmailSlotPlaceholder,
} from "../settings-email-slot";
import { SlotSeparator } from "../slot-separator";
import { SettingListComponent } from "./index";

export type EmailTabProps = {
  index?: number;
};
export const EmailTab = ({ index = 0 }: EmailTabProps) => {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  const emailWallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => wallet.is_email
      ),
    [user?.data.profile.wallet_addresses_v2]
  );

  const keyExtractor = (wallet: WalletAddressesV2) => wallet.address;

  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated, router]);

  return (
    <SettingListComponent
      data={emailWallets}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <SettingsEmailSlot email={item.email} address={item.backendAddress} />
      )}
      ListEmptyComponent={() => {
        const hasNoEmails = Boolean(emailWallets);
        if (hasNoEmails) {
          return <SettingsEmailSlotPlaceholder />;
        }
        return <SettingsEmailSkeletonSlot />;
      }}
      ListHeaderComponent={
        <SettingEmailSlotHeader
          hasEmail={Boolean(emailWallets?.length)}
          onAddEmail={() =>
            router.push(
              Platform.select({
                native: `/settings/add-email`,
                web: {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    addEmailModal: true,
                  },
                } as any,
              }),
              Platform.select({
                native: `/settings/add-email`,
                web: router.asPath,
              }),
              { scroll: false }
            )
          }
        />
      }
      ItemSeparatorComponent={() => <SlotSeparator />}
      index={index}
    />
  );
};
