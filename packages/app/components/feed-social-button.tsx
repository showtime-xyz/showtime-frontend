import { ViewProps } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export type SocialButtonProps = PressableProps & {
  text?: string | JSX.Element;
  children?: React.ReactNode;
  buttonColor?: string;
  dark?: boolean;
  textViewStyle?: ViewProps["style"];
};
export function FeedSocialButton({
  children,
  text,
  buttonColor,
  dark,
  textViewStyle,
  ...rest
}: SocialButtonProps) {
  const isDark = useIsDarkMode();

  return (
    <Pressable tw="flex-1 flex-grow bg-slate-800" {...rest}>
      <View
        tw={"h-14 w-14 items-center justify-center rounded-full"}
        style={{
          backgroundColor:
            buttonColor ??
            (dark
              ? colors.gray[800]
              : isDark
              ? colors.gray[800]
              : colors.gray[100]),
        }}
      >
        {children}
      </View>
      {Boolean(text) && (
        <View tw="mt-2" style={textViewStyle}>
          <Text
            tw={[
              "text-center text-xs font-semibold",
              dark ? "text-white" : "text-gray-900 dark:text-white",
            ]}
          >
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
