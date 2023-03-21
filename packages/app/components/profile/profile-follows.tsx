import { useCallback } from "react";
import { Platform } from "react-native";

import { formatToUSNumber } from "app/utilities";

import { PressableScale } from "design-system/pressable-scale";
import { useRouter } from "design-system/router";
import { Text } from "design-system/text";
import { View } from "design-system/view";

type FollowsProps = {
  followingCount?: number;
  followersCount?: number;
  tw?: string;
  profileId?: number | undefined;
};

export const ProfileFollows = ({
  followingCount,
  followersCount,
  tw = "",
  profileId,
}: FollowsProps) => {
  const router = useRouter();
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
