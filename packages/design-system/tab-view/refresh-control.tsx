import React, { memo } from "react";
import { ActivityIndicator, StyleSheet, TextInput } from "react-native";

import Animated, {
  createAnimatedPropAdapter,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { useRefreshDerivedValue } from "./hooks";
import { RefreshControlProps, RefreshTypeEnum } from "./types";

type RefreshControlContainerProps = {
  top: number;
  refreshHeight: number;
  overflowPull: number;
  opacityValue: Animated.SharedValue<number>;
  refreshValue: Animated.SharedValue<number>;
  isRefreshing: Animated.SharedValue<boolean>;
  isRefreshingWithAnimation: Animated.SharedValue<boolean>;
  pullExtendedCoefficient: number;
  renderContent?: (refreshProps: RefreshControlProps) => React.ReactElement;
  refreshControlColor?: string;
};

const RefreshControlContainer: React.FC<RefreshControlContainerProps> = ({
  top,
  refreshHeight,
  overflowPull,
  opacityValue,
  refreshValue,
  isRefreshing,
  isRefreshingWithAnimation,
  pullExtendedCoefficient,
  renderContent,
  refreshControlColor = "#999999",
}) => {
  const refreshType = useSharedValue<RefreshTypeEnum>(RefreshTypeEnum.Idle);
  const progress = useDerivedValue(() => {
    if (isRefreshingWithAnimation.value) return 1;
    return Math.min(refreshValue.value / refreshHeight, 1);
  });

  const tranYValue = useRefreshDerivedValue({
    animatedValue: refreshValue,
    refreshHeight,
    overflowPull,
    pullExtendedCoefficient,
  });

  useAnimatedReaction(
    () => {
      return {
        prs: progress.value,
        isR: isRefreshing.value,
        isRA: isRefreshingWithAnimation.value,
      };
    },
    ({ prs, isR, isRA }) => {
      if (isR !== isRA) {
        refreshType.value = isR
          ? RefreshTypeEnum.Pending
          : RefreshTypeEnum.Finish;
        return;
      }
      if (isR) {
        refreshType.value = RefreshTypeEnum.Refreshing;
      } else {
        refreshType.value =
          prs < 1 ? RefreshTypeEnum.Cancel : RefreshTypeEnum.Success;
      }
    },
    [refreshHeight]
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityValue.value,
      transform: [
        {
          translateY: tranYValue.value,
        },
      ],
    };
  });

  const _renderContent = () => {
    const _props = makeChildProps();
    if (renderContent) {
      return React.cloneElement(renderContent(_props), makeChildProps());
    }
    return (
      <RefreshControlNormal
        {..._props}
        refreshControlColor={refreshControlColor}
      />
    );
  };

  const makeChildProps = () => {
    return {
      refreshValue,
      refreshType,
      progress,
    };
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { top: top - refreshHeight, height: refreshHeight },
        animatedStyle,
      ]}
    >
      {_renderContent()}
    </Animated.View>
  );
};

export default RefreshControlContainer;
const AnimatedText = Animated.createAnimatedComponent(TextInput);
const TextInputAdapter = createAnimatedPropAdapter(
  (props) => {
    "worklet";
    const keys = Object.keys(props);
    if (keys.includes("value")) {
      props.text = props.value;
      delete props.value;
    }
  },
  ["text"]
);
const RefreshControlNormal = memo<RefreshControlProps>(
  function RefreshControlNormal({ progress, refreshControlColor }) {
    const textInputProps = useAnimatedProps(
      () => {
        return {
          value: Math.round(progress.value * 100) + "%",
        };
      },
      null,
      [TextInputAdapter]
    );

    return (
      <Animated.View style={styles.baseControl}>
        <ActivityIndicator color={refreshControlColor} />
        <AnimatedText
          allowFontScaling={false}
          caretHidden
          editable={false}
          animatedProps={textInputProps}
          style={[styles.textStyle, { color: refreshControlColor }]}
        />
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  baseControl: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingTop: 10,
  },
  container: {
    left: 0,
    position: "absolute",
    right: 0,
    width: "100%",
  },
  textStyle: {
    marginTop: 4,
    fontSize: 13,
    textAlign: "center",
  },
});
