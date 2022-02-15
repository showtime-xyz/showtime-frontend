import { useCallback, useRef, useState } from "react";
import { Keyboard, Platform, TextInput } from "react-native";
import { FlatList } from "react-native";

import { SearchResponseItem, useSearch } from "app/hooks/api/use-search";
import { Link } from "app/navigation/link";
import { formatAddressShort } from "app/utilities";

import { useColorScheme } from "design-system/hooks";
import CloseIcon from "design-system/icon/Close";
import SearchIcon from "design-system/icon/Search";
import { Image } from "design-system/image";
import { Input } from "design-system/input";
import { Pressable } from "design-system/pressable-scale";
import { Skeleton } from "design-system/skeleton";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

export const Search = () => {
  const [term, setTerm] = useState("");
  const { loading, data } = useSearch(term);
  const inputRef = useRef<TextInput>();
  const Separator = useCallback(
    () => <View tw={`bg-gray-200 dark:bg-gray-800 h-[1px]`} />,
    []
  );

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
      <View tw="p-4">
        <Input
          placeholder="Search..."
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

const SearchItem = ({ item }: { item: SearchResponseItem }) => {
  return (
    <Link href={`/profile/${item.address0}`} tw="p-4">
      <View tw="flex-row justify-between items-center">
        <View tw="flex-row">
          <View tw="h-8 w-8 bg-gray-200 rounded-full mr-2">
            <Image source={{ uri: item.img_url }} tw="h-8 w-8 rounded-full" />
          </View>
          <View tw="mr-1 justify-between">
            <Text tw="text-sm text-gray-600 dark:text-gray-300 font-semibold">
              {item.name}
            </Text>
            <View tw="items-center flex-row">
              <Text tw="text-sm text-gray-900 dark:text-white font-semibold">
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

const SearchItemSkeleton = () => {
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
