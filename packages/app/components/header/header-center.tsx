import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Platform, TextInput } from "react-native";

import * as Popover from "@radix-ui/react-popover";
import { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Close, Search } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Input } from "@showtime-xyz/universal.input";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { SearchItem, SearchItemSkeleton } from "app/components/search";
import { SearchResponseItem, useSearch } from "app/hooks/api/use-search";
import { ShowtimeTabBarIcon } from "app/navigation/tab-bar-icons";

const SearchInHeader = () => {
  const isDark = useIsDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const [term, setTerm] = useState("");
  const { loading, data } = useSearch(term);
  const inputRef = useRef<TextInput>();

  // since the search returns weird results with "undefined" in the list, we filter them out
  const filteredData = useMemo(
    () => data?.filter((item) => item.username || item.address),
    [data]
  );

  useEffect(() => {
    if (term !== "" && term.length > 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [term]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SearchResponseItem>) => {
      return (
        <SearchItem
          item={item}
          onPress={() => {
            setIsOpen(false);
          }}
        />
      );
    },
    [setIsOpen]
  );
  if (Platform.OS !== "web") return null;
  return (
    <Popover.Root modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger />
      <Popover.Anchor>
        <Input
          placeholder="Search for @name or name.eth"
          autocomplete="off"
          value={term}
          ref={inputRef}
          onChangeText={(text) => {
            setTerm(text);
            inputRef.current?.focus();
          }}
          leftElement={
            <View tw="h-12 w-12 items-center justify-center rounded-full">
              <Search
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  width: 24,
                  height: 24,
                }}
                color={isDark ? colors.gray[400] : colors.gray[500]}
                width={24}
                height={24}
              />
            </View>
          }
          rightElement={
            term.length > 0 ? (
              <Popover.Close>
                <PressableScale
                  style={{ padding: 8 }}
                  onPress={() => {
                    setTerm("");
                    inputRef.current?.focus();
                  }}
                  hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                >
                  <Close
                    color={isDark ? colors.gray[400] : colors.gray[600]}
                    width={24}
                    height={24}
                  />
                </PressableScale>
              </Popover.Close>
            ) : undefined
          }
          inputStyle={{ width: 269 }}
        />
      </Popover.Anchor>

      <Popover.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <View tw="mt-2 w-[350px] overflow-hidden rounded-3xl bg-white dark:bg-black">
          {data ? (
            <InfiniteScrollList
              useWindowScroll={false}
              data={filteredData}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              estimatedItemSize={64}
              style={Platform.select({
                web: { height: "calc(50vh - 64px)" },
                default: {},
              })}
            />
          ) : loading && term ? (
            <SearchItemSkeleton />
          ) : null}
        </View>
      </Popover.Content>
    </Popover.Root>
  );
};
const HeaderCenter = ({ isDark }: { isDark?: boolean }) => {
  return (
    <View tw="flex flex-row">
      <ShowtimeTabBarIcon color={isDark ? "black" : "white"} tw="mr-4" />
      <View tw="hidden md:flex">
        <SearchInHeader />
      </View>
    </View>
  );
};

export default HeaderCenter;
