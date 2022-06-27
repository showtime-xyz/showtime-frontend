import { Component } from "react";
import { ScrollView as ReactNativeScrollView } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";

import { ScrollViewProps } from "./types";

class ScrollView extends Component<ScrollViewProps> {
  constructor(props: ScrollViewProps) {
    super(props);
  }
  render() {
    const { style, tw, asKeyboardAwareScrollView, ...props } = this.props;
    const ScrollViewComponent = asKeyboardAwareScrollView
      ? KeyboardAwareScrollView
      : ReactNativeScrollView;

    return (
      <ScrollViewComponent
        keyboardShouldPersistTaps="handled"
        {...props}
        style={[tailwind.style(tw), style]}
      />
    );
  }
}

export { ScrollView };
