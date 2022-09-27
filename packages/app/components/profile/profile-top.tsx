import { useMemo, useCallback } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import reactStringReplace from "react-string-replace";

import { Button } from "@showtime-xyz/universal.button";
import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { LightBox } from "@showtime-xyz/universal.light-box";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { ProfileDropdown } from "app/components/profile-dropdown";
import { useMyInfo, UserProfile } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useFollow } from "app/hooks/use-follow";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { TextLink } from "app/navigation/link";

import { Hidden } from "design-system/hidden";

import { getProfileImage, getProfileName } from "../../utilities";
import { FollowButton } from "../follow-button";
import { ProfileSocial } from "./profile-social";

function getFullSizeCover(url: string) {
  if (
    url &&
    url.startsWith("https://lh3.googleusercontent.com") &&
    !url.endsWith("=s0")
  ) {
    return url + "=s0";
  }

  return url;
}

type FollowProps = {
  onPressFollowing: () => void;
  onPressFollower: () => void;
  followingCount?: number;
  followersCount?: number;
  tw?: string;
};

const Follow = ({
  onPressFollowing,
  onPressFollower,
  followingCount,
  followersCount,
  tw = "",
}: FollowProps) => {
  return (
    <View tw={["flex-row", tw]}>
      <PressableScale onPress={onPressFollowing}>
        <Text tw="text-sm font-bold text-gray-900 dark:text-white">
          {`${followingCount ?? 0} `}
          <Text tw="font-medium">following</Text>
        </Text>
      </PressableScale>
      <View tw="ml-8 md:ml-4">
        <PressableScale onPress={onPressFollower}>
          <Text tw="text-sm font-bold text-gray-900 dark:text-white">
            {`${followersCount ?? 0} `}
            <Text tw="font-medium">followers</Text>
          </Text>
        </PressableScale>
      </View>
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
}: {
  address: string;
  isBlocked: boolean;
  animationHeaderPosition: Animated.SharedValue<number>;
  animationHeaderHeight: Animated.SharedValue<number>;
  profileData: UserProfile | undefined;
  isError: boolean;
  isLoading: boolean;
}) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const userId = useCurrentUserId();
  const name = getProfileName(profileData?.profile);
  const username = profileData?.profile.username;
  const bio = profileData?.profile.bio;
  const { colorScheme } = useColorScheme();
  const { width, height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const { isFollowing } = useMyInfo();
  const profileId = profileData?.profile.profile_id;
  const redirectToCreateDrop = useRedirectToCreateDrop();
  const isFollowingUser = useMemo(
    () => profileId && isFollowing(profileId),
    [profileId, isFollowing]
  );
  const { unblock } = useBlock();
  const { onToggleFollow } = useFollow({
    username: profileData?.profile.username,
  });

  const bioWithMentions = useMemo(
    () =>
      reactStringReplace(
        bio,
        /@([\w\d-]+?)\b/g,
        (username: string, i: number) => {
          return (
            <TextLink
              href={`/@${username}`}
              tw="font-bold text-black dark:text-white"
              key={i}
            >
              @{username}
            </TextLink>
          );
        }
      ),
    [bio]
  );
  // banner ratio: w:h=3:1
  const coverHeight = contentWidth < 768 ? contentWidth / 3 : 180;

  const onPressFollower = useCallback(
    () =>
      router.push(
        Platform.select({
          native: `/profile/followers?profileId=${profileId}`,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              profileId,
              followersModal: true,
            },
          } as any,
        }),
        Platform.select({
          native: `/profile/followers?profileId=${profileId}`,
          web: router.asPath,
        }),
        { scroll: false }
      ),
    [profileId, router]
  );
  const onPressFollowing = useCallback(
    () =>
      router.push(
        Platform.select({
          native: `/profile/following?profileId=${profileId}`,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              profileId,
              followingModal: true,
            },
          } as any,
        }),
        Platform.select({
          native: `/profile/following?profileId=${profileId}`,
          web: router.asPath,
        }),
        {
          scroll: false,
        }
      ),
    [profileId, router]
  );
  const avatarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            Math.min(animationHeaderPosition.value, 0),
            [0, animationHeaderHeight.value],
            [1, 1.5]
          ),
        },
        {
          translateY: interpolate(
            Math.min(animationHeaderPosition.value, 0),
            [0, animationHeaderHeight.value],
            [0, -44]
          ),
        },
        {
          translateX: interpolate(
            Math.min(animationHeaderPosition.value, 0),
            [0, animationHeaderHeight.value],
            [0, 44]
          ),
        },
      ],
    };
  }, []);
  return (
    <>
      <View
        tw={`overflow-hidden bg-gray-100 dark:bg-gray-800 xl:-mx-20 xl:rounded-b-[32px]`}
      >
        <Skeleton
          height={coverHeight}
          width={contentWidth}
          show={isLoading}
          colorMode={colorScheme as any}
          radius={0}
        >
          {profileData?.profile.cover_url && (
            <LightBox
              width={contentWidth}
              height={coverHeight}
              imgLayout={{ width: contentWidth, height: coverHeight }}
              tapToClose
            >
              <Image
                source={{
                  uri: getFullSizeCover(profileData?.profile.cover_url),
                }}
                alt="Cover image"
                resizeMode="cover"
                width={contentWidth}
                height={coverHeight}
                style={StyleSheet.absoluteFillObject}
              />
            </LightBox>
          )}
        </Skeleton>
      </View>
      <View tw="mx-2">
        <View tw="flex-row justify-between">
          <View tw="flex-row items-end">
            <Animated.View
              style={[
                {
                  width: 128,
                  height: 128,
                  borderRadius: 9999,
                  marginTop: -72,
                  overflow: "hidden",
                  borderWidth: 4,
                  borderColor: isDark ? "#000" : "#FFF",
                  backgroundColor: isDark ? colors.gray[900] : colors.gray[200],
                },
                avatarStyle,
              ]}
            >
              <Skeleton
                height={120}
                width={120}
                show={isLoading}
                colorMode={colorScheme as any}
                radius={0}
              >
                {profileData && (
                  <LightBox
                    width={120}
                    height={120}
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
                      style={StyleSheet.absoluteFillObject}
                    />
                  </LightBox>
                )}
              </Skeleton>
            </Animated.View>
          </View>

          {address && !isError ? (
            <View tw="flex-row items-center">
              {isBlocked ? (
                <Button
                  size={width < 768 ? "small" : "regular"}
                  onPress={() => {
                    unblock(profileId);
                  }}
                >
                  Unblock
                </Button>
              ) : (
                <>
                  <Hidden until="md">
                    <Follow
                      onPressFollower={onPressFollower}
                      onPressFollowing={onPressFollowing}
                      followersCount={profileData?.followers_count}
                      followingCount={profileData?.following_count}
                      tw="mr-8"
                    />
                  </Hidden>
                  {profileId && userId !== profileId ? (
                    <>
                      <ProfileDropdown user={profileData?.profile} />
                      <View tw="w-2" />
                      <FollowButton
                        size={width < 768 ? "small" : "regular"}
                        isFollowing={isFollowingUser}
                        name={profileData?.profile.name}
                        profileId={profileId}
                        onToggleFollow={onToggleFollow}
                      />
                    </>
                  ) : userId === profileId ? (
                    <Button size="small" onPress={redirectToCreateDrop}>
                      Drop Free NFT
                    </Button>
                  ) : null}
                </>
              )}
            </View>
          ) : null}
        </View>

        <View tw="px-2 py-3">
          {isLoading ? (
            <>
              <Skeleton
                height={24}
                width={150}
                show={true}
                colorMode={colorScheme as any}
              />
              <View tw="h-2" />
              <Skeleton
                height={12}
                width={100}
                show={true}
                colorMode={colorScheme as any}
              />
            </>
          ) : (
            <View tw="flex-row items-start justify-between">
              <View>
                <Text
                  tw="font-space-bold max-w-45 text-2xl font-extrabold text-gray-900 dark:text-white"
                  numberOfLines={2}
                >
                  {name}
                </Text>
                <View tw="h-2 md:h-3" />
                <View tw="flex-row items-center">
                  <Text tw="text-base font-semibold  text-gray-900 dark:text-white md:text-lg">
                    {username ? `@${username}` : null}
                  </Text>

                  {profileData?.profile.verified ? (
                    <View tw="ml-1">
                      <VerificationBadge size={16} />
                    </View>
                  ) : null}
                </View>
              </View>
              <ProfileSocial profile={profileData?.profile} />
            </View>
          )}

          {bio ? (
            <View tw="mt-3 items-baseline">
              <ClampText
                text={bioWithMentions}
                maxLines={3}
                tw="text-sm text-gray-600 dark:text-gray-400"
              />
            </View>
          ) : null}
          <Hidden from="md">
            <Follow
              onPressFollower={onPressFollower}
              onPressFollowing={onPressFollowing}
              followersCount={profileData?.followers_count}
              followingCount={profileData?.following_count}
              tw="mt-4"
            />
          </Hidden>
        </View>
      </View>
    </>
  );
};
