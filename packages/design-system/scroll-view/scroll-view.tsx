import { Component, forwardRef } from "react";
import {
  Keyboard,
  Platform,
  ScrollView as ReactNativeScrollView,
} from "react-native";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { styled } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

const StyledScrollViewComponent = styled(ReactNativeScrollView);

// https://github.com/facebook/react-native/issues/23364#issuecomment-642518054
// PR - https://github.com/facebook/react-native/pull/31943
const keyboardDismissProp = Platform.select({
  ios: { keyboardDismissMode: "on-drag" } as const,
  android: { onScrollEndDrag: Keyboard.dismiss } as const,
});
class ScrollViewClass extends Component<ScrollViewProps & { innerRef?: any }> {
  constructor(props: ScrollViewProps) {
    super(props);
  }

  render() {
    const { tw, innerRef, ...props } = this.props;

    return (
      <StyledScrollViewComponent
        keyboardShouldPersistTaps="handled"
        {...keyboardDismissProp}
        {...props}
        //@ts-ignore
        ref={innerRef}
        tw={Array.isArray(tw) ? tw.join(" ") : tw}
      />
    );
  }
}

const ScrollView = forwardRef((props: ScrollViewProps, ref: any) => {
  const { colorScheme } = useColorScheme();
  return (
    <ScrollViewClass
      //@ts-ignore
      innerRef={ref}
      indicatorStyle={colorScheme === "light" ? "black" : "white"}
      {...props}
    />
  );
});

ScrollView.displayName = "ScrollView";

export { ScrollView };
