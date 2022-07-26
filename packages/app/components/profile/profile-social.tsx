import { memo, useMemo, useCallback } from "react";
import { Linking } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Divider } from "@showtime-xyz/universal.divider";
import {
  Twitter,
  Link as LinkIcon,
  Instagram,
} from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { tw, colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Profile } from "app/types";
import { getDomainName, formatLink } from "app/utilities";

type ProfileSocialProps = {
  profile?: Profile;
};

export const ProfileSocial = memo<ProfileSocialProps>(function ProfileSocial({
  profile,
}) {
  const Alert = useAlert();
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

  const onPressLink = useCallback(
    async (link: string) => {
      const canOpenUrl = await Linking.canOpenURL(link);
      if (!canOpenUrl) return Alert.alert("Unable to open the link.");
      return Linking.openURL(link);
    },
    [Alert]
  );

  return (
    <View tw="flex-row items-center">
      {profile?.website_url && websiteLink && (
        <PressableScale
          onPress={() => onPressLink(formatLink(profile.website_url))}
          tw="flex-row"
          accessibilityLabel="Profile website"
          accessibilityRole="link"
        >
          <LinkIcon
            color={colors.gray.darkest}
            width={16}
            height={16}
            style={tw.style("mr-1 -mt-0.5")}
          />
          <Text tw="text-sm font-bold text-gray-900 dark:text-white">
            {websiteLink}
          </Text>
        </PressableScale>
      )}
      {websiteLink && (twitter?.user_input || instagram?.user_input) && (
        <Divider orientation="vertical" height={16} tw="mx-4" />
      )}

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
            color={tw.style("text-gray-900 dark:text-white").color as string}
          />
        </PressableScale>
      )}
      {instagram?.user_input && (
        <PressableScale
          tw="ml-4"
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
            color={tw.style("text-gray-900 dark:text-white").color as string}
          />
        </PressableScale>
      )}
    </View>
  );
});
