import { useMemo, useCallback } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { Button } from "@showtime-xyz/universal.button";
import { Chip } from "@showtime-xyz/universal.chip";
import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Gift as GiftIcon,
  InformationCircle as InformationCircleIcon,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { LightBox } from "@showtime-xyz/universal.light-box";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { ProfileDropdown } from "app/components/profile-dropdown";
import { UserProfile } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useFollow } from "app/hooks/use-follow";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { linkifyDescription } from "app/lib/linkify";
import {
  formatToUSNumber,
  getNextRefillClaim,
  getProfileImage,
  getProfileName,
} from "app/utilities";

import { Hidden } from "design-system/hidden";
import { breakpoints } from "design-system/theme";

import { FollowButton } from "../follow-button";
import { ProfileSocial } from "./profile-social";

const AVATAR_SIZE_SMALL = 86;
const AVATAR_SIZE_LARGE = 128;

const AVATAR_BORDER_SIZE = 4;

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
          {`${formatToUSNumber(followingCount ?? 0)} `}
          <Text tw="font-medium">following</Text>
        </Text>
      </PressableScale>
      <View tw="ml-8 md:ml-4">
        <PressableScale onPress={onPressFollower}>
          <Text tw="text-sm font-bold text-gray-900 dark:text-white">
            {`${formatToUSNumber(followersCount ?? 0)} `}
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
  const { user } = useUser();
  const { width, height: screenHeight } = useWindowDimensions();
  const contentWidth = useContentWidth();
  const isMdWidth = width >= breakpoints["md"];
  const profileId = profileData?.profile.profile_id;
  const redirectToCreateDrop = useRedirectToCreateDrop();
  const isSelf = userId === profileId;
  const { unblock } = useBlock();
  const { onToggleFollow } = useFollow({
    username: profileData?.profile.username,
  });

  const bioWithMentions = useMemo(() => linkifyDescription(bio), [bio]);
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

  const onPressClaimLimit = useCallback(
    () =>
      router.push(
        Platform.select({
          native: `/claim/claim-limit-explanation`,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              claimLimitExplanationModal: true,
            },
          } as any,
        }),
        Platform.select({
          native: `/claim/claim-limit-explanation`,
          web: router.asPath,
        }),
        {
          scroll: false,
        }
      ),
    [router]
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
            [0, -40]
          ),
        },
        {
          translateX: interpolate(
            Math.min(animationHeaderPosition.value, 0),
            [0, animationHeaderHeight.value],
            [0, 16]
          ),
        },
      ],
    };
  }, []);

  return (
    <>
      <View tw="overflow-hidden bg-gray-100 dark:bg-gray-800 xl:-mx-20 xl:rounded-b-[32px]">
        <Skeleton
          height={coverHeight}
          width={contentWidth}
          show={isLoading}
          colorMode={colorScheme as any}
          radius={0}
        >
          <>
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
            <View
              tw="absolute inset-0 bg-black/10 dark:bg-black/30"
              pointerEvents="none"
            />
          </>
        </Skeleton>
      </View>
      <View tw="mx-2">
        <View tw="flex-row justify-between">
          <View tw="flex-row items-end">
            <Animated.View
              style={[
                {
                  width: isMdWidth ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL,
                  height: isMdWidth ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL,
                  borderRadius: 9999,
                  marginTop: -36,
                  overflow: "hidden",
                  borderWidth: AVATAR_BORDER_SIZE,
                  borderColor: isDark ? "#000" : "#FFF",
                  backgroundColor: isDark ? colors.gray[900] : colors.gray[200],
                },
                avatarStyle,
              ]}
            >
              <Skeleton
                height={
                  (isMdWidth ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL) -
                  AVATAR_BORDER_SIZE * 2
                }
                width={
                  (isMdWidth ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL) -
                  AVATAR_BORDER_SIZE * 2
                }
                show={isLoading}
                colorMode={colorScheme as any}
                radius={0}
              >
                {profileData && (
                  <LightBox
                    width={
                      (isMdWidth ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL) -
                      AVATAR_BORDER_SIZE * 2
                    }
                    height={
                      (isMdWidth ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL) -
                      AVATAR_BORDER_SIZE * 2
                    }
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
                      alt={profileData?.profile.name}
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
                  {profileId && !isSelf ? (
                    <>
                      <ProfileDropdown
                        user={profileData?.profile}
                        // Todo: Zeego issue on iOS.
                        tw="ios:mt-2"
                      />
                      <View tw="w-2" />
                      <FollowButton
                        size={width < 768 ? "small" : "regular"}
                        name={profileData?.profile.name}
                        profileId={profileId}
                        onToggleFollow={onToggleFollow}
                      />
                    </>
                  ) : (
                    isSelf && (
                      <Button size="small" onPress={redirectToCreateDrop}>
                        Create free drop
                      </Button>
                    )
                  )}
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
              <View tw="flex-1">
                <Text
                  tw="font-space-bold max-w-45 text-2xl font-extrabold text-gray-900 dark:text-white"
                  numberOfLines={2}
                >
                  {name}
                </Text>
                <View tw="h-2 md:h-3" />
                <View tw="flex-row items-center">
                  {Boolean(username) && (
                    <>
                      <Text tw="text-base text-gray-600 dark:text-gray-400 md:text-lg">
                        {`@${username}`}
                      </Text>
                    </>
                  )}

                  {profileData?.profile.verified ? (
                    <View tw="ml-1">
                      <VerificationBadge size={16} />
                    </View>
                  ) : null}
                  {profileData?.follows_you && !isSelf ? (
                    <Chip label="Follows You" tw="ml-2" />
                  ) : null}
                </View>
              </View>
              <ProfileSocial profile={profileData?.profile} />
            </View>
          )}

          {bio ? (
            <View tw="mt-4 items-baseline">
              <ClampText
                text={bioWithMentions}
                maxLines={3}
                tw="text-sm text-gray-900 dark:text-white"
              />
            </View>
          ) : null}
          {isSelf && user?.data?.claim_tank?.available_claims !== undefined ? (
            <Pressable
              onPress={onPressClaimLimit}
              tw="mt-3 flex-row items-center"
            >
              <GiftIcon
                height={18}
                width={18}
                color={isDark ? colors.gray[400] : colors.gray[600]}
              />
              <Text tw="ml-0.5 mr-0.5 text-sm text-gray-600 dark:text-gray-400">
                {user?.data.claim_tank.available_claims
                  ? `You have ${user?.data.claim_tank.available_claims}/${user?.data.claim_tank.tank_limit} claims available`
                  : `Your next claim will be available ${getNextRefillClaim(
                      user?.data.claim_tank.next_refill_at
                    )}`}
              </Text>
              <InformationCircleIcon
                height={18}
                width={18}
                color={isDark ? colors.gray[400] : colors.gray[600]}
              />
            </Pressable>
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
