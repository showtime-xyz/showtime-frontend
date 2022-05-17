import { useCallback } from "react";
import {
  NativeSegmentedControlIOSChangeEvent,
  NativeSyntheticEvent,
} from "react-native";

import RNSegmentedControl from "@react-native-segmented-control/segmented-control";
import { useTailwind } from "tailwindcss-react-native";

import { useIsDarkMode } from "design-system/hooks";
import { colors } from "design-system/tailwind/colors";

type SegmentedControlProps = {
  values: Array<string>;
  selectedIndex: number;
  onChange: (newIndex: number) => void;
};

export const SegmentedControl = (props: SegmentedControlProps) => {
  const tailwind = useTailwind();
  const { values, selectedIndex, onChange } = props;
  const handleChange = useCallback(
    (e: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => {
      onChange?.(e.nativeEvent.selectedSegmentIndex);
    },
    [onChange]
  );

  const isDark = useIsDarkMode();

  return (
    <RNSegmentedControl
      values={values}
      selectedIndex={selectedIndex}
      onChange={handleChange}
      style={tailwind("rounded-lg")}
      backgroundColor={isDark ? colors.gray[900] : colors.gray[100]}
      tintColor={isDark ? colors.white : colors.gray[900]}
      // TODO: review this. type issue
      fontStyle={tailwind("font-bold dark:text-gray-400 text-gray-600")}
      activeFontStyle={tailwind("font-bold dark:text-gray-900 text-white")}
    />
  );
};
