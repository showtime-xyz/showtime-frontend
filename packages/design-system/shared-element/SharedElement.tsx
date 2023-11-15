import { useCallback, useMemo, useEffect } from "react";
import { ViewStyle, useWindowDimensions } from "react-native";

import {
  WithSpringConfig,
  cancelAnimation,
  interpolate,
  makeMutable,
  measure,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useWorkletCallback,
  withSpring,
  AnimatedRef,
  SharedValue,
} from "react-native-reanimated";

import {
  ExtraStyles,
  SETState,
  SharedElementRegistryItem,
  useSharedElementContext,
} from "./SharedElementContext";
import { calculateRectangleDimensions, measureAsync } from "./utils";

const defaultStyle = {
  opacity: 1,
  transform: [
    {
      translateX: 0,
    },
    {
      translateY: 0,
    },
    {
      scale: 1,
    },
  ],
};

const getValue = (
  value: number | SharedValue<number> | undefined,
  defaultValue: number
) => {
  "worklet";

  if (value === undefined) {
    return defaultValue;
  }

  return typeof value === "number" ? value : value.value;
};

type CommonProps = {
  tag: string;
  children: ({
    animatedRef,
    animatedStyles,
    progress,
  }: {
    animatedRef: AnimatedRef<any>;
    animatedStyles: Pick<ViewStyle, "opacity" | "transform">;
    progress: SharedValue<number>;
  }) => React.ReactNode;
};

type SharedElementTargetProps = CommonProps & {
  isActive: boolean;
  animateOutsideTheScreen?: boolean;
  extraStyles: ExtraStyles;
};

type SharedElementProps = {
  extraStyles?: ExtraStyles;
} & CommonProps;

export function SharedElement({
  children,
  tag,
  extraStyles,
}: SharedElementProps) {
  const originRef = useAnimatedRef<any>();
  const targetRef = useAnimatedRef<any>();

  const { registryMap } = useSharedElementContext();

  const createOrResolveRegistry = useCallback(() => {
    if (!registryMap.has(tag)) {
      registryMap.set(tag, {
        origin: originRef,
        target: targetRef,
        originMeasurements: makeMutable(null),
        targetMeasurements: makeMutable(null),
        progress: makeMutable(0),
        originExtraStyles: extraStyles ? makeMutable(extraStyles) : undefined,
        state: makeMutable(SETState.idle),
      });
    }

    return registryMap.get(tag)!;
  }, [tag, originRef, targetRef, registryMap, extraStyles]);

  const registry = useMemo(createOrResolveRegistry, [createOrResolveRegistry]);

  useEffect(() => {
    // this fixes fast-refresh
    createOrResolveRegistry();

    return () => {
      registryMap.delete(tag);
    };
  }, [tag, registryMap, createOrResolveRegistry]);

  const {
    originMeasurements,
    targetMeasurements,
    progress,
    state,
    originExtraStyles,
  } = registry;

  useEffect(() => {
    if (
      typeof originExtraStyles !== "undefined" &&
      typeof extraStyles !== "undefined"
    ) {
      originExtraStyles.value = extraStyles;
    }
  }, [extraStyles, originExtraStyles]);

  const originStyles = useAnimatedStyle(() => {
    if (state.value === SETState.animated) {
      return {
        ...defaultStyle,
        opacity: 0,
      };
    }

    if (
      targetMeasurements.value === null ||
      originMeasurements.value === null ||
      state.value === SETState.idle ||
      state.value === SETState.targetRendered ||
      state.value === SETState.animatingOfTheScreen
    ) {
      return defaultStyle;
    }

    const rotation = getValue(originExtraStyles?.value.rotation, 0);
    const extraScale = getValue(originExtraStyles?.value.scale, 1);
    const {
      pageX: originPageX,
      pageY: originPageY,
      width: originWidth,
      height: originHeight,
    } = originMeasurements.value;
    const {
      pageX: targetPageX,
      pageY: targetPageY,
      width: targetWidth,
      height: targetHeight,
    } = targetMeasurements.value;
    const { height } = calculateRectangleDimensions(
      originWidth,
      originHeight,
      rotation
    );

    const scale = targetHeight / height;

    const x =
      (targetPageX - originPageX + targetWidth / 2 - originWidth / 2) *
      (1 / extraScale);
    const y =
      (targetPageY - originPageY + targetHeight / 2 - originHeight / 2) *
      (1 / extraScale);

    return {
      opacity: 1,
      transform: [
        {
          rotate: `${-rotation}rad`,
        },
        {
          translateX: interpolate(progress.value, [0, 1], [0, x], "clamp"),
        },
        {
          translateY: interpolate(progress.value, [0, 1], [0, y], "clamp"),
        },
        {
          scale: interpolate(progress.value, [0, 1], [1, scale], "clamp"),
        },
        {
          rotate: `${rotation}rad`,
        },
        {
          rotate: `${interpolate(
            progress.value,
            [0, 1],
            [0, -rotation],
            "clamp"
          )}rad`,
        },
      ],
    };
  });

  if (Array.isArray(children)) {
    throw new Error("SharedElement can accept only a single child");
  }

  return (
    <>
      {children({
        animatedRef: originRef,
        animatedStyles: originStyles,
        progress: progress,
      })}
    </>
  );
}

const springConfig: WithSpringConfig = {
  mass: 2,
  stiffness: 1000,
  damping: 500,
  overshootClamping: false,
  restDisplacementThreshold: 0.005,
};

const springConfigFast: WithSpringConfig = {
  mass: 2,
  stiffness: 1000,
  damping: 500,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
};

export function SharedElementTarget({
  tag,
  children,
  isActive,
  animateOutsideTheScreen,
  extraStyles,
}: SharedElementTargetProps) {
  const context = useSharedElementContext();

  const targetRefFallback = useAnimatedRef<any>();
  const originRefFallback = useAnimatedRef<any>();

  const registry = useMemo(() => {
    if (!context.registryMap.has(tag)) {
      return {
        origin: originRefFallback,
        target: targetRefFallback,
        originMeasurements: makeMutable(null),
        targetMeasurements: makeMutable(null),
        progress: makeMutable(0),
        extraStyles: {},
        state: makeMutable(SETState.idle),
      } as SharedElementRegistryItem;
    }

    return context.registryMap.get(tag)!;
  }, [tag, context.registryMap, originRefFallback, targetRefFallback]);

  return (
    <SharedElementTargetImplementation
      tag={tag}
      registry={registry}
      isActive={isActive}
      targetExtraStyles={extraStyles}
      animateOutsideTheScreen={animateOutsideTheScreen}
    >
      {children}
    </SharedElementTargetImplementation>
  );
}

function SharedElementTargetImplementation({
  tag,
  registry,
  isActive,
  animateOutsideTheScreen,
  targetExtraStyles,
  children,
}: {
  targetExtraStyles?: ExtraStyles;
  registry: SharedElementRegistryItem;
  isActive: boolean;
  animateOutsideTheScreen?: boolean;
} & CommonProps) {
  const context = useSharedElementContext();
  const windowDimensions = useWindowDimensions();

  const {
    origin,
    target,
    originMeasurements,
    targetMeasurements,
    progress,
    state,
    originExtraStyles,
  } = registry;
  const { setIsActiveTransition } = context;

  const runShowAnimation = useWorkletCallback(() => {
    state.value = SETState.animating;
    targetMeasurements.value = null;

    setIsActiveTransition(true);

    originMeasurements.value = measure(origin);

    // we wait for the real measurements
    measureAsync(target, (measurements) => {
      targetMeasurements.value = measurements;

      progress.value = withSpring(1, springConfig, (finished) => {
        setIsActiveTransition(false);

        if (finished) {
          state.value = SETState.animated;
        }
      });
    });
  });

  const runHideAnimation = useWorkletCallback(
    (onEnd: (elementTag: string) => void) => {
      targetMeasurements.value = measure(target);
      originMeasurements.value = measure(origin);

      if (
        animateOutsideTheScreen &&
        (originMeasurements.value === null ||
          originMeasurements.value.pageY + originMeasurements.value.height <
            0 ||
          originMeasurements.value.pageY > windowDimensions.height ||
          originMeasurements.value.pageX + originMeasurements.value.width < 0 ||
          originMeasurements.value.pageX > windowDimensions.width)
      ) {
        state.value = SETState.animatingOfTheScreen;
      } else {
        state.value = SETState.animating;
      }

      setIsActiveTransition(true);
      cancelAnimation(progress);

      progress.value = withSpring(
        0,
        state.value === SETState.animatingOfTheScreen
          ? springConfigFast
          : springConfig,
        () => {
          setIsActiveTransition(false);

          originMeasurements.value = null;
          targetMeasurements.value = null;

          runOnJS(onEnd)(tag);

          state.value = SETState.idle;
        }
      );
    }
  );

  const onIsActiveChange = useWorkletCallback((active: boolean) => {
    if (state.value === SETState.animating) {
      return;
    }

    if (state.value === SETState.targetRendered && active) {
      state.value = SETState.animated;
    } else if (state.value === SETState.animated && !active) {
      state.value = SETState.targetRendered;
      targetMeasurements.value = null;
    } else if (state.value === SETState.idle) {
      if (active) {
        state.value = SETState.canAnimate;
      } else {
        state.value = SETState.targetRendered;
        progress.value = 1;
      }
    }

    originMeasurements.value = measure(origin);

    if (state.value === SETState.canAnimate) {
      runShowAnimation();
    }
  });

  useEffect(() => {
    return () => {
      state.value = SETState.idle;
      progress.value = 0;
      // test
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    runOnUI(onIsActiveChange)(isActive);

    if (isActive) {
      context.registerActiveElement(
        tag,
        (onEnd: (elementTag: string) => void) => {
          runOnUI(runHideAnimation)(onEnd);
        }
      );
    }

    return () => {
      context.unregisterActiveElement(tag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tag,
    isActive,
    context.registerActiveElement,
    context.unregisterActiveElement,
    onIsActiveChange,
    runHideAnimation,
  ]);

  const targetStyles = useAnimatedStyle(() => {
    if (
      state.value === SETState.animating &&
      originMeasurements.value == null
    ) {
      return {
        opacity: progress.value,
      };
    }

    if (state.value === SETState.animatingOfTheScreen) {
      return {
        transform: [
          {
            translateY: interpolate(
              progress.value,
              [1, 0],
              [0, windowDimensions.height],
              "clamp"
            ),
          },
        ],
      };
    }

    if (
      state.value === SETState.targetRendered ||
      state.value === SETState.animated
    ) {
      return defaultStyle;
    }

    if (
      originMeasurements.value === null ||
      targetMeasurements.value === null
    ) {
      return {
        opacity: 0,
      };
    }

    const rotation = getValue(originExtraStyles?.value.rotation, 0);
    const extraScale = getValue(targetExtraStyles?.scale, 1);
    const {
      pageX: originPageX,
      pageY: originPageY,
      width: originWidth,
      height: originHeight,
    } = originMeasurements.value;
    const {
      pageX: targetPageX,
      pageY: targetPageY,
      width: targetWidth,
      height: targetHeight,
    } = targetMeasurements.value;
    const { height } = calculateRectangleDimensions(
      originWidth,
      originHeight,
      rotation
    );

    const x =
      (originPageX + originWidth / 2 - targetPageX - targetWidth / 2) *
      (1 / extraScale);
    const y =
      (originPageY + originHeight / 2 - targetPageY - targetHeight / 2) *
      (1 / extraScale);
    const scale = height / targetHeight;

    return {
      opacity: interpolate(progress.value, [0, 0.05, 1], [0, 1, 1], "clamp"),
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [x, 0], "clamp"),
        },
        {
          translateY: interpolate(progress.value, [0, 1], [y, 0], "clamp"),
        },
        {
          scale: interpolate(progress.value, [0, 1], [scale, 1], "clamp"),
        },
        {
          rotate: `${interpolate(
            progress.value,
            [0, 1],
            [rotation, 0],
            "clamp"
          )}rad`,
        },
      ],
    };
  });

  if (Array.isArray(children)) {
    throw new Error("SharedElement can accept only a single child");
  }

  return (
    <>
      {children({
        animatedRef: target,
        animatedStyles: targetStyles,
        progress: progress,
      })}
    </>
  );
}
