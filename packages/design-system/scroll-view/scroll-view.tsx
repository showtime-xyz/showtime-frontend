import { Component, forwardRef } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

class ScrollViewClass extends Component<ScrollViewProps & { innerRef?: any }> {
  constructor(props: ScrollViewProps) {
    super(props);
  }

  render() {
    const { style, tw, asKeyboardAwareScrollView, innerRef, ...props } =
      this.props;
    const ScrollViewComponent = asKeyboardAwareScrollView
      ? KeyboardAwareScrollView
      : ReactNativeScrollView;

    return (
      <ScrollViewComponent
        keyboardShouldPersistTaps="handled"
        {...props}
        //@ts-ignore
        ref={innerRef}
        style={[tailwind.style(tw), style]}
      />
    );
  }
}

const ScrollView = forwardRef((props: ScrollViewProps, ref: any) => (
  <ScrollViewClass
    //@ts-ignore
    innerRef={ref}
    {...props}
  />
));

ScrollView.displayName = "ScrollView";

export { ScrollView };
