import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type SocialButtonProps = PressableProps & {
  text?: string | JSX.Element;
  children?: React.ReactNode;
};
export function FeedSocialButton({
  children,
  text,
  ...rest
}: SocialButtonProps) {
  return (
    <Pressable {...rest}>
      <View
        tw={[
          "mb-2 h-14 w-14 items-center justify-center rounded-full bg-gray-100",
        ]}
      >
        {children}
      </View>
      {Boolean(text) && (
        <Text tw="text-center text-xs font-semibold text-gray-900 dark:text-white">
          {text}
        </Text>
      )}
    </Pressable>
  );
}
