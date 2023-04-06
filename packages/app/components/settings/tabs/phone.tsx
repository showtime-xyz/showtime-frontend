import { useMemo } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { SettingsPhoneNumberItem } from "app/components/settings/settings-phone-number-item";
import { useUser } from "app/hooks/use-user";

import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

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

  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Phone Number"
        desc="Manage your phone number by connecting a phone number to your profile."
        buttonText={phoneNumberWallets?.length ? "" : "Verify phone number"}
        onPress={() =>
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
        <EmptyPlaceholder
          tw="min-h-[60px] px-4"
          title="No phone number connected to your profile."
        />
      ) : (
        phoneNumberWallets?.map((item) => (
          <SettingsPhoneNumberItem
            phoneNumber={item.phone_number}
            address={item.address}
            key={item.address}
          />
        ))
      )}
    </SettingScrollComponent>
  );
};
