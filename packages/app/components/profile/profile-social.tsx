import { memo, useMemo, useCallback } from "react";
import { Linking } from "react-native";

import { Divider } from "@showtime-xyz/universal.divider";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Twitter,
  Link as LinkIcon,
  Instagram,
} from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Profile } from "app/types";
import { getDomainName, formatLink } from "app/utilities";

import { Hidden } from "design-system/hidden";

type ProfileSocialProps = {
  profile?: Profile;
};

export const ProfileSocial = memo<ProfileSocialProps>(function ProfileSocial({
  profile,
}) {
  const isDark = useIsDarkMode();

  const twitter = useMemo(
    () => profile?.links?.find((item) => item.type__name === "Twitter"),
    [profile?.links]
  );
  const instagram = useMemo(
    () => profile?.links?.find((item) => item.type__name === "Instagram"),
    [profile?.links]
  );
  const websiteLink = useMemo(
    () => getDomainName(profile?.website_url),
    [profile?.website_url]
  );

  const onPressLink = useCallback(async (link: string) => {
    return Linking.openURL(link);
  }, []);

  return (
    <View tw="justify-center sm:flex-row">
      {profile?.website_url && websiteLink && (
        <PressableScale
          onPress={() => onPressLink(formatLink(profile.website_url))}
          style={{ flexDirection: "row" }}
          accessibilityLabel="Profile website"
          accessibilityRole="link"
        >
          <LinkIcon
            color={isDark ? "#FFF" : colors.gray[900]}
            width={16}
            height={16}
            style={{ marginRight: 4, marginTop: -2 }}
          />
          <Text
            numberOfLines={1}
            tw="max-w-[150px] text-sm font-bold text-gray-900 dark:text-white"
          >
            {websiteLink}
          </Text>
        </PressableScale>
      )}

      <Hidden until="sm">
        {websiteLink && (twitter?.user_input || instagram?.user_input) && (
          <Divider orientation="vertical" height={16} tw="mx-4" />
        )}
      </Hidden>

      <View tw="mt-2 flex-row items-center justify-end sm:mt-0">
        {twitter?.user_input && (
          <PressableScale
            onPress={() =>
              onPressLink(
                `https://${twitter?.type__prefix}${twitter?.user_input}`
              )
            }
            accessibilityLabel="Twitter"
            accessibilityRole="link"
          >
            <Twitter
              width={16}
              height={16}
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </PressableScale>
        )}
        {instagram?.user_input && (
          <PressableScale
            style={{ marginLeft: 16 }}
            onPress={() =>
              onPressLink(
                `https://${instagram?.type__prefix}${instagram?.user_input}`
              )
            }
            accessibilityLabel="Instagram"
            accessibilityRole="link"
          >
            <Instagram
              width={16}
              height={16}
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </PressableScale>
        )}
      </View>
    </View>
  );
});
