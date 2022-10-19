import { useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { WalletAddressesV2 } from "app/types";

import {
  SettingPhoneNumberSlotHeader,
  SettingsPhoneNumberSkeletonSlot,
  SettingsPhoneNumberSlot,
  SettingsPhoneNumberSlotPlaceholder,
} from "../settings-phone-number-slot";
import { SlotSeparator } from "../slot-separator";
import { SettingScrollComponent } from "./index";

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

  const keyExtractor = (wallet: WalletAddressesV2) => wallet.address;

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
