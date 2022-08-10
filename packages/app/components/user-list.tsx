import { memo, useCallback } from "react";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Image } from "@showtime-xyz/universal.image";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useMyInfo } from "app/hooks/api-hooks";
import { UserItemType } from "app/hooks/api/use-follow-list";
import { useFollow } from "app/hooks/use-follow";
import { useModalListProps } from "app/hooks/use-modal-list-props";
import { InfiniteScrollList } from "app/lib/infinite-scroll-list";
import { Link } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

import { EmptyPlaceholder } from "./empty-placeholder";
import { FollowButton } from "./follow-button";

type FollowingListProp = {
  follow: (profileId: number) => void;
  unFollow: (profileId: number) => void;
  hideSheet: () => void;
};

export const UserList = ({
  users,
  loading,
  onClose,
}: {
  users?: UserItemType[];
  onClose: () => void;
  loading: boolean;
}) => {
  const { isFollowing, follow, unfollow } = useMyInfo();
  const modalListProps = useModalListProps();

  const keyExtractor = useCallback(
    (item: UserItemType) => `${item.profile_id}`,
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: UserItemType }) => {
      return (
        <FollowingListUser
          item={item}
          isFollowingUser={isFollowing(item.profile_id)}
          follow={follow}
          unFollow={unfollow}
          hideSheet={onClose}
        />
      );
    },
    [isFollowing, unfollow, follow, onClose]
  );
  if (users && users?.length > 0) {
    return (
      <InfiniteScrollList
        data={users}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={64}
        overscan={64}
        ItemSeparatorComponent={Separator}
        {...modalListProps}
      />
    );
  } else if (loading) {
    return <FollowingUserItemLoadingIndicator />;
  } else if (users?.length === 0) {
    return <EmptyPlaceholder title="No results found" />;
  }
  return null;
};

const SEPARATOR_HEIGHT = 1;
const Separator = () => (
  <View tw={`bg-gray-200 dark:bg-gray-800 h-[${SEPARATOR_HEIGHT}px]`} />
);

const ITEM_HEIGHT = 64 + SEPARATOR_HEIGHT;

const FollowingListUser = memo(
  ({
    item,
    isFollowingUser,
    hideSheet,
  }: { item: UserItemType; isFollowingUser: boolean } & FollowingListProp) => {
    const { data } = useMyInfo();

    const { onToggleFollow } = useFollow({
      username: data?.data.profile.username,
    });
    return (
      <View
        tw={`flex-row items-center justify-between h-[${ITEM_HEIGHT}px] overflow-hidden px-4`}
      >
        <Link
          href={`/@${item.username ?? item.wallet_address}`}
          onPress={hideSheet}
        >
          <View tw="flex-row">
            <View tw="mr-2 h-8 w-8 rounded-full bg-gray-200">
              {item?.img_url && (
                <Image
                  source={{ uri: item.img_url }}
                  tw="h-8 w-8 rounded-full"
                />
              )}
            </View>
            <View tw="mr-1 justify-center">
              {item.name ? (
                <>
                  <Text
                    tw="max-w-[150px] text-sm font-semibold text-gray-600 dark:text-gray-300"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View tw="h-1" />
                </>
              ) : null}

              <View tw="flex-row items-center">
                <Text
                  tw="max-w-[150px] text-sm font-semibold text-gray-900 dark:text-white"
                  numberOfLines={1}
                >
                  {item.username ? (
                    <>@{item.username}</>
                  ) : (
                    <>{formatAddressShort(item.wallet_address)}</>
                  )}
                </Text>
                {Boolean(item.verified) && (
                  <View tw="ml-1">
                    <VerificationBadge size={14} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Link>
        <FollowButton
          isFollowing={isFollowingUser}
          profileId={item.profile_id}
          name={item.name}
          onToggleFollow={onToggleFollow}
        />
      </View>
    );
  }
);
FollowingListUser.displayName = "FollowingListUser";

const FollowingUserItemLoadingIndicator = () => {
  const colorMode = useColorScheme();

  return (
    <View tw="px-4">
      {new Array(8).fill(0).map((_, i) => {
        return (
          <View tw="flex-row pt-4" key={`${i}`}>
            <View tw="mr-2 overflow-hidden rounded-full">
              <Skeleton
                width={32}
                height={32}
                show
                colorMode={colorMode as any}
              />
            </View>
            <View>
              <Skeleton
                width={140}
                height={14}
                show
                colorMode={colorMode as any}
              />
              <View tw="h-1" />
              <Skeleton
                width={90}
                height={14}
                show
                colorMode={colorMode as any}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};
