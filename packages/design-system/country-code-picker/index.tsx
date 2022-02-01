import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { FlatList } from "react-native";
import { Pressable } from "design-system/pressable-scale";
import { Text } from "design-system/text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import data, { CountryDataType } from "./country-code-data";
import { View } from "..";
import { tw } from "../tailwind";
import { Check } from "../icon";

type CountryCodePickerProps = {
  value: string;
  onChange: (value: string) => void;
  data?: CountryDataType[];
  tw?: string;
};

const PickerContext = createContext<any>(null);

export const CountryCodePicker = (props: CountryCodePickerProps) => {
  const { onChange, value } = props;
  const sharedValue = useSharedValue(value);

  useEffect(() => {
    sharedValue.value = value;
  }, [value]);

  const contextValue = useMemo(() => {
    return {
      sharedValue: sharedValue,
      onChange: (item: CountryDataType) => {
        sharedValue.value = item.code;
        onChange(item.code);
      },
    };
  }, [onChange]);

  return (
    <PickerContext.Provider value={contextValue}>
      <FlatList
        ItemSeparatorComponent={() => <View tw="h-[1px] bg-gray-200 w-full" />}
        renderItem={useCallback(({ item }) => {
          return <PickerItem item={item} />;
        }, [])}
        style={tw.style(props.tw ?? "")}
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
    <Pressable onPress={handleChange}>
      <View tw="flex-row px-8 py-5 items-center">
        <Text tw="text-sm font-semibold">
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
    </Pressable>
  );
});
