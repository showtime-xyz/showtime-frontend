import RNSegmentedControl from "@react-native-segmented-control/segmented-control";
import { useCallback } from "react";
import {
  NativeSegmentedControlIOSChangeEvent,
  NativeSyntheticEvent,
} from "react-native";
import { colors } from "@showtime/universal-ui.tailwind";
import { useIsDarkMode } from "@showtime/universal-ui.hooks";
import { tw } from "@showtime/universal-ui.tailwind";

type SegmentedControlProps = {
  values: Array<string>;
  selectedIndex: number;
  onChange: (newIndex: number) => void;
};

export const SegmentedControl = (props: SegmentedControlProps) => {
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
      style={tw.style("rounded-lg")}
      backgroundColor={isDark ? colors.gray[900] : colors.gray[100]}
      tintColor={isDark ? colors.white : colors.gray[900]}
      fontStyle={tw.style("font-bold dark:text-gray-400 text-gray-600")}
      activeFontStyle={tw.style("font-bold dark:text-gray-900 text-white")}
    />
  );
};
