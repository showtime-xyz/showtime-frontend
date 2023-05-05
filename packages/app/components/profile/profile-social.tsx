import { memo, useMemo, useCallback } from "react";
import { Linking } from "react-native";

import { Divider } from "@showtime-xyz/universal.divider";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Twitter,
  Link as LinkIcon,
  Instagram,
  Spotify,
  AppleMusic,
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

  const twitter = profile?.social_login_handles?.twitter;
  const instagram = profile?.social_login_handles?.instagram;

  const spotifyUrl = profile?.spotify_artist_id
    ? `https://open.spotify.com/artist/${profile?.spotify_artist_id}`
    : null;

  const appleMusicUrl = profile?.apple_music_artist_id
    ? `https://music.apple.com/artist/${profile?.apple_music_artist_id}`
    : null;

  const websiteLink = useMemo(
    () => getDomainName(profile?.website_url),
    [profile?.website_url]
  );

  const onPressLink = useCallback(async (link: string) => {
    return Linking.openURL(link);
  }, []);

  return (
    <View tw="items-center justify-center sm:flex-row">
      {profile?.website_url && websiteLink && (
        <PressableScale
          onPress={() => onPressLink(formatLink(profile.website_url))}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          aria-label="Profile website"
          role="link"
        >
          <LinkIcon
            color={isDark ? "#FFF" : colors.gray[900]}
            width={20}
            height={20}
          />
          <Text
            numberOfLines={1}
            tw="ml-1 max-w-[150px] text-sm font-bold text-gray-900 dark:text-white"
          >
            {websiteLink}
          </Text>
        </PressableScale>
      )}

      <Hidden until="sm">
        {websiteLink && (twitter || instagram || spotifyUrl) && (
          <Divider orientation="vertical" height={16} tw="mx-4" />
        )}
      </Hidden>

      <View tw="mt-2 w-full max-w-[150px] flex-row items-center justify-end gap-2 sm:mt-0 sm:w-auto">
        {spotifyUrl && (
          <PressableScale
            onPress={() => onPressLink(spotifyUrl)}
            aria-label="Spotify"
            role="link"
          >
            <Spotify
              width={20}
              height={20}
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </PressableScale>
        )}

        {appleMusicUrl && (
          <PressableScale
            onPress={() => onPressLink(appleMusicUrl)}
            aria-label="Apple Music"
            role="link"
          >
            <AppleMusic
              width={17}
              height={17}
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </PressableScale>
        )}

        {twitter && (
          <PressableScale
            onPress={() => onPressLink(`https://twitter.com/${twitter}`)}
            aria-label="Twitter"
            role="link"
          >
            <Twitter
              width={20}
              height={20}
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </PressableScale>
        )}
        {instagram && (
          <PressableScale
            onPress={() => onPressLink(`https://instagram.com/${instagram}`)}
            aria-label="Instagram"
            role="link"
          >
            <Instagram
              width={20}
              height={20}
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </PressableScale>
        )}
      </View>
    </View>
  );
});
