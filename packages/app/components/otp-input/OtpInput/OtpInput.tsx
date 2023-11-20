import { forwardRef, useImperativeHandle } from "react";
import { Pressable, Text, TextInput, View, Platform } from "react-native";

import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

import { styles } from "./OtpInput.styles";
import { OtpInputProps, OtpInputRef } from "./OtpInput.types";
import { VerticalStick } from "./VerticalStick";
import { useOtpInput } from "./useOtpInput";

const PlatformTextInput =
  Platform.OS === "web" ? TextInput : BottomSheetTextInput;

export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>((props, ref) => {
  const {
    models: { text, inputRef, focusedInputIndex },
    actions: { clear, handlePress, handleTextChange },
    forms: { setTextWithRef },
  } = useOtpInput(props);
  const {
    numberOfDigits,
    hideStick,
    focusColor = "#A4D0A4",
    focusStickBlinkingDuration,
    secureTextEntry = false,
    theme = {},
  } = props;
  const {
    containerStyle,
    inputsContainerStyle,
    pinCodeContainerStyle,
    pinCodeTextStyle,
    focusStickStyle,
    focusedPinCodeContainerStyle,
  } = theme;

  useImperativeHandle(ref, () => ({ clear, setValue: setTextWithRef }));

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputsContainer, inputsContainerStyle]}>
        {Array(numberOfDigits)
          .fill(0)
          .map((_, index) => {
            const char = text[index];
            const isFocusedInput = index === focusedInputIndex;

            return (
              <Pressable
                key={`${char}-${index}`}
                onPress={handlePress}
                style={[
                  styles.codeContainer,
                  pinCodeContainerStyle,
                  focusColor && isFocusedInput
                    ? { borderColor: focusColor }
                    : {},
                  focusedPinCodeContainerStyle && isFocusedInput
                    ? { ...focusedPinCodeContainerStyle }
                    : {},
                ]}
                testID="otp-input"
              >
                {isFocusedInput && !hideStick ? (
                  <VerticalStick
                    focusColor={focusColor}
                    style={focusStickStyle}
                    focusStickBlinkingDuration={focusStickBlinkingDuration}
                  />
                ) : (
                  <Text style={[styles.codeText, pinCodeTextStyle]}>
                    {char && secureTextEntry ? "•" : char}
                  </Text>
                )}
              </Pressable>
            );
          })}
      </View>
      <PlatformTextInput
        value={text}
        onChangeText={handleTextChange}
        maxLength={numberOfDigits}
        // @ts-ignore
        ref={inputRef}
        autoFocus
        style={styles.hiddenInput}
        secureTextEntry={secureTextEntry}
        testID="otp-input-hidden"
        autoComplete="off"
        autoCorrect={false}
      />
    </View>
  );
});

OtpInput.displayName = "OtpInput";
