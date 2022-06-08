import { Platform } from "react-native";

import Animated, {
  runOnJS,
  scrollTo,
  withTiming,
} from "react-native-reanimated";

export function mScrollTo(ref: any, x: number, y: number, animated: boolean) {
  "worklet";
  if (!ref) return;
  scrollTo(ref, x, y, animated);
}

export const isIOS = Platform.OS === "ios";

export const animateToRefresh = ({
  transRefreshing,
  isRefreshing,
  isRefreshingWithAnimation,
  isToRefresh,
  destPoi,
  onStartRefresh,
}: {
  transRefreshing: Animated.SharedValue<number>;
  isRefreshing: Animated.SharedValue<boolean>;
  isRefreshingWithAnimation: Animated.SharedValue<boolean>;
  isToRefresh: boolean;
  destPoi: number;
  onStartRefresh?: () => void;
}) => {
  "worklet";

  if (isToRefresh === true && isRefreshing.value === true) return;
  if (
    isToRefresh === false &&
    isRefreshing.value === false &&
    transRefreshing.value === destPoi
  )
    return;
  isRefreshing.value = isToRefresh;
  if (isToRefresh && onStartRefresh) {
    runOnJS(onStartRefresh)();
  }

  if (transRefreshing.value === destPoi) {
    isRefreshingWithAnimation.value = isToRefresh;
    return;
  }
  transRefreshing.value = withTiming(destPoi, undefined, () => {
    isRefreshingWithAnimation.value = isToRefresh;
  });
};

export function memoize<Result, Deps extends readonly any[]>(
  callback: (...deps: Deps) => Result
) {
  let previous: Deps | undefined;
  let result: Result | undefined;

  return (...dependencies: Deps): Result => {
    let hasChanged = false;

    if (previous) {
      if (previous.length !== dependencies.length) {
        hasChanged = true;
      } else {
        for (let i = 0; i < previous.length; i++) {
          if (previous[i] !== dependencies[i]) {
            hasChanged = true;
            break;
          }
        }
      }
    } else {
      hasChanged = true;
    }

    previous = dependencies;

    if (hasChanged || result === undefined) {
      result = callback(...dependencies);
    }

    return result;
  };
}
