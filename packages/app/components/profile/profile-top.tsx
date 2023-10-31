import { useMemo, useCallback, memo } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { Button, GradientButton } from "@showtime-xyz/universal.button";
import { Chip } from "@showtime-xyz/universal.chip";
import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  GiftSolid,
  InformationCircle,
  Lock,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { LightBox } from "@showtime-xyz/universal.light-box";
import { Pressable } from "@showtime-xyz/universal.pressable";
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
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { linkifyDescription } from "app/lib/linkify";
import { Profile } from "app/types";
import {
  getFullSizeCover,
  getProfileImage,
  getProfileName,
} from "app/utilities";

import { breakpoints } from "design-system/theme";
import { toast } from "design-system/toast";

import { ButtonGoldLinearGradient } from "../gold-gradient";
import { CompleteProfileButton } from "./complete-profile-button";
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
  isSelf: boolean;
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
export const ProfileTop = memo<ProfileTopProps>(function ProfileTop({
  profileData,
  isLoading,
  savedSongs,
  isSelf = false,
}) {
  const isDark = useIsDarkMode();
  const name = getProfileName(profileData?.profile);
  const username = profileData?.profile.username;
  const bio = profileData?.profile.bio;
  const { width, height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const isProfileMdScreen = contentWidth > DESKTOP_PROFILE_WIDTH - 10;

  const bioWithMentions = useMemo(() => linkifyDescription(bio), [bio]);
  // for iPhone 14+
  const avatarSize = isProfileMdScreen ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL;
  // const avatarStyle = useAnimatedStyle(() => {
  //   if (!animationHeaderHeight || !animationHeaderPosition) {
  //     return {};
  //   }
  //   return {
  //     transform: [
  //       {
  //         scale: interpolate(
  //           Math.min(animationHeaderPosition.value, 0),
  //           [0, animationHeaderHeight.value],
  //           [1, 1.15]
  //         ),
  //       },
  //     ],
  //   };
  // }, []);
  if (isProfileMdScreen) {
    return (
      <View tw="pl-7">
        <View tw="flex-row">
          <View tw="pb-7">
            <View
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
            </View>
          </View>
          <View tw="ml-4 flex-1 pt-7">
            <View tw="flex-1">
              <View tw="flex-row justify-between">
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
                        <Text tw="text-xl text-gray-900 dark:text-gray-400">
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
                <CompleteProfileButton isSelf={isSelf} />
              </View>
              <View tw="pb-3.5 pt-4">
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
        <ProfileCover uri={getFullSizeCover(profileData?.profile)} />
      </View>
      <View tw="px-4">
        <View tw="flex-row">
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
                marginTop: -AVATAR_BORDER_SIZE - 8,
              },
              // avatarStyle,
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
          <View tw="ml-3.5 mt-3 flex-1 flex-row items-start justify-between">
            <View tw="flex-1">
              <Text
                tw="max-w-45 text-xl font-bold text-gray-900 dark:text-white"
                numberOfLines={2}
              >
                {name}
              </Text>
              <View tw="h-2" />
              <Pressable
                tw="flex-1 flex-row flex-wrap items-center"
                onPress={async () => {
                  if (!username) return;
                  await Clipboard.setStringAsync(username);
                  toast.success("Copied!");
                }}
              >
                {Boolean(username) && (
                  <Text
                    tw="items-center leading-5 text-gray-900 dark:text-gray-400"
                    style={{ fontSize: 20 }}
                    numberOfLines={2}
                  >
                    {`@${username}`}
                  </Text>
                )}
                <View tw="ml-1">
                  {profileData?.profile.verified ? (
                    <VerificationBadge size={16} />
                  ) : null}
                </View>
                <StarDropBadge
                  size={16}
                  data={profileData?.profile.latest_star_drop_collected}
                  tw="ml-1"
                />
                {profileData?.follows_you && !isSelf ? (
                  <Chip label="Follows You" tw="ml-2" />
                ) : null}
              </Pressable>
            </View>
            <View tw="-mt-1 ml-auto">
              <CompleteProfileButton isSelf={isSelf} />
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
        <CreatorTokensPanel
          isSelf={isSelf}
          username={profileData?.profile.username}
        />
      </View>
    </>
  );
});
