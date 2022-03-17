import { memo, useCallback } from "react";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import {
  FollowerUser,
  useFollowersList,
} from "app/hooks/api/use-followers-list";
import { useFollowingList } from "app/hooks/api/use-following-list";
import { Link } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

import { View, Text, Skeleton, Button } from "design-system";
import { useColorScheme } from "design-system/hooks";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";

type FollowingListProp = {
  follow: (profileId: number) => void;
  unFollow: (profileId: number) => void;
  hideSheet: () => void;
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
        tw={`flex-row justify-between items-center h-[${ITEM_HEIGHT}px] overflow-hidden`}
      >
        <Link href={`/profile/${item.wallet_address}`} onPress={hideSheet}>
          <View tw="flex-row">
            <View tw="h-8 w-8 bg-gray-200 rounded-full mr-2">
              <Image source={{ uri: item.img_url }} tw="h-8 w-8 rounded-full" />
            </View>
            <View tw="mr-1 justify-center">
              {item.name ? (
                <Text
                  tw="text-sm text-gray-600 dark:text-gray-300 font-semibold mb-[1px] max-w-[150px]"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              ) : null}

              <View tw="items-center flex-row">
                <Text
                  tw="text-sm text-gray-900 dark:text-white font-semibold max-w-[150px]"
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

export const FollowersList = (
  props: {
    profileId?: number;
    isFollowingUser: (profileId: number) => boolean;
  } & FollowingListProp
) => {
  const { data, loading } = useFollowersList(props.profileId);
  const keyExtractor = useCallback((item) => item.profile_id, []);
  const getItemLayout = useCallback(
    (_, index) => ({
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
          isFollowingUser={props.isFollowingUser(item.profile_id)}
          follow={props.follow}
          unFollow={props.unFollow}
          hideSheet={props.hideSheet}
        />
      );
    },
    [props.isFollowingUser, props.unFollow, props.follow, props.hideSheet]
  );

  if (data && data.list?.length > 0) {
    return (
      <BottomSheetFlatList
        data={data.list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={Separator}
      />
    );
  } else if (loading) {
    return <FollowingUserItemLoadingIndicator />;
  } else if (data?.list?.length === 0) {
    return <Text tw="dark:text-gray-100 text-gray-900">No Results found</Text>;
  }

  return <></>;
};

export const FollowingList = (
  props: {
    profileId?: number;
    isFollowingUser: (profileId: number) => boolean;
  } & FollowingListProp
) => {
  const { data, loading } = useFollowingList(props.profileId);
  const keyExtractor = useCallback((item) => item.profile_id, []);

  const getItemLayout = useCallback(
    (_, index) => ({
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
          isFollowingUser={props.isFollowingUser(item.profile_id)}
          follow={props.follow}
          unFollow={props.unFollow}
          hideSheet={props.hideSheet}
        />
      );
    },
    [props.isFollowingUser, props.unFollow, props.follow, props.hideSheet]
  );

  if (data && data.list?.length > 0) {
    return (
      <BottomSheetFlatList
        data={data.list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={Separator}
      />
    );
  } else if (loading) {
    return <FollowingUserItemLoadingIndicator />;
  } else if (data?.list?.length === 0) {
    return (
      <View tw="items-center">
        <Text tw="dark:text-gray-100 text-gray-900">No Results found</Text>
      </View>
    );
  }

  return <></>;
};

const FollowingUserItemLoadingIndicator = () => {
  const colorMode = useColorScheme();

  return (
    <View tw="px-4">
      {[1, 2, 3].map((v) => {
        return (
          <View tw="flex-row pt-4" key={v}>
            <View tw="mr-2 rounded-full overflow-hidden">
              <Skeleton
                width={32}
                height={32}
                show
                colorMode={colorMode as any}
              />
            </View>
            <View>
              <Skeleton
                width={100}
                height={14}
                show
                colorMode={colorMode as any}
              />
              <View tw="h-1" />
              <Skeleton
                width={80}
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
