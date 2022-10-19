import { useMemo, useCallback } from "react";
import { Platform, ScrollView } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import {
  SettingPhoneNumberSlotHeader,
  SettingsPhoneNumberSkeletonSlot,
  SettingsPhoneNumberSlot,
  SettingsPhoneNumberSlotPlaceholder,
} from "app/components/settings/settings-phone-number-slot";
import { SlotSeparator } from "app/components/settings/slot-separator";
import { useUser } from "app/hooks/use-user";

const SettingScrollComponent =
  Platform.OS === "web" ? ScrollView : TabScrollView;

export type PhoneTabProps = {
  index?: number;
};
export const PhoneTab = ({ index = 0 }: PhoneTabProps) => {
  const { user } = useUser();
  const router = useRouter();

  const phoneNumberWallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => wallet.is_phone
      ),
    [user?.data.profile.wallet_addresses_v2]
  );

  const ListEmptyComponent = useCallback(() => {
    const hasNoPhoneNumbers = Boolean(phoneNumberWallets);
    if (hasNoPhoneNumbers) {
      return <SettingsPhoneNumberSlotPlaceholder />;
    }
    return <SettingsPhoneNumberSkeletonSlot />;
  }, [phoneNumberWallets]);

  return (
    <SettingScrollComponent style={{ height: "100%" }} index={index}>
      <SettingPhoneNumberSlotHeader
        hasPhoneNumber={Boolean(phoneNumberWallets?.length)}
        onVerifyPhoneNumber={() =>
          router.push(
            Platform.select({
              native: `/settings/verify-phone-number`,
              web: {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  verifyPhoneNumberModal: true,
                },
              } as any,
            }),
            Platform.select({
              native: `/settings/verify-phone-number`,
              web: router.asPath,
            }),
            { scroll: false }
          )
        }
      />
      {phoneNumberWallets?.length === 0 ? (
        ListEmptyComponent()
      ) : (
        <View>
          {phoneNumberWallets?.map((item) => (
            <View key={item.address}>
              <SettingsPhoneNumberSlot
                phoneNumber={item.phone_number}
                address={item.address}
              />
              <SlotSeparator />
            </View>
          ))}
        </View>
      )}
    </SettingScrollComponent>
  );
};
