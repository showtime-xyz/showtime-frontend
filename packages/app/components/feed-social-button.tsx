import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type SocialButtonProps = PressableProps & {
  text?: string | JSX.Element;
  children?: React.ReactNode;
  buttonTw?: string;
};
export function FeedSocialButton({
  children,
  text,
  buttonTw = "",
  ...rest
}: SocialButtonProps) {
  return (
    <Pressable {...rest}>
      <View
        tw={["h-14 w-14 items-center justify-center rounded-full", buttonTw]}
      >
        {children}
      </View>
      {Boolean(text) && (
        <>
          <View tw="h-2" />
          <Text tw="text-center text-xs font-semibold text-gray-900 dark:text-white">
            {text}
          </Text>
        </>
      )}
    </Pressable>
  );
}
