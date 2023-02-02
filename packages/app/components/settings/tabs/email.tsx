import { useMemo } from "react";
import { Platform } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { useUser } from "app/hooks/use-user";

import { SettingsEmailItem } from "../settings-email-item";
import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;
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

  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Email"
        desc="Manage your email by connecting an email address to your profile."
        buttonText={emailWallets?.length ? "" : "Connect email address"}
        onPress={() =>
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
      {emailWallets?.length === 0 ? (
        <EmptyPlaceholder
          tw="h-full min-h-[60px] px-4"
          title="No email connected to your profile."
        />
      ) : (
        emailWallets?.map((item) => (
          <SettingsEmailItem
            email={item.email}
            address={item.backendAddress}
            key={item.address}
          />
        ))
      )}
    </SettingScrollComponent>
  );
};
