import { useMemo, useEffect, useRef } from "react";
import { Platform, ScrollView } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Spotify, Apple, GoogleOriginal } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
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
      <WalletSocialAccounts redirectUri={"/settings?tab=" + index} />
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
          Spotify
        </Text>
      </View>
      <Button
        // variant={
        //   user.user?.data.profile.has_spotify_token ? "danger" : "primary"
        // }
        onPress={() => {
          if (user.user?.data.profile.has_spotify_token) {
            disconnectSpotify();
          } else {
            connectSpotify(redirectUri);
          }
        }}
      >
        {user.user?.data.profile.has_spotify_token ? "Disconnect" : "Connect"}
      </Button>
    </View>
  );
};

const { useParam } = createParam<{ did: string; type: string }>();

const socialAccounts = [
  {
    Icon: GoogleOriginal,
    type: "google",
    name: "Google",
  },
  // {
  //   Icon: Twitter,
  //   type: "twitter",
  //   name: "Twitter",
  // },
  {
    Icon: Apple,
    type: "apple",
    name: "Apple",
  },
] as const;

const WalletSocialAccounts = ({ redirectUri }: ConnectSocialProps) => {
  const {
    performMagicAuthWithGoogle,
    performMagicAuthWithApple,
    performMagicAuthWithTwitter,
  } = useMagicSocialAuth();
  const isDark = useIsDarkMode();
  const { addSocial, removeAccount } = useManageAccount();
  const [did, setDid] = useParam("did");
  const [type, setType] = useParam("type");
  const wallet = useUser().user?.data.profile.wallet_addresses_v2;

  const requestSent = useRef(false);
  const router = useRouter();
  // Web will redirect back here with a did param
  useEffect(() => {
    if (did && type && !requestSent.current) {
      addSocial(did, type as any);
      setDid(undefined);
      setType(undefined);
      requestSent.current = true;
    }
  }, [did, addSocial, type, router, setDid, setType]);

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
    };
  }, [wallet]);

  return (
    <>
      {socialAccounts.map((type) => {
        const Icon = type.Icon;
        return (
          <View
            key={type.type}
            tw="space-between mb-4 flex-row items-center justify-between px-4"
          >
            <View tw="flex-row items-center">
              <Icon height={32} width={32} color={isDark ? "#fff" : "#000"} />
              <Text tw="text-md mx-2 font-bold text-gray-900 dark:text-gray-100">
                {type.name}
              </Text>
            </View>
            <Button
              // variant={connected[type.type].address ? "danger" : "primary"}
              onPress={async () => {
                if (connected[type.type].address) {
                  removeAccount(connected[type.type].address);
                } else {
                  if (Platform.OS === "web") {
                    const _redirectUri = {
                      redirectUri: redirectUri + "&type=" + type.type,
                    };
                    if (type.type === "google") {
                      performMagicAuthWithGoogle(_redirectUri);
                      //@ts-ignore TODO: fix this when twitter is added
                    } else if (type.type === "twitter") {
                      performMagicAuthWithTwitter(_redirectUri);
                    } else if (type.type === "apple") {
                      performMagicAuthWithApple(_redirectUri);
                    }
                  } else {
                    let res: any;
                    if (type.type === "google") {
                      res = await performMagicAuthWithGoogle();
                      //@ts-ignore TODO: fix this when twitter is added
                    } else if (type.type === "twitter") {
                      res = await performMagicAuthWithTwitter();
                    } else if (type.type === "apple") {
                      res = await performMagicAuthWithApple();
                    }
                    addSocial(res.magic.idToken, type.type);
                  }
                }
              }}
            >
              {connected[type.type].address ? "Disconnect" : "Connect"}
            </Button>
          </View>
        );
      })}
    </>
  );
};
