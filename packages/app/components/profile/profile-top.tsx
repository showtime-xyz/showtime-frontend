import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

import reactStringReplace from "react-string-replace";

import { ProfileDropdown } from "app/components/profile-dropdown";
import { MAX_COVER_WIDTH } from "app/constants/layout";
import { useMyInfo, useUserProfile } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import {
  BottomTabBarHeightContext,
  useBottomTabBarHeight,
} from "app/lib/react-navigation/bottom-tabs";
import { TextLink } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";

import { Button, ModalSheet, Skeleton, Text, View } from "design-system";
import { Avatar } from "design-system/avatar";
import { Hidden } from "design-system/hidden";
import { useColorScheme } from "design-system/hooks";
import { Image } from "design-system/image";
import { Pressable } from "design-system/pressable-scale";
import { TW } from "design-system/tailwind/types";
import { VerificationBadge } from "design-system/verification-badge";

import { getProfileImage, getProfileName } from "../../utilities";
import { FollowersList, FollowingList } from "../following-user-list";

type FollowProps = {
  onPressFollowing: () => void;
  onPressFollower: () => void;
  followingCount?: number;
  followersCount?: number;
  tw?: TW;
};
const Follow = ({
  onPressFollowing,
  onPressFollower,
  followingCount,
  followersCount,
  tw,
}: FollowProps) => {
  return (
    <View tw={`flex-row ${tw}`} pointerEvents="box-none">
      <Pressable onPress={onPressFollowing}>
        <Text tw="text-sm font-bold text-gray-900 dark:text-white">
          {`${followingCount ?? 0} `}
          <Text tw="font-medium">following</Text>
        </Text>
      </Pressable>
      <View tw="ml-8 md:ml-4" pointerEvents="box-none">
        <Pressable onPress={onPressFollower}>
          <Text tw="text-sm font-bold text-gray-900 dark:text-white">
            {`${followersCount ?? 0} `}
            <Text tw="font-medium">followers</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export const ProfileTop = ({
  address,
  isBlocked,
}: {
  address: string | null;
  isBlocked: boolean;
}) => {
  const router = useRouter();
  const userId = useCurrentUserId();
  const { data: profileData, loading } = useUserProfile({ address });
  const name = getProfileName(profileData?.data.profile);
  const username = profileData?.data.profile.username;
  const bio = profileData?.data.profile.bio;
  const hasLinksInBio = useRef<boolean>(false);
  const colorMode = useColorScheme();
  const { width } = useWindowDimensions();
  const { isFollowing, follow, unfollow } = useMyInfo();
  const tabBarHeight = useContext(BottomTabBarHeightContext)
    ? useBottomTabBarHeight()
    : 0;
  const profileId = profileData?.data.profile.profile_id;
  const isFollowingUser = useMemo(
    () => profileId && isFollowing(profileId),
    [profileId, isFollowing]
  );
  const { unblock } = useBlock();
  const [showBottomSheet, setShowBottomSheet] = useState<
    "followers" | "following" | null
  >(null);
  const bioWithMentions = useMemo(
    () =>
      reactStringReplace(
        bio,
        /@([\w\d-]+?)\b/g,
        (username: string, i: number) => {
          hasLinksInBio.current = true;
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
  const coverImageHeight = useMemo(() => (width < 768 ? 120 : 180), [width]);

  useEffect(() => {
    Platform.OS === "web" && setShowBottomSheet(null);
  }, [address]);

  return (
    <>
      <View pointerEvents="box-none">
        <View
          tw={`overflow-hidden bg-gray-100 dark:bg-gray-900 xl:-mx-20 xl:rounded-b-[32px]`}
          pointerEvents="none"
        >
          <Skeleton
            height={coverImageHeight}
            width={width < MAX_COVER_WIDTH ? width : MAX_COVER_WIDTH}
            show={loading}
            colorMode={colorMode as any}
          >
            {profileData?.data.profile.cover_url && (
              <Image
                source={{ uri: profileData?.data.profile.cover_url }}
                tw={`h-[${coverImageHeight}px] w-100 web:object-cover`}
                alt="Cover image"
                resizeMethod="resize"
                resizeMode="cover"
              />
            )}
          </Skeleton>
        </View>

        <View tw="bg-white px-2 dark:bg-black" pointerEvents="box-none">
          <View tw="flex-row justify-between pr-2" pointerEvents="box-none">
            <View tw="flex-row items-end" pointerEvents="none">
              <View tw="mt-[-72px] rounded-full bg-white p-2 dark:bg-black">
                <Skeleton
                  height={128}
                  width={128}
                  show={loading}
                  colorMode={colorMode as any}
                  radius={99999}
                >
                  {profileData && (
                    <Avatar
                      url={getProfileImage(profileData?.data.profile)}
                      size={128}
                    />
                  )}
                </Skeleton>
              </View>
            </View>

            {address ? (
              <View tw="flex-row items-center" pointerEvents="box-none">
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
                        onPressFollower={() => setShowBottomSheet("followers")}
                        onPressFollowing={() => setShowBottomSheet("following")}
                        followersCount={profileData?.data.followers_count}
                        followingCount={profileData?.data.following_count}
                        tw="mr-8"
                      />
                    </Hidden>
                    {profileId && userId !== profileId ? (
                      <>
                        <ProfileDropdown user={profileData?.data.profile} />
                        <View tw="w-2" />
                        <Button
                          size={width < 768 ? "small" : "regular"}
                          onPress={() => {
                            if (isFollowingUser) {
                              unfollow(profileId);
                            } else {
                              follow(profileId);
                            }
                          }}
                        >
                          {isFollowingUser ? "Following" : "Follow"}
                        </Button>
                      </>
                    ) : userId === profileId ? (
                      <Button
                        size="small"
                        onPress={() => {
                          router.push(`/profile/edit`);
                        }}
                      >
                        Edit profile
                      </Button>
                    ) : null}
                  </>
                )}
              </View>
            ) : null}
          </View>

          <View tw="px-2 py-3" pointerEvents="box-none">
            <View pointerEvents="none">
              <Skeleton
                height={24}
                width={150}
                show={loading}
                colorMode={colorMode as any}
              >
                <Text
                  variant="text-2xl"
                  tw="font-extrabold text-gray-900 dark:text-white"
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </Skeleton>

              <View tw="h-2" />

              <Skeleton
                height={12}
                width={100}
                show={loading}
                colorMode={colorMode as any}
              >
                <View tw="flex-row items-center">
                  <Text
                    variant="text-base"
                    tw="font-semibold text-gray-900 dark:text-white"
                  >
                    {username ? `@${username}` : null}
                  </Text>

                  {profileData?.data.profile.verified ? (
                    <View tw="ml-1">
                      <VerificationBadge size={16} />
                    </View>
                  ) : null}
                  {/* {profileData?.data ? (
                <View tw="bg-gray-100 dark:bg-gray-900 ml-2 h-[23px] px-2 justify-center rounded-full">
                  <Text
                    variant="text-xs"
                    tw="dark:text-gray-400 text-gray-500 font-semibold"
                  >
                    Follows You
                  </Text>
                </View>
              ) : null} */}
                </View>
              </Skeleton>
            </View>

            {bio ? (
              <View
                tw="mt-3 flex-row items-center"
                pointerEvents={hasLinksInBio.current ? "box-none" : "none"}
              >
                <Text tw="text-sm text-gray-600 dark:text-gray-400">
                  {`${bioWithMentions}`}
                </Text>
              </View>
            ) : null}
            <Hidden from="md">
              <Follow
                onPressFollower={() => setShowBottomSheet("followers")}
                onPressFollowing={() => setShowBottomSheet("following")}
                followersCount={profileData?.data.followers_count}
                followingCount={profileData?.data.following_count}
                tw="mt-4"
              />
            </Hidden>

            {/* <View>
            <View tw="flex-row items-center">
              <Text tw="text-gray-600 dark:text-gray-400 font-medium text-xs">
                Followed by{" "}
              </Text>
              <Pressable>
                <Text tw="dark:text-white text-gray-900 font-bold text-xs">
                  @m1guelpf
                </Text>
              </Pressable>
            </View>
          </View> */}
          </View>
        </View>
      </View>
      <ModalSheet
        snapPoints={["85%", "100%"]}
        title={showBottomSheet === "followers" ? "Followers" : "Following"}
        visible={
          showBottomSheet === "followers" || showBottomSheet === "following"
        }
        close={() => setShowBottomSheet(null)}
        onClose={() => setShowBottomSheet(null)}
      >
        <>
          {showBottomSheet === "followers" ? (
            <FollowersList
              profileId={profileId}
              hideSheet={() => setShowBottomSheet(null)}
            />
          ) : showBottomSheet === "following" ? (
            <FollowingList
              profileId={profileId}
              hideSheet={() => setShowBottomSheet(null)}
            />
          ) : (
            <></>
          )}
          <View tw={`h-[${tabBarHeight}px]`} />
        </>
      </ModalSheet>
    </>
  );
};
