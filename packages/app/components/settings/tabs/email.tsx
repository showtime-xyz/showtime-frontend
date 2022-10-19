import { useMemo, useCallback } from "react";
import { Platform, ScrollView } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";

import {
  SettingEmailSlotHeader,
  SettingsEmailSkeletonSlot,
  SettingsEmailSlot,
  SettingsEmailSlotPlaceholder,
} from "../settings-email-slot";
import { SlotSeparator } from "../slot-separator";

const SettingScrollComponent =
  Platform.OS === "web" ? ScrollView : TabScrollView;
export type EmailTabProps = {
  index?: number;
};
export const EmailTab = ({ index = 0 }: EmailTabProps) => {
  const { user } = useUser();
  const router = useRouter();

  const emailWallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => wallet.is_email
      ),
    [user?.data.profile.wallet_addresses_v2]
  );

  const ListEmptyComponent = useCallback(() => {
    const hasNoEmails = Boolean(emailWallets);
    if (hasNoEmails) {
      return <SettingsEmailSlotPlaceholder />;
    }
    return <SettingsEmailSkeletonSlot />;
  }, [emailWallets]);

  return (
    <SettingScrollComponent index={index}>
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
      {emailWallets?.length === 0
        ? ListEmptyComponent()
        : emailWallets?.map((item) => (
            <View key={item.address}>
              <SettingsEmailSlot
                email={item.email}
                address={item.backendAddress}
              />
              <SlotSeparator />
            </View>
          ))}
    </SettingScrollComponent>
  );
};
