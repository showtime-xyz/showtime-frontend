import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { FlatList } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Check } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import data, { CountryDataType } from "./country-code-data";

type CountryCodePickerProps = {
  value: string;
  onChange: (value: string) => void;
  data?: CountryDataType[];
};

const PickerContext = createContext<any>(null);

export const CountryCodePicker = (props: CountryCodePickerProps) => {
  const { onChange, value } = props;
  const sharedValue = useSharedValue(value);

  useEffect(() => {
    sharedValue.value = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const contextValue = useMemo(() => {
    return {
      sharedValue: sharedValue,
      onChange: (item: CountryDataType) => {
        sharedValue.value = item.code;
        onChange(item.code);
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);

  return (
    <PickerContext.Provider value={contextValue}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={useCallback(
          () => (
            <View tw="h-[1px] w-full bg-gray-200 dark:bg-gray-800" />
          ),
          []
        )}
        renderItem={useCallback(({ item }) => {
          return <PickerItem item={item} />;
        }, [])}
        style={tw.style("dark:bg-black")}
        keyExtractor={useCallback((item) => item.code, [])}
        data={props.data ?? data}
      />
    </PickerContext.Provider>
  );
};

const PickerItem = memo(({ item }: { item: CountryDataType }) => {
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
          <Check
            height={24}
            width={24}
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Animated.View>
      </View>
    </PressableScale>
  );
});

PickerItem.displayName = "PickerItem";

export { data };
