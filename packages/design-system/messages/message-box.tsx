import { useState, useEffect, useRef } from "react";
import {
  Platform,
  Animated,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputChangeEventData,
} from "react-native";

import { useIsMobileWeb } from "app/hooks/use-is-mobile-web";
import { useKeyboardDimensions } from "app/hooks/use-keyboard-dimensions";
import { useSafeAreaInsets } from "app/lib/safe-area";

import { Button } from "design-system/button";
import { useIsDarkMode } from "design-system/hooks";
import { Send } from "design-system/icon";
import { tw as tailwind } from "design-system/tailwind";
import { TextInput } from "design-system/text-input";
import { View } from "design-system/view";

export const SCROLL_HEIGHT = 48;
export const PADDING_HEIGHT = 32;

type Props = {
  scrollToBottom: () => void;
  onFocus: () => void;
  onBlur: () => void;
  inputRef: any;
  scrollHeight: number;
  setScrollHeight: (height: number) => void;
  isKeyboardOpen: boolean;
  positionY: Animated.Value;
};

function MessageBox({
  scrollToBottom,
  onFocus,
  onBlur,
  inputRef,
  scrollHeight,
  setScrollHeight,
  isKeyboardOpen,
  positionY,
}: Props) {
  const isDark = useIsDarkMode();
  const insets = useSafeAreaInsets();

  const [message, setMessage] = useState("");
  const inputContainerRef = useRef(null);

  const { userAgent, isMobileWeb } = useIsMobileWeb();
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(userAgent);

  useEffect(() => {
    if (isSafari) {
      if (inputContainerRef.current) {
        inputContainerRef.current.addEventListener(
          "touchmove",
          (e) => {
            e.preventDefault();
          },
          { passive: false }
        );
      }
    }

    return () => {
      if (isSafari) {
        if (inputContainerRef.current) {
          inputContainerRef.current.removeEventListener("touchmove", (e) => {
            e.preventDefault();
          });
        }
      }
    };
  }, [isSafari, inputContainerRef.current]);

  const useListenersOnAndroid = true;
  const { keyboardEndPositionY, keyboardHeight } = useKeyboardDimensions(
    useListenersOnAndroid
  );
  const deltaY = Animated.subtract(positionY, keyboardEndPositionY).interpolate(
    {
      inputRange: [0, Number.MAX_SAFE_INTEGER],
      outputRange: [0, Number.MAX_SAFE_INTEGER],
      extrapolate: "clamp",
    }
  );

  let messageBoxBottom = 0;
  if (!isKeyboardOpen) {
    messageBoxBottom = insets.bottom;
  } else if (Platform.OS === "ios" && isKeyboardOpen) {
    const value = Animated.subtract(
      keyboardHeight > 0 ? keyboardHeight : 0,
      deltaY
    );
    messageBoxBottom = value.__getValue();
  } else if (Platform.OS === "android" && isKeyboardOpen) {
    messageBoxBottom = 0; // TODO: offset for Android keyboard
  }

  const onKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (
      !isMobileWeb &&
      event.nativeEvent.keyCode === 13 &&
      !event.nativeEvent.shiftKey
    ) {
      event.preventDefault();
      if (message && message !== "") {
        submitMessage();
      }
    }
  };

  const onChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (message === "" && event.nativeEvent.inputType === "insertLineBreak") {
      return;
    }

    setMessage(event.target.value || event.nativeEvent.text);

    if (Platform.OS === "web") {
      if (event.target.value !== "") {
        if (scrollHeight < 70) {
          setScrollHeight(event.target.scrollHeight);
          scrollToBottom();
        }
      } else {
        setScrollHeight(SCROLL_HEIGHT);
      }
    }
  };

  const submitMessage = async () => {
    try {
      // TODO:
      scrollToBottom();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      ref={inputContainerRef}
      tw={[
        "bg-white dark:bg-black flex-1 w-full py-4 ios:absolute android:absolute web:fixed",
        `h-[${scrollHeight + PADDING_HEIGHT}px]`,
        `bottom-[${messageBoxBottom}px] right-0 left-0`,
      ]}
      // @ts-expect-error
      style={{
        ...Platform.select({
          web: {
            transform: "translate3d(0, 0, 0)",
          },
        }),
      }}
    >
      <View tw="flex-row justify-around flex-shrink-0 p-1 web:break-words">
        <View tw="px-5 bg-gray-100 dark:bg-gray-900 rounded-full w-[80vw]">
          <TextInput
            ref={inputRef}
            tw={[
              `w-full h-[${scrollHeight}px] pt-2`,
              "text-black dark:text-white font-semibold text-base",
              "web:resize-none web:outline-none",
            ]}
            placeholder="Add a comment..."
            placeholderTextColor={
              tailwind.style("text-gray-500 dark:text-gray-400").color as string
            }
            multiline={true}
            value={message}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onFocus={() => {
              if (onFocus) onFocus();
            }}
            onBlur={() => {
              if (onBlur) onBlur();
            }}
            onSubmitEditing={() => {
              if (message && message !== "") {
                submitMessage();
              }
              if (onBlur) onBlur();
            }}
            onContentSizeChange={({ nativeEvent }) => {
              if (Platform.OS !== "web") {
                setScrollHeight(
                  PADDING_HEIGHT + nativeEvent.contentSize.height
                );
              }
            }}
            blurOnSubmit={true}
            returnKeyType="send"
            enablesReturnKeyAutomatically={true}
            numberOfLines={1}
            textAlign="left"
            textAlignVertical="top"
          />
        </View>

        <View tw="self-end">
          <Button
            variant="primary"
            iconOnly={true}
            tw="rounded-full h-12 w-12 web:outline-none web:cursor-pointer"
            onPress={submitMessage}
          >
            <Send color={isDark ? "#000" : "#fff"} />
          </Button>
        </View>
      </View>
    </View>
  );
}

export { MessageBox };
