import { ComponentType } from "react";
import { TextProps } from "react-native";

import { NativeText } from "react-native/Libraries/Text/TextNativeComponent";

import { styled } from "@showtime-xyz/universal.tailwind";

const Text = NativeText as ComponentType<TextProps>;
const StyledText = styled(Text);

export { StyledText as Text };
