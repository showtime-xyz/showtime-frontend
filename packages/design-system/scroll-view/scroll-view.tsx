import { Component } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { styled } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

class ScrollView extends Component<ScrollViewProps> {
  constructor(props: ScrollViewProps) {
    super(props);
  }

  render() {
    const { tw, asKeyboardAwareScrollView, ...props } = this.props;
    const StyledScrollViewComponent = asKeyboardAwareScrollView
      ? styled(KeyboardAwareScrollView)
      : styled(ReactNativeScrollView);

    return (
      <StyledScrollViewComponent
        keyboardShouldPersistTaps="handled"
        {...props}
        tw={Array.isArray(tw) ? tw.join(" ") : tw}
      />
    );
  }
}

export { ScrollView };
