import { useCallback, useRef, useState, useEffect } from "react";
import { Keyboard, Platform, TextInput } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";
import { AvoidSoftInput } from "react-native-avoid-softinput";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Close as CloseIcon,
  Search as SearchIcon,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Input } from "@showtime-xyz/universal.input";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { HeaderLeft } from "app/components/header";
import { SearchResponseItem, useSearch } from "app/hooks/api/use-search";
import { Link } from "app/navigation/link";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { formatAddressShort } from "app/utilities";

import { useSafeAreaInsets } from "design-system/safe-area";

const PT_2_UNIT = 8;

export const Search = () => {
  useHideHeader();
  const isDark = useIsDarkMode();
  const { top } = useSafeAreaInsets();
  const [term, setTerm] = useState("");
  const { loading, data } = useSearch(term);
  const inputRef = useRef<TextInput>();
  const Separator = useCallback(
    () => <View tw="h-[1px] bg-gray-200 dark:bg-gray-800" />,
    []
  );

  useEffect(() => {
    AvoidSoftInput.setEnabled(false);

    return () => {
      AvoidSoftInput.setEnabled(true);
    };
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SearchResponseItem>) => {
      return <SearchItem item={item} />;
    },
    []
  );

  // https://github.com/facebook/react-native/issues/23364#issuecomment-642518054
  // PR - https://github.com/facebook/react-native/pull/31943
  const keyboardDismissProp = Platform.select({
    ios: { keyboardDismissMode: "on-drag" } as const,
    android: { onScrollEndDrag: Keyboard.dismiss } as const,
  });

  return (
    <>
      <View
        tw="flex-row px-4 pb-2"
        style={{
          paddingTop: Platform.select({
            default: Math.max(top, PT_2_UNIT),
            android: Math.max(top, PT_2_UNIT * 4),
          }),
        }}
      >
        <View tw="flex-1 flex-row items-center">
          <View tw="mr-4">
            <HeaderLeft canGoBack />
          </View>
          <View tw="flex-1">
            <Input
              placeholder="Search for @name or name.eth"
              value={term}
              ref={inputRef}
              autoFocus
              onChangeText={setTerm}
              inputStyle={{
                paddingTop: Platform.select({
                  default: 8,
                  android: 6,
                }),
                paddingBottom: Platform.select({
                  default: 8,
                  android: 6,
                }),
              }}
              leftElement={
                <View tw="px-2">
                  <SearchIcon
                    color={isDark ? colors.gray[400] : colors.gray[600]}
                    width={24}
                    height={24}
                  />
                </View>
              }
              rightElement={
                term.length > 0 ? (
                  <PressableScale
                    style={{ paddingVertical: 4, paddingHorizontal: 8 }}
                    onPress={() => {
                      setTerm("");
                      inputRef.current?.focus();
                    }}
                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                  >
                    <CloseIcon
                      color={isDark ? colors.gray[400] : colors.gray[600]}
                      width={24}
                      height={24}
                    />
                  </PressableScale>
                ) : undefined
              }
            />
          </View>
        </View>
      </View>
      {data ? (
        <InfiniteScrollList
          data={data}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          keyboardShouldPersistTaps="handled"
          estimatedItemSize={64}
          {...keyboardDismissProp}
        />
      ) : loading && term ? (
        <SearchItemSkeleton />
      ) : null}
    </>
  );
};

export const SearchItem = ({
  item,
  onPress,
}: {
  item: SearchResponseItem;
  onPress?: () => void;
}) => {
  return (
    <Link
      href={`/@${item.username ?? item.address0}`}
      onPress={onPress}
      tw="p-4 duration-150 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <View tw="flex-row items-center justify-between">
        <View tw="flex-row">
          <View tw="mr-2 h-8 w-8 rounded-full bg-gray-200">
            {item.img_url && (
              <Image
                source={{ uri: item.img_url }}
                tw="rounded-full"
                width={32}
                height={32}
                alt={item.username ?? item.address0}
              />
            )}
          </View>
          <View tw="mr-1 justify-center">
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
                tw="text-sm font-semibold text-gray-900 dark:text-white"
                numberOfLines={1}
              >
                {item.username ? (
                  <>@{item.username}</>
                ) : (
                  <>{formatAddressShort(item.address0)}</>
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
      </View>
    </Link>
  );
};

export const SearchItemSkeleton = () => {
  return (
    <View tw="px-4 pb-4">
      {[1, 2, 3].map((v) => {
        return (
          <View tw="flex-row pt-4" key={v}>
            <View tw="mr-2 overflow-hidden rounded-full">
              <Skeleton width={32} height={32} show />
            </View>
            <View>
              <Skeleton width={100} height={14} show />
              <View tw="h-1" />
              <Skeleton width={80} height={14} show />
            </View>
          </View>
        );
      })}
    </View>
  );
};
