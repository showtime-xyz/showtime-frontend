import { useMemo } from "react";
import { Platform } from "react-native";

import { usePrivy } from "@privy-io/react-auth";

import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { SettingsPhoneNumberItem } from "app/components/settings/settings-phone-number-item.web";
import { useUser } from "app/hooks/use-user";

import { SettingItemSeparator } from "../setting-item-separator";
import { SettingsEmailItem } from "../settings-email-item.web";
import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export type PhoneTabProps = {
  index?: number;
};
export const SignInTab = ({ index = 0 }: PhoneTabProps) => {
  const { user } = useUser();
  const { linkPhone, user: privyUser, linkEmail } = usePrivy();

  const phoneLinkedAccount = useMemo(() => {
    return privyUser?.linkedAccounts.find(
      (account) => account.type === "phone"
    );
  }, [privyUser?.linkedAccounts]);

  const emailLinkedAccount = useMemo(() => {
    return privyUser?.linkedAccounts.find(
      (account) => account.type === "email"
    );
  }, [privyUser?.linkedAccounts]);

  const emailWallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => wallet.is_email
      ),
    [user?.data.profile.wallet_addresses_v2]
  );

  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Phone Number"
        desc="Manage your phone number by connecting a phone number to your profile."
        buttonText={phoneLinkedAccount ? "" : "Verify phone number"}
        onPress={linkPhone}
      />

      {!phoneLinkedAccount ? (
        <EmptyPlaceholder
          tw="min-h-[60px] px-4"
          title="No phone number connected to your profile."
        />
      ) : (
        <SettingsPhoneNumberItem phoneNumber={phoneLinkedAccount.number} />
      )}
      <SettingItemSeparator tw="my-8" />

      <SettingsTitle
        title="Email"
        desc="Manage your email by connecting an email address to your profile."
        buttonText={emailLinkedAccount ? "" : "Connect email address"}
        onPress={linkEmail}
      />
      {!emailLinkedAccount ? (
        <EmptyPlaceholder
          tw="min-h-[60px] px-4"
          title="No email connected to your profile."
        />
      ) : (
        <SettingsEmailItem email={emailLinkedAccount.address} />
      )}
    </SettingScrollComponent>
  );
};
