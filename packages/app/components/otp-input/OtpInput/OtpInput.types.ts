import { ColorValue, TextStyle, ViewStyle } from "react-native";

export interface OtpInputProps {
  numberOfDigits: number;
  focusColor?: ColorValue;
  onTextChange?: (text: string) => void;
  onFilled?: (text: string) => void;
  hideStick?: boolean;
  focusStickBlinkingDuration?: number;
  secureTextEntry?: boolean;
  theme?: Theme;
}

export interface OtpInputRef {
  clear: () => void;
  setValue: (value: string) => void;
}

export interface Theme {
  containerStyle?: ViewStyle;
  inputsContainerStyle?: ViewStyle;
  pinCodeContainerStyle?: ViewStyle;
  pinCodeTextStyle?: TextStyle;
  focusStickStyle?: ViewStyle;
  focusedPinCodeContainerStyle?: ViewStyle;
}
