import { useMemo, useCallback } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { Button } from "@showtime-xyz/universal.button";
import { Chip } from "@showtime-xyz/universal.chip";
import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InformationCircle, Lock } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { LightBox } from "@showtime-xyz/universal.light-box";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { StarDropBadge } from "app/components/badge/star-drop-badge";
import { DESKTOP_PROFILE_WIDTH } from "app/constants/layout";
import { UserProfile, useUserProfile } from "app/hooks/api-hooks";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { linkifyDescription } from "app/lib/linkify";
import { Profile } from "app/types";
import { getProfileImage, getProfileName } from "app/utilities";

import { breakpoints } from "design-system/theme";

import { CreatorTokensPanel } from "./creator-tokens-panel";
import { ProfileSocial } from "./profile-social";

const AVATAR_SIZE_SMALL = 82;
const AVATAR_SIZE_LARGE = 144;

const AVATAR_BORDER_SIZE = 4;

type ProfileTopProps = {
  address: string;
  isBlocked: boolean;
  animationHeaderPosition?: Animated.SharedValue<number>;
  animationHeaderHeight?: Animated.SharedValue<number>;
  profileData: UserProfile | undefined;
  isError: boolean;
  isLoading: boolean;
  savedSongs?: number;
};
export const ProfileCover = ({
  uri,
  style,
  ...rest
}: { uri?: string } & ViewProps) => {
  const coverWidth = useContentWidth();
  const { top } = useSafeAreaInsets();

  // for iPhone 14+
  const additionalCoverheight = top > 55 ? 20 : 0;
  // banner ratio: w:h=3:1
  const coverHeight =
    (coverWidth < 768 ? coverWidth / 4 : coverWidth / 5) +
    additionalCoverheight;

  return (
    <View
      style={[
        {
          height: coverHeight,
        },
        style,
      ]}
      {...rest}
    >
      <Image
        source={{
          uri,
        }}
        alt="Cover image"
        resizeMode="cover"
        style={{ ...StyleSheet.absoluteFillObject }}
      />
      <BlurView
        tint="dark"
        intensity={35}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          overflow: "hidden",
        }}
      />
    </View>
  );
};
export const ProfileTop = ({
  address,
  isBlocked,
  animationHeaderPosition,
  animationHeaderHeight,
  profileData,
  isError,
  isLoading,
  savedSongs,
}: ProfileTopProps) => {
  const { mutate: mutateUserProfile } = useUserProfile({ address });
  const isDark = useIsDarkMode();
  const router = useRouter();
  const userId = useCurrentUserId();
  const name = getProfileName(profileData?.profile);
  const username = profileData?.profile.username;
  const bio = profileData?.profile.bio;
  const { width, height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const isProfileMdScreen = contentWidth > DESKTOP_PROFILE_WIDTH - 10;

  const profileId = profileData?.profile.profile_id;
  const isSelf = userId === profileId;

  const bioWithMentions = useMemo(() => linkifyDescription(bio), [bio]);
  // for iPhone 14+

  const avatarSize = isProfileMdScreen ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL;
  const avatarStyle = useAnimatedStyle(() => {
    if (!animationHeaderHeight || !animationHeaderPosition) {
      return {};
    }
    return {
      transform: [
        {
          scale: interpolate(
            Math.min(animationHeaderPosition.value, 0),
            [0, animationHeaderHeight.value],
            [1, 1.15]
          ),
        },
      ],
    };
  }, []);
  if (isProfileMdScreen) {
    return (
      <View tw="px-7">
        <View tw="flex-row items-center">
          <Animated.View
            style={[
              {
                width: avatarSize + AVATAR_BORDER_SIZE * 2,
                height: avatarSize + AVATAR_BORDER_SIZE * 2,
                borderRadius: 9999,
                overflow: "hidden",
                borderWidth: AVATAR_BORDER_SIZE,
                borderColor: isDark ? "#000" : "#FFF",
                backgroundColor: isDark ? colors.gray[900] : colors.gray[200],
                margin: -AVATAR_BORDER_SIZE,
              },
              avatarStyle,
            ]}
          >
            <Skeleton
              height={avatarSize}
              width={avatarSize}
              show={isLoading}
              radius={0}
            >
              {profileData && (
                <LightBox
                  width={avatarSize}
                  height={avatarSize}
                  imgLayout={{ width: contentWidth, height: width }}
                  borderRadius={999}
                  tapToClose
                >
                  <Image
                    source={{
                      uri: getProfileImage(profileData?.profile),
                    }}
                    width={Platform.select({
                      web: screenHeight * 0.82,
                      default: undefined,
                    })}
                    height={Platform.select({
                      web: screenHeight * 0.82,
                      default: undefined,
                    })}
                    style={Platform.select({
                      web: {},
                      default: { ...StyleSheet.absoluteFillObject },
                    })}
                    alt={profileData?.profile.name ?? ""}
                  />
                </LightBox>
              )}
            </Skeleton>
          </Animated.View>
          <View tw="ml-4 flex-row items-start justify-between">
            <View tw="flex-1">
              <Text
                tw="max-w-45 text-xl font-bold text-gray-900 dark:text-white"
                numberOfLines={2}
              >
                {name}
              </Text>
              <View tw="h-2 md:h-3" />
              <View tw="flex-row items-center">
                {Boolean(username) && (
                  <>
                    <Text tw="text-xl text-gray-900 dark:text-gray-400 md:text-lg">
                      {`@${username}`}
                    </Text>
                  </>
                )}

                {profileData?.profile.verified ? (
                  <View tw="ml-1">
                    <VerificationBadge size={16} />
                  </View>
                ) : null}
                <View tw="ml-1">
                  <StarDropBadge
                    size={16}
                    data={profileData?.profile.latest_star_drop_collected}
                  />
                </View>
                {profileData?.follows_you && !isSelf ? (
                  <Chip label="Follows You" tw="ml-2" />
                ) : null}
              </View>
              <View tw="py-2.5">
                {bio ? (
                  <View tw="items-baseline">
                    <ClampText
                      text={bioWithMentions}
                      maxLines={3}
                      tw="text-sm text-gray-900 dark:text-white"
                    />
                  </View>
                ) : null}
              </View>
              <ProfileSocial
                profile={profileData?.profile}
                savedSongs={savedSongs}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
  return (
    <>
      <View tw="web:bg-gray-100 overflow-hidden bg-gray-400 dark:bg-gray-800">
        <ProfileCover uri={getProfileImage(profileData?.profile)} />
      </View>
      <View tw="px-7">
        <View tw="flex-row items-center">
          <Animated.View
            style={[
              {
                width: avatarSize + AVATAR_BORDER_SIZE * 2,
                height: avatarSize + AVATAR_BORDER_SIZE * 2,
                borderRadius: 9999,
                overflow: "hidden",
                borderWidth: AVATAR_BORDER_SIZE,
                borderColor: isDark ? "#000" : "#FFF",
                backgroundColor: isDark ? colors.gray[900] : colors.gray[200],
                margin: -AVATAR_BORDER_SIZE,
              },
              avatarStyle,
            ]}
          >
            <Skeleton
              height={avatarSize}
              width={avatarSize}
              show={isLoading}
              radius={0}
            >
              {profileData && (
                <LightBox
                  width={avatarSize}
                  height={avatarSize}
                  imgLayout={{ width: contentWidth, height: width }}
                  borderRadius={999}
                  tapToClose
                >
                  <Image
                    source={{
                      uri: getProfileImage(profileData?.profile),
                    }}
                    width={Platform.select({
                      web: screenHeight * 0.82,
                      default: undefined,
                    })}
                    height={Platform.select({
                      web: screenHeight * 0.82,
                      default: undefined,
                    })}
                    style={Platform.select({
                      web: {},
                      default: { ...StyleSheet.absoluteFillObject },
                    })}
                    alt={profileData?.profile.name ?? ""}
                  />
                </LightBox>
              )}
            </Skeleton>
          </Animated.View>
          <View tw="ml-4 flex-row items-start justify-between">
            <View tw="flex-1">
              <Text
                tw="max-w-45 text-xl font-bold text-gray-900 dark:text-white"
                numberOfLines={2}
              >
                {name}
              </Text>
              <View tw="h-2 md:h-3" />
              <View tw="flex-row items-center">
                {Boolean(username) && (
                  <>
                    <Text tw="text-xl text-gray-900 dark:text-gray-400 md:text-lg">
                      {`@${username}`}
                    </Text>
                  </>
                )}

                {profileData?.profile.verified ? (
                  <View tw="ml-1">
                    <VerificationBadge size={16} />
                  </View>
                ) : null}
                <View tw="ml-1">
                  <StarDropBadge
                    size={16}
                    data={profileData?.profile.latest_star_drop_collected}
                  />
                </View>
                {profileData?.follows_you && !isSelf ? (
                  <Chip label="Follows You" tw="ml-2" />
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <View tw="py-2.5">
          {bio ? (
            <View tw="items-baseline">
              <ClampText
                text={bioWithMentions}
                maxLines={3}
                tw="text-sm text-gray-900 dark:text-white"
              />
            </View>
          ) : null}
        </View>
        <ProfileSocial profile={profileData?.profile} savedSongs={savedSongs} />
        <CreatorTokensPanel />
      </View>
    </>
  );
};
