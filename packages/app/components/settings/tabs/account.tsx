import { useMemo, useContext } from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Spotify,
  Apple,
  GoogleOriginal,
  Twitter,
  AppleMusic,
  InstagramColorful,
} from "@showtime-xyz/universal.icon";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { UserContext } from "app/context/user-context";
import { useAddMagicSocialAccount } from "app/hooks/use-add-magic-social-account";
import { useConnectAppleMusic } from "app/hooks/use-connect-apple-music";
import { useConnectSpotify } from "app/hooks/use-connect-spotify";
import { useDisconnectAppleMusic } from "app/hooks/use-disconnect-apple-music";
import { useDisconnectInstagram } from "app/hooks/use-disconnect-instagram";
import { useDisconnectSpotify } from "app/hooks/use-disconnect-spotify";
import { useDisconnectTwitter } from "app/hooks/use-disconnect-twitter";
import { useListSocialAccounts } from "app/hooks/use-list-social-accounts";
import { useManageAccount } from "app/hooks/use-manage-account";
import { useUser } from "app/hooks/use-user";

import { toast } from "design-system/toast";

import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export type AccountTabProps = {
  index?: number;
};

export const AccountTab = ({ index = 0 }: AccountTabProps) => {
  const accounts = useListSocialAccounts();
  const instagramProviderId = accounts.data?.find?.(
    (v) => v.provider === "instagram"
  )?.provider_account_id;
  const twitterProviderId = accounts.data?.find?.(
    (v) => v.provider === "twitter"
  )?.provider_account_id;
  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Connected Accounts"
        desc="Manage the accounts connected to your profile."
        descTw="mt-1"
      />
      <View tw="mt-6 px-4 lg:px-0">
        <ConnectSpotify />
        <ConnectAppleMusic />
        <WalletSocialAccounts />
        <ConnectInstagram providerId={instagramProviderId} />
        <ConnectTwitter providerId={twitterProviderId} />
      </View>
    </SettingScrollComponent>
  );
};

const ConnectSpotify = () => {
  const user = useContext(UserContext);

  const { disconnectSpotify } = useDisconnectSpotify();
  const { connectSpotify } = useConnectSpotify();

  return (
    <View tw="space-between flex-row items-center justify-between py-2 md:py-3.5">
      <View tw="flex-row items-center">
        <Spotify height={20} width={20} color={colors.spotify} />
        <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-gray-100">
          Spotify
        </Text>
      </View>
      <Button
        variant={
          user?.user?.data.profile.has_spotify_token ? "danger" : "tertiary"
        }
        onPress={async () => {
          if (user?.user?.data.profile.has_spotify_token) {
            disconnectSpotify();
          } else {
            const res = await connectSpotify();
            if (res) {
              toast.success("Spotify connected");
            }
          }
        }}
      >
        {user?.user?.data.profile.has_spotify_token ? "Disconnect" : "Connect"}
      </Button>
    </View>
  );
};

const ConnectAppleMusic = () => {
  const user = useContext(UserContext);
  const isDark = useIsDarkMode();

  const { disconnectAppleMusic, isMutating: isDisconnecting } =
    useDisconnectAppleMusic();
  const { connectAppleMusic, isMutating: isConnecting } =
    useConnectAppleMusic();

  const isLoading = isConnecting || isDisconnecting;

  return (
    <View tw="space-between flex-row items-center justify-between py-2 md:py-3.5">
      <View tw="flex-row items-center">
        <AppleMusic height={20} width={20} color={isDark ? "white" : "black"} />
        <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-gray-100">
          Apple Music
        </Text>
      </View>
      <Button
        variant={
          user?.user?.data.profile.has_apple_music_token ? "danger" : "tertiary"
        }
        disabled={isLoading}
        onPress={async () => {
          if (user?.user?.data.profile.has_apple_music_token) {
            disconnectAppleMusic();
          } else {
            const res = await connectAppleMusic();
            if (res) {
              toast.success("Apple Music connected");
            }
          }
        }}
      >
        {isLoading
          ? "Loading..."
          : user?.user?.data.profile.has_apple_music_token
          ? "Disconnect"
          : "Connect"}
      </Button>
    </View>
  );
};

export const ConnectInstagram = ({ providerId }: { providerId?: string }) => {
  const isDark = useIsDarkMode();
  const user = useUser();

  const { trigger: disconnectInstagram, isMutating: isDisconnecting } =
    useDisconnectInstagram();
  const { trigger: addSocial, isMutating: isConnecting } =
    useAddMagicSocialAccount();

  return (
    <View tw="space-between flex-row items-center justify-between py-2 md:py-3.5">
      <View tw="flex-row items-center">
        <InstagramColorful
          height={25}
          width={25}
          color={isDark ? "#fff" : "#000"}
        />
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
          if (
            user.user?.data.profile.social_login_connections.instagram &&
            providerId
          ) {
            disconnectInstagram({
              provider: "instagram",
              providerId,
            }).catch(() => {});
          } else {
            addSocial({ type: "instagram" }).catch(() => {});
          }
        }}
      >
        {isDisconnecting || isConnecting
          ? "Loading..."
          : user.user?.data.profile.social_login_connections.instagram
          ? "Disconnect"
          : "Connect"}
      </Button>
    </View>
  );
};

export const ConnectTwitter = ({ providerId }: { providerId?: string }) => {
  const isDark = useIsDarkMode();
  const user = useUser();

  const { trigger: disconnectTwitter, isMutating: isDisconnecting } =
    useDisconnectTwitter();
  const { trigger: addSocial, isMutating: isConnecting } =
    useAddMagicSocialAccount();

  return (
    <View tw="space-between flex-row items-center justify-between py-2 md:py-3.5">
      <View tw="flex-row items-center">
        <Twitter height={25} width={25} color={isDark ? "#fff" : "#000"} />
        <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-gray-100">
          Twitter
        </Text>
      </View>
      <Button
        variant={
          user.user?.data.profile.social_login_connections.twitter
            ? "danger"
            : "tertiary"
        }
        onPress={() => {
          if (
            user.user?.data.profile.social_login_connections.twitter &&
            providerId
          ) {
            disconnectTwitter({
              providerId,
            }).catch(() => {});
          } else {
            addSocial({ type: "twitter" }).catch(() => {});
          }
        }}
      >
        {isDisconnecting || isConnecting
          ? "Loading..."
          : user.user?.data.profile.social_login_connections.twitter
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
];

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
      {socialAccounts.map((item) => {
        const Icon = item.Icon;
        return (
          <View
            key={item.type}
            tw="space-between flex-row items-center justify-between py-2 md:py-3.5"
          >
            <View tw="flex-row items-center">
              <Icon
                height={20}
                width={20}
                color={item.color ?? (isDark ? "#fff" : "#000")}
              />
              <Text tw="ml-2.5 text-base font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </Text>
            </View>
            <SocialConnectButton
              connected={connected}
              type={item.type as SocialConnectButtonProps["type"]}
            />
          </View>
        );
      })}
    </>
  );
};

type SocialConnectButtonProps = {
  connected: {
    google: { address: string };
    apple: { address: string };
  };
  type: "google" | "apple";
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
