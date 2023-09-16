import { ComponentType } from "react";
import { TextProps } from "react-native";

import { NativeText } from "react-native/Libraries/Text/TextNativeComponent";

import { styled } from "@showtime-xyz/universal.tailwind";

const TextElement = NativeText as ComponentType<TextProps>;
const StyledText = styled(TextElement);

export { StyledText as Text };
