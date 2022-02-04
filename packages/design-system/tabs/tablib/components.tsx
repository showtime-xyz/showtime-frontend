import { Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  Extrapolate,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";

import { tw } from "design-system/tailwind";
import { useIsDarkMode } from "design-system/hooks";
import { View } from "design-system/view";
import { Text } from "design-system/text";
import { useTabIndexContext, useTabsContext } from "design-system/tabs/tablib";

type TabItemProps = {
  name: string;
  count?: number;
  selected?: boolean;
};

type SelectedTabIndicatorProps = {
  disableBackground?: boolean;
};

export const TabItem = ({ name, count }: TabItemProps) => {
  const { index } = useTabIndexContext();
  const { position, offset } = useTabsContext();

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

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          marginHorizontal: 16,
        },
        animatedStyle,
      ]}
    >
      <Text
        variant="text-sm"
        sx={{ fontWeight: "700" }}
        tw={`text-gray-900 dark:text-white`}
      >
        {name}{" "}
      </Text>

      <Text
        variant="text-sm"
        sx={{ fontWeight: "400" }}
        tw={`text-gray-900 dark:text-white`}
      >
        {count}
      </Text>
    </Animated.View>
  );
};

export const SelectedTabIndicator = (props: SelectedTabIndicatorProps) => {
  const disableBackground = props.disableBackground;

  if (Platform.OS === "web") {
    return null;
  }

  const isDark = useIsDarkMode();

  const { offset, position, tabItemLayouts } = useTabsContext();

  const animatedStyle = useAnimatedStyle(() => {
    const input = tabItemLayouts.map((_v, i) => i);
    const translateOutput = tabItemLayouts.map((v) => v.value?.x);
    const widthOutput = tabItemLayouts.map((v) => v.value?.width);
    const newPos = position.value + offset.value;
    if (
      translateOutput.some((v) => v === undefined) ||
      widthOutput.some((v) => v === undefined)
    ) {
      return {};
    } else {
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
            height: 2,
            position: "absolute",
            zIndex: 9999,
            width: "100%",
            // negative bottom to accomodate border bottom of 1px
            bottom: -1,
          },
          tw.style(`bg-gray-900 dark:bg-gray-100`),
        ]}
      />
      {disableBackground ? null : (
        <View
          sx={{
            backgroundColor: isDark
              ? "rgba(229, 231, 235, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
            paddingY: 16,
            borderRadius: 999,
          }}
        />
      )}
    </Animated.View>
  );
};
