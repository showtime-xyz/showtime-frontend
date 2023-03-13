import { useMemo } from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Spotify,
  Apple,
  GoogleOriginal,
  Twitter,
  Instagram,
} from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAddMagicSocialAccount } from "app/hooks/use-add-magic-social-account";
import { useConnectSpotify } from "app/hooks/use-connect-spotify";
import { useDisconnectInstagram } from "app/hooks/use-disconnect-instagram";
import { useDisconnectSpotify } from "app/hooks/use-disconnect-spotify";
import { useListSocialAccounts } from "app/hooks/use-list-social-accounts";
import { useManageAccount } from "app/hooks/use-manage-account";
import { useUser } from "app/hooks/use-user";

import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export type AccountTabProps = {
  index?: number;
};

export const AccountTab = ({ index = 0 }: AccountTabProps) => {
  const accounts = useListSocialAccounts();
  const instagramProviderId = accounts.data?.find(
    (v) => v.provider === "instagram"
  )?.provider_account_id;
  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Connected Accounts"
        desc="Manage the accounts connected to your profile."
      />
      <View tw="mt-6 px-4 md:px-0">
        <ConnectSpotify />
        <WalletSocialAccounts />
        {instagramProviderId ? (
          <ConnectInstagram providerId={instagramProviderId} />
        ) : null}
      </View>
    </SettingScrollComponent>
  );
};

const ConnectSpotify = () => {
  const user = useUser();

  const { disconnectSpotify } = useDisconnectSpotify();
  const { connectSpotify } = useConnectSpotify();

  return (
    <View tw="space-between flex-row items-center justify-between py-2 md:py-3.5">
      <View tw="flex-row items-center">
        <Spotify height={25} width={25} color={colors.spotify} />
        <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-gray-100">
          Spotify
        </Text>
      </View>
      <Button
        variant={
          user.user?.data.profile.has_spotify_token ? "danger" : "tertiary"
        }
        onPress={() => {
          if (user.user?.data.profile.has_spotify_token) {
            disconnectSpotify();
          } else {
            connectSpotify();
          }
        }}
      >
        {user.user?.data.profile.has_spotify_token ? "Disconnect" : "Connect"}
      </Button>
    </View>
  );
};

const ConnectInstagram = ({ providerId }: { providerId: string }) => {
  const user = useUser();
  const isDark = useIsDarkMode();

  const { trigger: disconnectInstagram } = useDisconnectInstagram();
  const { trigger: addSocial } = useAddMagicSocialAccount();

  return (
    <View tw="space-between flex-row items-center justify-between py-2 md:py-3.5">
      <View tw="flex-row items-center">
        <Instagram height={25} width={25} color={isDark ? "#fff" : "#000"} />
        <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-gray-100">
          Instagram
        </Text>
      </View>
      <Button
        variant={
          user.user?.data.profile.social_login_connections.instagram
            ? "danger"
            : "tertiary"
        }
        onPress={() => {
          if (user.user?.data.profile.social_login_connections.instagram) {
            disconnectInstagram({
              provider: "instagram",
              providerId,
            });
          } else {
            addSocial({ type: "instagram" });
          }
        }}
      >
        {user.user?.data.profile.social_login_connections.instagram
          ? "Disconnect"
          : "Connect"}
      </Button>
    </View>
  );
};

const socialAccounts = [
  {
    Icon: Apple,
    type: "apple",
    name: "Apple",
  },
  {
    Icon: GoogleOriginal,
    type: "google",
    name: "Google",
  },
  {
    Icon: Twitter,
    type: "twitter",
    name: "Twitter",
  },
] as const;

const WalletSocialAccounts = () => {
  const isDark = useIsDarkMode();

  const wallet = useUser().user?.data.profile.wallet_addresses_v2;

  const connected = useMemo(() => {
    let twitter = { address: "" };
    let google = { address: "" };
    let apple = { address: "" };
    wallet?.forEach((v) => {
      if (v.is_apple) {
        apple.address = v.address;
      }
      if (v.is_google) {
        google.address = v.address;
      }
      if (v.is_twitter) {
        twitter.address = v.address;
      }
    });
    return {
      twitter,
      google,
      apple,
    } as SocialConnectButtonProps["connected"];
  }, [wallet]);

  return (
    <>
      {socialAccounts.map((type) => {
        const Icon = type.Icon;
        return (
          <View
            key={type.type}
            tw="space-between flex-row items-center justify-between py-2 md:py-3.5"
          >
            <View tw="flex-row items-center">
              <Icon height={20} width={20} color={isDark ? "#fff" : "#000"} />
              <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-gray-100">
                {type.name}
              </Text>
            </View>
            <SocialConnectButton connected={connected} type={type.type} />
          </View>
        );
      })}
    </>
  );
};

type SocialConnectButtonProps = {
  connected: {
    twitter: { address: string };
    google: { address: string };
    apple: { address: string };
  };
  type: "twitter" | "google" | "apple";
};

const SocialConnectButton = ({ connected, type }: SocialConnectButtonProps) => {
  const { removeAccount } = useManageAccount();
  const { trigger: addSocial, isMutating } = useAddMagicSocialAccount();
  return (
    <Button
      disabled={isMutating}
      variant={connected[type]?.address ? "danger" : "tertiary"}
      onPress={async () => {
        if (connected[type]?.address) {
          removeAccount(connected[type]?.address);
        } else {
          addSocial({
            type,
          });
        }
      }}
    >
      {isMutating
        ? "Loading..."
        : connected[type]?.address
        ? "Disconnect"
        : "Connect"}
    </Button>
  );
};
