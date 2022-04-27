import { useMemo } from "react";
import { Platform, Text as RNText } from "react-native";

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useIsDarkMode } from "design-system/hooks";
import { useTabIndexContext, useTabsContext } from "design-system/tabs/tablib";
import { tw } from "design-system/tailwind";
import { colors } from "design-system/tailwind/colors";
import { Text } from "design-system/text";
import { fontFamily } from "design-system/typography";
import { View } from "design-system/view";

const TAB_ITEM_PADDING_HORIZONTAL = 16;

type TabItemProps = {
  name: string;
  count?: number;
  selected?: boolean;
};

export const TabItem = ({ name, count, selected }: TabItemProps) => {
  const { index } = useTabIndexContext();
  const { position, offset } = useTabsContext();
  const isDark = useIsDarkMode();
  const animatedStyle = useAnimatedStyle(() => {
    const newPos = position.value + offset.value;

    return {
      opacity: interpolate(
        newPos,
        [index - 1, index, index + 1],
        [0.7, 1, 0.7],
        Extrapolate.CLAMP
      ),
    };
  });
  const getTextStyle = useMemo(() => {
    if (Platform.OS !== "web") {
      return {
        color: isDark ? colors.white : colors.gray[900],
      };
    }
    const selectedColor = isDark ? colors.white : colors.gray[900];
    const unselectedColor = isDark ? colors.gray[400] : colors.gray[600];
    const color = selected ? selectedColor : unselectedColor;
    return {
      color,
    };
  }, [isDark, selected]);

  return (
    <Animated.View
      style={[
        tw.style("flex-row justify-center items-center h-full px-4"),
        Platform.OS !== "web" && animatedStyle,
      ]}
    >
      <RNText
        style={[
          tw.style("text-sm"),
          { fontFamily: fontFamily("Inter-Bold") },
          getTextStyle,
        ]}
      >
        {name}
      </RNText>
      {count ? (
        <Text
          variant="text-sm"
          sx={{ fontWeight: "400" }}
          tw={`text-gray-900 dark:text-white`}
        >
          {` ${count}`}
        </Text>
      ) : null}
    </Animated.View>
  );
};

export const SelectedTabIndicator = () => {
  if (Platform.OS === "web") {
    return null;
  }

  const isDark = useIsDarkMode();

  const { offset, position, tabItemLayouts } = useTabsContext();

  const animatedStyle = useAnimatedStyle(() => {
    const input = tabItemLayouts.map((_v, i) => i);
    let translateOutput = tabItemLayouts.map((v) => v.value?.x);
    let widthOutput = tabItemLayouts.map((v) => v.value?.width);
    const newPos = position.value + offset.value;
    if (
      translateOutput.some((v) => v === undefined) ||
      widthOutput.some((v) => v === undefined)
    ) {
      return {};
    } else {
      widthOutput = widthOutput.map((e) =>
        typeof e === "number" ? e - TAB_ITEM_PADDING_HORIZONTAL * 2 : 0
      );
      translateOutput = translateOutput.map((e) =>
        typeof e === "number" ? e + TAB_ITEM_PADDING_HORIZONTAL : 0
      );

      return {
        //@ts-ignore - widthOut won't be undefined as we check above
        width: interpolate(newPos, input, widthOutput, Extrapolate.CLAMP),
        transform: [
          {
            translateX: interpolate(
              newPos,
              input,
              //@ts-ignore - translateOutput won't be undefined as we check above
              translateOutput,
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    }
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          height: "100%",
          justifyContent: "center",
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          {
            // negative bottom to accomodate border bottom of 1px
            bottom: -1,
          },
          tw.style(`bg-gray-900 dark:bg-gray-100 h-0.5 absolute z-50 w-full`),
        ]}
      />
      {/* {disableBackground ? null : (
        <View
          sx={{
            backgroundColor: isDark
              ? "rgba(229, 231, 235, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
            paddingY: 16,
            borderRadius: 999,
          }}
        />
      )} */}
    </Animated.View>
  );
};
