import { useCallback, useRef, useState } from "react";
import { FlatList, Keyboard, Platform, TextInput } from "react-native";

import { SearchResponseItem, useSearch } from "app/hooks/api/use-search";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { Link } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

import { useColorScheme } from "design-system/hooks";
import { Close as CloseIcon, Search as SearchIcon } from "design-system/icon";
import { Image } from "design-system/image";
import { Input } from "design-system/input";
import { Pressable } from "design-system/pressable-scale";
import { Skeleton } from "design-system/skeleton";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

export const Search = () => {
  const headerHeight = useHeaderHeight();
  const [term, setTerm] = useState("");
  const { loading, data } = useSearch(term);
  const inputRef = useRef<TextInput>();
  const Separator = useCallback(
    () => <View tw="h-[1px] bg-gray-200 dark:bg-gray-800" />,
    []
  );
  const isiOS = Platform.OS === "ios";

  const renderItem = useCallback(({ item }) => {
    return <SearchItem item={item} />;
  }, []);

  // https://github.com/facebook/react-native/issues/23364#issuecomment-642518054
  // PR - https://github.com/facebook/react-native/pull/31943
  const keyboardDismissProp = Platform.select({
    ios: { keyboardDismissMode: "on-drag" } as const,
    android: { onScrollEndDrag: Keyboard.dismiss } as const,
  });

  return (
    <>
      {isiOS ? <View tw={`h-[${headerHeight}px]`} /> : null}
      <View tw="px-4 py-2">
        <Input
          placeholder="Search for @username or name.eth"
          value={term}
          ref={inputRef}
          autoFocus
          onChangeText={setTerm}
          leftElement={
            <View tw="p-2">
              <SearchIcon
                //@ts-ignore
                color={tw.style("dark:bg-gray-400 bg-gray-600").backgroundColor}
                width={24}
                height={24}
              />
            </View>
          }
          rightElement={
            term.length > 0 ? (
              <Pressable
                tw="p-2"
                onPress={() => {
                  setTerm("");
                  inputRef.current?.focus();
                }}
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              >
                <CloseIcon
                  //@ts-ignore
                  color={
                    tw.style("dark:bg-gray-400 bg-gray-600").backgroundColor
                  }
                  width={24}
                  height={24}
                />
              </Pressable>
            ) : undefined
          }
        />
      </View>
      {data ? (
        <FlatList
          data={data}
          contentContainerStyle={tw.style(`pb-[${headerHeight}px]`)}
          ListFooterComponent={
            isiOS ? <View tw={`h-[${headerHeight}px]`} /> : null
          }
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          keyboardShouldPersistTaps="handled"
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
  onPress: () => void;
}) => {
  return (
    <Link
      href={`/@${item.username ?? item.address0}`}
      onPress={onPress}
      tw="p-4"
    >
      <View tw="flex-row items-center justify-between">
        <View tw="flex-row">
          <View tw="mr-2 h-8 w-8 rounded-full bg-gray-200">
            {item.img_url && (
              <Image source={{ uri: item.img_url }} tw="h-8 w-8 rounded-full" />
            )}
          </View>
          <View tw="mr-1 justify-center">
            {item.name ? (
              <Text
                tw="mb-[1px] text-sm font-semibold text-gray-600 dark:text-gray-300"
                numberOfLines={1}
              >
                {item.name}
              </Text>
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
  const colorMode = useColorScheme();

  return (
    <View tw="px-4 pb-4">
      {[1, 2, 3].map((v) => {
        return (
          <View tw="flex-row pt-4" key={v}>
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
