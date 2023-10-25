import { memo, useMemo, useCallback } from "react";
import { Linking } from "react-native";

import { Divider } from "@showtime-xyz/universal.divider";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Twitter,
  Link as LinkIcon,
  Instagram,
  SpotifyPure,
  AppleMusic,
} from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Profile } from "app/types";
import { getDomainName, formatLink } from "app/utilities";

type ProfileSocialProps = {
  profile?: Profile;
  savedSongs?: number;
};

export const ProfileSocial = memo<ProfileSocialProps>(function ProfileSocial({
  profile,
  savedSongs = 0,
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
  if (!profile) return null;
  return (
    <View tw="flex-row items-center">
      {profile?.website_url && websiteLink && (
        <PressableScale
          onPress={() => onPressLink(formatLink(profile.website_url))}
          aria-label="Profile website"
          role="link"
          tw="mr-2"
        >
          <Text
            numberOfLines={1}
            tw="text-13 max-w-[150px] font-bold text-gray-900 dark:text-white"
          >
            {websiteLink}
          </Text>
        </PressableScale>
      )}

      <View tw="w-full flex-row items-center">
        {/* <Text tw="text-13 text-gray-900 dark:text-white">
          <Text tw="font-bold">{savedSongs?.toLocaleString()}</Text> Song saves
        </Text> */}
        {spotifyUrl && (
          <PressableScale
            onPress={() => onPressLink(spotifyUrl)}
            aria-label="SpotifyPure"
            role="link"
            tw="mr-2"
          >
            <SpotifyPure
              width={16}
              height={16}
              color={isDark ? "#FFF" : colors.gray[900]}
            />
          </PressableScale>
        )}

        {appleMusicUrl && (
          <PressableScale
            onPress={() => onPressLink(appleMusicUrl)}
            aria-label="Apple Music"
            role="link"
            tw="mr-2"
          >
            <AppleMusic
              width={16}
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
            tw="ml-2"
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
            tw="ml-2"
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
