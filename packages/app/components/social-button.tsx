import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type SocialButtonProps = PressableProps & {
  text?: string | JSX.Element;
  vertical?: boolean;
};
export function SocialButton({
  children,
  text,
  tw = "",
  vertical,
  ...rest
}: SocialButtonProps) {
  return (
    <Pressable
      tw={[
        "items-center justify-center rounded-full p-0 duration-150 hover:md:bg-gray-400/30",
        vertical ? "flex-col" : "h-6 flex-row md:h-8 md:p-4",
        tw,
      ]}
      {...rest}
    >
      <>
        {children}
        {vertical && <View tw="h-1" />}
        {Boolean(text) && (
          <Text tw="text-xs font-semibold text-white dark:text-white md:text-gray-900 dark:md:text-gray-400">
            {text}
          </Text>
        )}
      </>
    </Pressable>
  );
}
