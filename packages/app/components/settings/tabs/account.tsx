import { useMemo, useEffect } from "react";
import { Platform, ScrollView } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Twitter,
  Spotify,
  Apple,
  GoogleOriginal,
} from "@showtime-xyz/universal.icon";
import { Switch } from "@showtime-xyz/universal.switch";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useConnectSpotify } from "app/hooks/use-connect-spotify";
import { useDisconnectSpotify } from "app/hooks/use-disconnect-spotify";
import { useManageAccount } from "app/hooks/use-manage-account";
import { useUser } from "app/hooks/use-user";
import { useMagicSocialAuth } from "app/lib/social-logins";
import { createParam } from "app/navigation/use-param";

import {
  AccountSettingItem,
  SettingAccountSlotFooter,
  SettingAccountSlotHeader,
} from "../settings-account-slot";

const SettingScrollComponent =
  Platform.OS === "web" ? ScrollView : TabScrollView;

export type AccountTabProps = {
  index?: number;
};

export const AccountTab = ({ index = 0 }: AccountTabProps) => {
  const accountSettings = useMemo(
    () => [
      {
        id: 1,
        title: "Privacy & Security",
        icon: "lock",
        subRoute: "privacy-and-security",
      },
    ],
    []
  );

  return (
    <SettingScrollComponent index={index}>
      <SettingAccountSlotHeader />
      {accountSettings?.length > 0 &&
        accountSettings.map((item) => (
          <AccountSettingItem {...item} key={item.id} />
        ))}
      <ConnectSpotify redirectUri={"/settings?tab=" + index} />
      <ConnectTwitter redirectUri={"/settings?tab=" + index} />
      <ConnectGoogle redirectUri={"/settings?tab=" + index} />
      <ConnectApple redirectUri={"/settings?tab=" + index} />
      <SettingAccountSlotFooter />
    </SettingScrollComponent>
  );
};

type ConnectSocialProps = {
  redirectUri: string;
};

const ConnectSpotify = ({ redirectUri }: ConnectSocialProps) => {
  const user = useUser();

  const { disconnectSpotify } = useDisconnectSpotify();
  const { connectSpotify } = useConnectSpotify();
  const isDark = useIsDarkMode();

  return (
    <View tw="space-between mb-4 flex-row items-center justify-between px-4">
      <View tw="flex-row items-center">
        <Spotify height={32} width={32} color={isDark ? "#fff" : "#000"} />
        <Text tw="text-md mx-2 font-bold text-gray-900 dark:text-gray-100">
          Spotify Connected
        </Text>
      </View>
      <Switch
        checked={user.user?.data.profile.has_spotify_token}
        onChange={() => {
          if (user.user?.data.profile.has_spotify_token) {
            disconnectSpotify();
          } else {
            connectSpotify(redirectUri);
          }
        }}
      />
    </View>
  );
};

const { useParam } = createParam<{ did: string }>();

const ConnectTwitter = ({ redirectUri }: ConnectSocialProps) => {
  const { performMagicAuthWithTwitter } = useMagicSocialAuth();
  const { removeAccount } = useManageAccount();
  const wallets = useUser().user?.data.profile.wallet_addresses_v2;
  console.log("Wallets ", wallets);
  const isDark = useIsDarkMode();
  const [did] = useParam("did");

  // Web will redirect back here with a did param
  useEffect(() => {
    console.log("didid ", did);
    if (did) {
      // addAccount(did);
    }
  }, [did]);

  const hasTwitterAccountConnected = false;

  return (
    <View tw="space-between mb-4 flex-row items-center justify-between px-4">
      <View tw="flex-row items-center">
        <Twitter height={32} width={32} color={isDark ? "#fff" : "#000"} />
        <Text tw="text-md mx-2 font-bold text-gray-900 dark:text-gray-100">
          Twitter Connected
        </Text>
      </View>
      <Switch
        checked={hasTwitterAccountConnected}
        onChange={async () => {
          if (hasTwitterAccountConnected) {
            // removeAccount(address)
          } else {
            if (Platform.OS === "web") {
              performMagicAuthWithTwitter({ redirectUri });
            } else {
              const res = await performMagicAuthWithTwitter();
              console.log("dide ", res);
            }
          }
        }}
      />
    </View>
  );
};

const ConnectGoogle = ({ redirectUri }: ConnectSocialProps) => {
  const { performMagicAuthWithGoogle } = useMagicSocialAuth();
  const isDark = useIsDarkMode();
  const { removeAccount } = useManageAccount();
  const [did] = useParam("did");

  // Web will redirect back here with a did param
  useEffect(() => {
    console.log("didid ", did);
    if (did) {
      // addAccount(did);
    }
  }, [did]);

  const isGoogleAccountConnected = false;

  return (
    <View tw="space-between mb-4 flex-row items-center justify-between px-4">
      <View tw="flex-row items-center">
        <GoogleOriginal
          height={32}
          width={32}
          color={isDark ? "#fff" : "#000"}
        />
        <Text tw="text-md mx-2 font-bold text-gray-900 dark:text-gray-100">
          Google Connected
        </Text>
      </View>
      <Switch
        checked={isGoogleAccountConnected}
        onChange={async () => {
          if (isGoogleAccountConnected) {
            // removeAccount(address)
          } else {
            if (Platform.OS === "web") {
              performMagicAuthWithGoogle({ redirectUri });
            } else {
              const res = await performMagicAuthWithGoogle();
              console.log("dide ", res);
            }
          }
        }}
      />
    </View>
  );
};

const ConnectApple = ({ redirectUri }: ConnectSocialProps) => {
  const { performMagicAuthWithApple } = useMagicSocialAuth();
  const isDark = useIsDarkMode();
  const { removeAccount } = useManageAccount();

  const [did] = useParam("did");

  // Web will redirect back here with a did param
  useEffect(() => {
    console.log("didid ", did);
    if (did) {
      // addAccount(did);
    }
  }, [did]);
  const isGoogleAppleConnected = false;

  return (
    <View tw="space-between mb-4 flex-row items-center justify-between px-4">
      <View tw="flex-row items-center">
        <Apple height={32} width={32} color={isDark ? "#fff" : "#000"} />
        <Text tw="text-md mx-2 font-bold text-gray-900 dark:text-gray-100">
          Apple Connected
        </Text>
      </View>
      <Switch
        checked={isGoogleAppleConnected}
        onChange={async () => {
          if (isGoogleAppleConnected) {
            // removeAccount(address)
          } else {
            if (Platform.OS === "web") {
              performMagicAuthWithApple({ redirectUri });
            } else {
              const res = await performMagicAuthWithApple();
              console.log("dide ", res);
            }
          }
        }}
      />{" "}
    </View>
  );
};
