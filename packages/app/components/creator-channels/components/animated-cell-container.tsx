import { memo, Ref, forwardRef, Component } from "react";

import Animated, { FadeOut, FadeIn, Layout } from "react-native-reanimated";

import {
  CellContainer,
  InfiniteScrollList,
  InfiniteScrollListProps,
} from "@showtime-xyz/universal.infinite-scroll-list";

import { ChannelMessageItem } from "../hooks/use-channel-messages";
import { IAnimatedInfiniteScrollListWithRef } from "../types";

const ReanimatedCellContainer = Animated.createAnimatedComponent(CellContainer);
export const AnimatedInfiniteScrollList = memo(
  Animated.createAnimatedComponent<InfiniteScrollListProps<ChannelMessageItem>>(
    InfiniteScrollList
  )
);

export const AnimatedInfiniteScrollListWithRef =
  AnimatedInfiniteScrollList as IAnimatedInfiniteScrollListWithRef;

export const CustomCellRenderer = memo(
  forwardRef(function (
    props: { index: number; style: { [key: string]: object } },
    ref: Ref<Component<unknown>>
  ) {
    return (
      <ReanimatedCellContainer
        {...props}
        ref={ref}
        layout={Layout}
        entering={FadeIn.delay(50).duration(300)}
        exiting={FadeOut.duration(300)}
      />
    );
  })
);

CustomCellRenderer.displayName = "CustomCellRenderer";
