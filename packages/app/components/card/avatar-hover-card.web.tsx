import { useMemo } from "react";

import * as HoverCard from "@radix-ui/react-hover-card";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { Chip } from "@showtime-xyz/universal.chip";
import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Image } from "@showtime-xyz/universal.image";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useUserProfile } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useFollow } from "app/hooks/use-follow";
import { linkifyDescription } from "app/lib/linkify";
import { Link, TextLink } from "app/navigation/link";
import { getFullSizeCover, getProfileImage, isMobileWeb } from "app/utilities";

import { FollowButton } from "../follow-button";
import { ProfileFollows } from "../profile/profile-follows";
import { AvatarHoverCardProps } from "./avatar-hover-card";

const CARD_WIDTH = 320;
export function AvatarHoverCard({
  username,
  url,
  ...rest
}: AvatarHoverCardProps) {
  const { data, isLoading } = useUserProfile({ address: username });
  const userId = useCurrentUserId();
  const { getIsBlocked, unblock } = useBlock();
  const profileData = data?.data;
  const isBlocked = getIsBlocked(profileData?.profile.profile_id);
  const bio = profileData?.profile.bio;
  const profileId = profileData?.profile.profile_id;
  const bioWithMentions = useMemo(() => linkifyDescription(bio), [bio]);
  const { colorScheme } = useColorScheme();

  const isSelf = userId === profileId;
  const { onToggleFollow } = useFollow({
    username: profileData?.profile.username,
  });

  if (isMobileWeb()) {
    return (
      <Link href={`/@${username}`}>
        <Avatar alt={"Avatar"} url={url} {...rest} />
      </Link>
    );
  }
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <div>
          <Link href={`/@${username}`}>
            <Avatar alt="Avatar" url={url} {...rest} />
          </Link>
        </div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="animate-fade-in dark:shadow-dark shadow-light w-80 overflow-hidden rounded-2xl bg-white dark:bg-black"
          sideOffset={5}
        >
          <View tw="overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Skeleton
              height={CARD_WIDTH / 3}
              width={CARD_WIDTH}
              show={isLoading}
              colorMode={colorScheme as any}
              radius={0}
            >
              {profileData?.profile.cover_url && (
                <Image
                  source={{
                    uri: getFullSizeCover(profileData?.profile.cover_url),
                  }}
                  resizeMode="cover"
                  width={CARD_WIDTH}
                  height={CARD_WIDTH / 3}
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_WIDTH / 3,
                  }}
                />
              )}
            </Skeleton>
          </View>
          <View tw="px-4 pb-4">
            <View tw="flex-row justify-between">
              <View tw="-m-2 -mt-10 rounded-full border-8 border-white dark:border-black">
                <Avatar
                  alt="Avatar"
                  size={112}
                  url={getProfileImage(profileData?.profile)}
                />
              </View>
              {isBlocked ? (
                <Button
                  size="regular"
                  onPress={() => {
                    unblock(profileId);
                  }}
                  tw="mt-2"
                >
                  Unblock
                </Button>
              ) : (
                profileData?.profile.profile_id &&
                !isSelf && (
                  <FollowButton
                    name={profileData?.profile.name}
                    size="regular"
                    profileId={profileData?.profile.profile_id}
                    onToggleFollow={onToggleFollow}
                    tw="mt-2"
                  />
                )
              )}
            </View>
            {isLoading ? (
              <View tw="w-full items-center">
                <Spinner />
              </View>
            ) : (
              <>
                {isBlocked ? (
                  <Text tw="text-gray-900 dark:text-white">
                    <Text tw="font-bold">@{username}</Text> is blocked
                  </Text>
                ) : (
                  <View tw="mt-4">
                    <Text
                      tw="font-space-bold text-xl font-extrabold text-gray-900 dark:text-white"
                      numberOfLines={2}
                    >
                      {profileData?.profile.name}
                    </Text>
                    <View tw="my-2 flex-row items-center">
                      {Boolean(username) && (
                        <TextLink
                          href={`/@${username}`}
                          tw="text-sm font-semibold text-gray-600 hover:underline dark:text-gray-400"
                        >
                          {`@${username}`}
                        </TextLink>
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
                    {bio ? (
                      <View tw="mt-4 items-baseline">
                        <ClampText
                          text={bioWithMentions}
                          maxLines={3}
                          tw="text-sm text-gray-900 dark:text-white"
                        />
                      </View>
                    ) : null}
                    <ProfileFollows
                      profileId={profileId}
                      followersCount={profileData?.followers_count}
                      followingCount={profileData?.following_count}
                      tw="mt-4"
                    />
                  </View>
                )}
              </>
            )}
          </View>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
