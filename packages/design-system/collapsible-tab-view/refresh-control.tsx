import React, { memo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import Animated, {
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
  const tranYValue = useSharedValue(0);

  useRefreshDerivedValue(tranYValue, {
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

const RefreshControlNormal = memo<RefreshControlProps>(
  function RefreshControlNormal({ refreshControlColor }) {
    return (
      <Animated.View style={styles.baseControl}>
        <ActivityIndicator color={refreshControlColor} />
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
