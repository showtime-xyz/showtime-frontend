import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { StyleProp, ViewStyle } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Check } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import data, { CountryDataType } from "./country-code-data";

type CountryCodePickerProps = {
  value: string;
  onChange: (value: string) => void;
  data?: CountryDataType[];
  style?: StyleProp<ViewStyle>;
  tw?: string;
};

const PickerContext = createContext<any>(null);

export const CountryCodePicker = (props: CountryCodePickerProps) => {
  const { onChange, value } = props;
  const sharedValue = useSharedValue(value);

  useEffect(() => {
    sharedValue.value = value;
  }, [sharedValue, value]);

  const contextValue = useMemo(() => {
    return {
      sharedValue: sharedValue,
      onChange: (item: CountryDataType) => {
        sharedValue.value = item.code;
        onChange(item.code);
      },
    };
  }, [onChange, sharedValue]);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CountryDataType>) => {
      return <PickerItem item={item} />;
    },
    []
  );
  const ItemSeparatorComponent = useCallback(
    () => <View tw="h-[1px] w-full bg-gray-200 dark:bg-gray-800" />,
    []
  );
  const keyExtractor = useCallback((item: CountryDataType) => item.code, []);
  return (
    <PickerContext.Provider value={contextValue}>
      <View
        tw={["flex-1 bg-white dark:bg-black", props?.tw ?? ""]}
        style={props.style}
      >
        <InfiniteScrollList
          useWindowScroll={false}
          data={props.data ?? data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
          keyboardShouldPersistTaps="handled"
          estimatedItemSize={64}
          overscan={{
            main: 64,
            reverse: 64,
          }}
        />
      </View>
    </PickerContext.Provider>
  );
};

const PickerItem = memo(({ item }: { item: CountryDataType }) => {
  const isDark = useIsDarkMode();
  const { onChange, sharedValue } = useContext(PickerContext);

  const handleChange = useCallback(() => {
    onChange(item);
  }, [item, onChange]);

  const style = useAnimatedStyle(() => {
    return {
      opacity: sharedValue.value === item.code ? 1 : 0,
    };
  });

  return (
    <PressableScale onPress={handleChange}>
      <View tw="flex-row items-center px-8 py-5 dark:bg-black">
        <Text tw="text-sm font-semibold dark:text-gray-100">
          {item.emoji} {item.name} ({item.dial_code})
        </Text>
        <Animated.View style={[style, { marginLeft: "auto" }]}>
          <Check height={24} width={24} color={isDark ? "#FFF" : "#000"} />
        </Animated.View>
      </View>
    </PressableScale>
  );
});

PickerItem.displayName = "PickerItem";

export { data };
