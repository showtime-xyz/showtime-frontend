import { Component, forwardRef } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { styled } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

const StyledScrollViewComponent = styled(ReactNativeScrollView);
class ScrollViewClass extends Component<ScrollViewProps & { innerRef?: any }> {
  constructor(props: ScrollViewProps) {
    super(props);
  }

  render() {
    const { tw, innerRef, ...props } = this.props;

    return (
      <StyledScrollViewComponent
        keyboardShouldPersistTaps="handled"
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
