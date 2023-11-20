declare module "OTPInput" {
  import { ColorValue, TextStyle, ViewStyle } from "react-native";

  export interface OtpEntryProps {
    /**
     * The number of digits to be displayed in the OTP entry.
     */
    numberOfDigits: number;

    /**
     * The color of the input field border and stick when it is focused.
     */
    focusColor?: ColorValue;

    /**
     * The theme to be applied to the OTP entry.
     */
    theme?: Theme;

    /**
     * A callback function that is invoked when the OTP text changes.
     * It receives the updated text as an argument.
     */
    onTextChange?: (text: string) => void;

    /**
     * The duration (in milliseconds) for the focus stick to blink.
     */
    focusStickBlinkingDuration?: number;
  }

  export interface OtpInputRef {
    /**
     * Clears the value of the OTP input.
     */
    clear: () => void;

    /**
     * Sets the value of the OTP input.
     * @param value - The value to be set.
     */
    setValue: (value: string) => void;
  }

  export interface Theme {
    /**
     * Custom styles for the root `View`.
     */
    containerStyle?: ViewStyle;

    /**
     * Custom styles for the container that holds the input fields.
     */
    inputsContainerStyle?: ViewStyle;

    /**
     * Custom styles for the container that wraps each individual digit in the OTP entry.
     */
    pinCodeContainerStyle?: ViewStyle;

    /**
     * Custom styles for the text within each individual digit in the OTP entry.
     */
    pinCodeTextStyle?: TextStyle;

    /**
     * Custom styles for the focus stick, which indicates the focused input field.
     */
    focusStickStyle?: ViewStyle;
  }
}
