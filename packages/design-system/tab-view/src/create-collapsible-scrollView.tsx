import type { ComponentClass } from "react";
import React from "react";

import Animated from "react-native-reanimated";

import { SceneComponent } from "./scene";

export function createCollapsibleScrollView<
  P extends ComponentClass<any>,
  T = any
>(Component: P) {
  const AnimatePageView = Animated.createAnimatedComponent(Component);

  return React.forwardRef<
    P,
    T & {
      index: number;
    }
  >(function tabView(props, ref) {
    return (
      <SceneComponent
        {...props}
        forwardedRef={ref}
        ContainerView={AnimatePageView}
      />
    );
  });
}
