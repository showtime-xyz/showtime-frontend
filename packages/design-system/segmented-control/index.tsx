// import { useCallback } from "react";
// import {
//   NativeSegmentedControlIOSChangeEvent,
//   NativeSyntheticEvent,
// } from "react-native";

// import RNSegmentedControl from "@react-native-segmented-control/segmented-control";

// import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
// import { colors } from "@showtime-xyz/universal.tailwind";

// type SegmentedControlProps = {
//   values: Array<string>;
//   selectedIndex: number;
//   onChange: (newIndex: number) => void;
// };

// export const SegmentedControl = (props: SegmentedControlProps) => {
//   const isDark = useIsDarkMode();
//   const { values, selectedIndex, onChange } = props;
//   const handleChange = useCallback(
//     (e: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => {
//       onChange?.(e.nativeEvent.selectedSegmentIndex);
//     },
//     [onChange]
//   );

//   return (
//     <RNSegmentedControl
//       values={values}
//       selectedIndex={selectedIndex}
//       onChange={handleChange}
//       style={{
//         borderRadius: 8,
//       }}
//       backgroundColor={isDark ? colors.gray[900] : colors.gray[100]}
//       tintColor={isDark ? colors.white : colors.gray[900]}
//       fontStyle={{
//         color: isDark ? colors.gray[400] : colors.gray[600],
//         fontWeight: "bold",
//       }}
//       activeFontStyle={{
//         color: isDark ? colors.gray[900] : colors.white,
//         fontWeight: "bold",
//       }}
//     />
//   );
// };
