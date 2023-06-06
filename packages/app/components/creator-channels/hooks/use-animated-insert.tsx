import { Component, forwardRef, useRef, useCallback } from "react";

import type { FlashList } from "@shopify/flash-list";
import { CellContainer } from "@shopify/flash-list";
import Animated, { FadeOut, FadeIn, Layout } from "react-native-reanimated";

export interface AnimatedInsertArgs<T1> {
  flashList: React.RefObject<FlashList<T1>>;
  data: T1[];
  animationDuration: number;
}

const ReanimatedCellContainer = Animated.createAnimatedComponent(CellContainer);

export function useAnimatedInsert<T1>(args: AnimatedInsertArgs<T1>) {
  const { flashList, animationDuration } = args;
  const argsRef = useRef(args);
  argsRef.current = args;
  const animationRunning = useRef(false);
  const timeoutId = useRef(0);
  const CellRendererComponent = useRef(
    getCustomCellRendererComponent(argsRef, animationRunning)
  );
  const configureAnimationOnNextFrame = () => {
    clearTimeout(timeoutId.current);
    flashList.current?.prepareForLayoutAnimationRender();
    configureLayoutAnimation(animationRunning, animationDuration);
  };

  return {
    configureAnimationOnNextFrame,
    CellRendererComponent: CellRendererComponent.current!,
    animationIsRunning: animationRunning.current,
  };
}

function configureLayoutAnimation(
  animationRunning: React.MutableRefObject<boolean>,
  animationDuration: number
) {
  animationRunning.current = true;

  return setTimeout(() => {
    animationRunning.current = false;
  }, animationDuration);
}

function getCustomCellRendererComponent<T1>(
  argsRef: React.RefObject<AnimatedInsertArgs<T1>>,
  animationRunning: React.MutableRefObject<boolean>
) {
  const CustomCellRenderer = forwardRef(function (
    props: { index: number; style: { [key: string]: object } },
    ref: React.Ref<Component<unknown>>
  ) {
    const { index, style } = props;
    const { data, flashList } = argsRef.current!;
    const keyExtractor = flashList.current?.props.keyExtractor;
    const itemData = data[index];
    const itemKey = keyExtractor?.(itemData, index);
    const oldItemKey = useRef(itemKey);

    const cellKey = useRef(1);
    if (oldItemKey.current !== itemKey && animationRunning.current) {
      cellKey.current++;
    }
    oldItemKey.current = itemKey;

    return (
      <ReanimatedCellContainer
        {...props}
        layout={!animationRunning.current ? Layout.springify() : undefined}
        entering={FadeIn.springify()}
        exiting={FadeOut.springify()}
        ref={ref}
        key={cellKey.current}
        style={{
          ...style,
        }}
      />
    );
  });

  CustomCellRenderer.displayName = "CustomCellRenderer";

  return CustomCellRenderer;
}
