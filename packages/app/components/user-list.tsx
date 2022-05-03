import { memo, useCallback } from "react";
import { FlatList, Platform } from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { useMyInfo } from "app/hooks/api-hooks";
import { FollowerUser } from "app/hooks/api/use-followers-list";
import { Link } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

import { Button, Skeleton, Text, View } from "design-system";
import { useColorScheme } from "design-system/hooks";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";

import { EmptyPlaceholder } from "./empty-placeholder";

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
  users?: FollowerUser[];
  onClose: () => void;
  loading: boolean;
}) => {
  const { isFollowing, follow, unfollow } = useMyInfo();

  const keyExtractor = useCallback(
    (item: FollowerUser) => `${item.profile_id}`,
    []
  );

  const getItemLayout = useCallback(
    (_: FollowerUser[] | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );
  const renderItem = useCallback(
    ({ item }: { item: FollowerUser }) => {
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
    return Platform.select({
      default: (
        <BottomSheetFlatList
          data={users}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          windowSize={10}
          initialNumToRender={10}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={Separator}
        />
      ),
      web: (
        <FlatList
          data={users}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          windowSize={10}
          initialNumToRender={10}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={Separator}
        />
      ),
    });
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
    follow,
    unFollow,
    hideSheet,
  }: { item: FollowerUser; isFollowingUser: boolean } & FollowingListProp) => {
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
                <Text
                  tw="mb-[1px] max-w-[150px] text-sm font-semibold text-gray-600 dark:text-gray-300"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
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
        {isFollowingUser ? (
          <Button onPress={() => unFollow(item.profile_id)} variant="tertiary">
            Following
          </Button>
        ) : (
          <Button onPress={() => follow(item.profile_id)}>Follow</Button>
        )}
      </View>
    );
  }
);

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
