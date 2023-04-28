import { memo, useCallback } from "react";

import { Chip } from "@showtime-xyz/universal.chip";
import { Image } from "@showtime-xyz/universal.image";
import {
  InfiniteScrollList,
  InfiniteScrollListProps,
} from "@showtime-xyz/universal.infinite-scroll-list";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useMyInfo } from "app/hooks/api-hooks";
import { UserItemType } from "app/hooks/api/use-follow-list";
import { useFollow } from "app/hooks/use-follow";
import { useModalListProps } from "app/hooks/use-modal-list-props";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { Link } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

import { EmptyPlaceholder } from "./empty-placeholder";
import { FollowButton } from "./follow-button";

const SEPARATOR_HEIGHT = 1;
const ITEM_HEIGHT = 64;

type FollowingListProp = {
  follow: (profileId: number) => void;
  unFollow: (profileId: number) => void;
};
type UserListProps = Pick<InfiniteScrollListProps<any>, "style"> & {
  users?: UserItemType[];
  loading: boolean;
  emptyTitle?: string;
};
export const UserList = ({
  users,
  loading,
  emptyTitle = "No users, yet.",
  ...rest
}: UserListProps) => {
  const { follow, unfollow } = useMyInfo();

  const webListHeight =
    users && users?.length > 8
      ? "60vh"
      : (ITEM_HEIGHT + SEPARATOR_HEIGHT) * (users?.length ?? 3);

  const modalListProps = useModalListProps(webListHeight);
  const bottom = usePlatformBottomHeight();
  const keyExtractor = useCallback(
    (item: UserItemType) => `${item.profile_id}`,
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: UserItemType }) => {
      return (
        <FollowingListUser item={item} follow={follow} unFollow={unfollow} />
      );
    },
    [unfollow, follow]
  );
  const listEmptyComponent = useCallback(
    () => (
      <EmptyPlaceholder
        title={emptyTitle}
        tw="h-full min-h-[40px] flex-1 items-center justify-center"
        hideLoginBtn
      />
    ),
    [emptyTitle]
  );
  if (loading) {
    return <FollowingUserItemLoadingIndicator />;
  }

  return (
    <InfiniteScrollList
      data={users}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      estimatedItemSize={64}
      overscan={8}
      ListEmptyComponent={listEmptyComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
      {...modalListProps}
      {...rest}
    />
  );
};

const FollowingListUser = memo(
  ({ item }: { item: UserItemType } & FollowingListProp) => {
    const { data } = useMyInfo();

    const { onToggleFollow } = useFollow({
      username: data?.data.profile.username,
    });
    return (
      <View
        tw={`flex-row items-center justify-between overflow-hidden px-4`}
        style={{ height: ITEM_HEIGHT }}
      >
        <Link
          href={`/@${item.username ?? item.wallet_address}`}
          tw="flex-1"
          viewProps={{ style: { flex: 1 } }}
        >
          <View tw="flex-row">
            <View tw="mr-2 h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              {item?.img_url && (
                <Image
                  source={{ uri: item.img_url }}
                  alt={item.username ?? item.wallet_address ?? ""}
                  width={32}
                  height={32}
                />
              )}
            </View>
            <View tw="mr-1 flex-1 justify-center">
              {item.name ? (
                <>
                  <Text
                    tw="text-sm font-semibold text-gray-600 dark:text-gray-300"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View tw="h-1" />
                </>
              ) : null}

              <View tw="flex-row items-center">
                <Text
                  tw="max-w-[120px] text-sm font-semibold text-gray-900 dark:text-white"
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
                {item?.follows_you ? (
                  <Chip label="Follows You" tw="ml-1 py-1" />
                ) : null}
              </View>
            </View>
          </View>
        </Link>
        <View tw="max-w-[120px]">
          <FollowButton
            profileId={item.profile_id}
            name={item.name}
            onToggleFollow={onToggleFollow}
          />
        </View>
      </View>
    );
  }
);
FollowingListUser.displayName = "FollowingListUser";

const FollowingUserItemLoadingIndicator = () => {
  return (
    <View tw="px-4">
      {new Array(8).fill(0).map((_, i) => {
        return (
          <View tw="flex-row pt-4" key={`${i}`}>
            <View tw="mr-2 overflow-hidden rounded-full">
              <Skeleton width={32} height={32} show />
            </View>
            <View>
              <Skeleton width={140} height={14} show />
              <View tw="h-1" />
              <Skeleton width={90} height={14} show />
            </View>
          </View>
        );
      })}
    </View>
  );
};
