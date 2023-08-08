import { useMemo, useCallback } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { Button, GradientButton } from "@showtime-xyz/universal.button";
import { Chip } from "@showtime-xyz/universal.chip";
import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Gift as GiftIcon,
  InformationCircle as InformationCircleIcon,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { LightBox } from "@showtime-xyz/universal.light-box";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useJoinChannel } from "app/components/creator-channels/hooks/use-join-channel";
import { NotificationsFollowButton } from "app/components/notifications-follow-button";
import { ProfileDropdown } from "app/components/profile-dropdown";
import { UserProfile, useUserProfile } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import {
  useContentWidth,
  ContentLayoutOffset,
} from "app/hooks/use-content-width";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useFollow } from "app/hooks/use-follow";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { linkifyDescription } from "app/lib/linkify";
import {
  getFullSizeCover,
  getFormatDistanceToNowStrict,
  getProfileImage,
  getProfileName,
} from "app/utilities";

import { Hidden } from "design-system/hidden";
import { breakpoints } from "design-system/theme";

import { FollowButton } from "../follow-button";
import { ProfileFollows } from "./profile-follows";
import { ProfileSocial } from "./profile-social";

const AVATAR_SIZE_SMALL = 86;
const AVATAR_SIZE_LARGE = 144;

const AVATAR_BORDER_SIZE_SMALL = 4;
const AVATAR_BORDER_SIZE_LARGE = 8;

type ProfileTopProps = {
  address: string;
  isBlocked: boolean;
  animationHeaderPosition?: Animated.SharedValue<number>;
  animationHeaderHeight?: Animated.SharedValue<number>;
  profileData: UserProfile | undefined;
  isError: boolean;
  isLoading: boolean;
};
export const ProfileTop = ({
  address,
  isBlocked,
  animationHeaderPosition,
  animationHeaderHeight,
  profileData,
  isError,
  isLoading,
}: ProfileTopProps) => {
  const { mutate: mutateUserProfile } = useUserProfile({ address });
  const isDark = useIsDarkMode();
  const router = useRouter();
  const userId = useCurrentUserId();
  const name = getProfileName(profileData?.profile);
  const username = profileData?.profile.username;
  const bio = profileData?.profile.bio;
  const { user, isIncompletedProfile } = useUser();
  const { width, height: screenHeight } = useWindowDimensions();
  const coverWidth = useContentWidth();
  const isMdWidth = width >= breakpoints["md"];
  const profileId = profileData?.profile.profile_id;
  const redirectToCreateDrop = useRedirectToCreateDrop();
  const isSelf = userId === profileId;
  const { unblock } = useBlock();
  const joinChannel = useJoinChannel();
  const userChannel = profileData?.profile.channels?.[0];
  const { onToggleFollow } = useFollow({
    username,
  });

  const { top } = useSafeAreaInsets();

  const showChannelButton = typeof userChannel?.id !== "undefined";

  const bioWithMentions = useMemo(() => linkifyDescription(bio), [bio]);
  // for iPhone 14+
  const additionalCoverheight = top > 55 ? 20 : 0;
  // banner ratio: w:h=3:1
  const coverHeight =
    (coverWidth < 768 ? coverWidth / 3 : 180) + additionalCoverheight;
  const avatarBorder = isMdWidth
    ? AVATAR_BORDER_SIZE_LARGE
    : AVATAR_BORDER_SIZE_SMALL;
  const avatarSize = isMdWidth ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL;
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
    if (!animationHeaderHeight || !animationHeaderPosition) {
      return {};
    }
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
      <View tw="web:bg-gray-100 overflow-hidden bg-gray-400 dark:bg-gray-800 xl:rounded-b-[32px] 2xl:-mx-20">
        <Skeleton height={coverHeight} width="100%" show={isLoading} radius={0}>
          <>
            {profileData?.profile.cover_url && (
              <LightBox
                width={"100%"}
                height={coverHeight}
                imgLayout={{ width: "100%", height: coverHeight }}
                tapToClose
                containerStyle={{ width: coverWidth, height: coverHeight }}
              >
                <Image
                  source={{
                    uri: getFullSizeCover(profileData?.profile.cover_url),
                  }}
                  alt="Cover image"
                  resizeMode="cover"
                  style={{ ...StyleSheet.absoluteFillObject }}
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
      <View tw="mx-2 md:mx-4">
        <View tw="flex-row justify-between">
          <View
            tw="flex-row items-end"
            style={{
              marginTop: -avatarSize / 2,
            }}
          >
            <Animated.View
              style={[
                {
                  width: avatarSize + avatarBorder * 2,
                  height: avatarSize + avatarBorder * 2,
                  borderRadius: 9999,
                  overflow: "hidden",
                  borderWidth: avatarBorder,
                  borderColor: isDark ? "#000" : "#FFF",
                  backgroundColor: isDark ? colors.gray[900] : colors.gray[200],
                  margin: -avatarBorder,
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
                    imgLayout={{ width: coverWidth, height: width }}
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
                    <ProfileFollows
                      followersCount={profileData?.followers_count}
                      followingCount={profileData?.following_count}
                      profileId={profileId}
                      tw="mr-8"
                    />
                  </Hidden>
                  {profileId && !isSelf ? (
                    <>
                      <ProfileDropdown user={profileData?.profile} />
                      <View tw="w-2" />
                      <NotificationsFollowButton
                        username={username}
                        profileId={profileId}
                      />
                      <View tw="w-2" />
                      {showChannelButton ? (
                        <Button
                          size={width < 768 ? "small" : "regular"}
                          style={{
                            backgroundColor: colors.indigo[600],
                          }}
                          onPress={async () => {
                            if (userChannel?.self_is_member) {
                              router.push(
                                `/channels/${userChannel.id}?fresh=profile`
                              );
                            } else {
                              mutateUserProfile(
                                (d) => {
                                  if (d && d.data && d.data.profile) {
                                    d.data.profile.channels[0].self_is_member =
                                      true;
                                    return {
                                      ...d,
                                    };
                                  }
                                  return d;
                                },
                                { revalidate: false }
                              );
                              await joinChannel.trigger({
                                channelId: userChannel.id,
                              });
                              mutateUserProfile();
                              router.push(
                                `/channels/${userChannel.id}?fresh=profile`
                              );
                            }
                          }}
                          disabled={joinChannel.isMutating}
                          tw={`opacity-${
                            joinChannel.isMutating ? "50" : "100"
                          }`}
                        >
                          <Text tw="font-semibold" style={{ color: "white" }}>
                            {userChannel.self_is_member
                              ? "View Channel"
                              : "Join Channel"}
                          </Text>
                        </Button>
                      ) : (
                        <FollowButton
                          size={width < 768 ? "small" : "regular"}
                          name={username}
                          profileId={profileId}
                          onToggleFollow={onToggleFollow}
                        />
                      )}
                      <View tw="w-2" />
                    </>
                  ) : null}
                  {isSelf && !isIncompletedProfile ? (
                    <Button size="small" onPress={redirectToCreateDrop}>
                      Create
                    </Button>
                  ) : null}
                  {isSelf && isIncompletedProfile ? (
                    <GradientButton
                      size="small"
                      onPress={redirectToCreateDrop}
                      labelTW={"color-white"}
                      gradientProps={{
                        colors: ["#ED0A25", "#ED0ABB"],
                        locations: [0, 1],
                        start: { x: 1.0263092128417304, y: 0.5294252532614323 },
                        end: { x: -0.02630921284173038, y: 0.4705747467385677 },
                      }}
                    >
                      Complete profile
                    </GradientButton>
                  ) : null}
                </>
              )}
            </View>
          ) : null}
        </View>

        <View tw="px-2 py-3">
          {isLoading ? (
            <>
              <Skeleton height={24} width={150} show={true} />
              <View tw="h-2" />
              <Skeleton height={12} width={100} show={true} />
            </>
          ) : (
            <View tw="flex-row items-start justify-between">
              <View tw="flex-1">
                <Text
                  tw="max-w-45 text-2xl font-extrabold text-gray-900 dark:text-white"
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
                  : `Your next claim will be available ${getFormatDistanceToNowStrict(
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
            <ProfileFollows
              profileId={profileId}
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
