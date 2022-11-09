import {
  Pressable,
  Props as PressableProps,
} from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";

type SocialButtonProps = PressableProps & {
  text?: string | JSX.Element;
};
export function SocialButton({
  children,
  text,
  tw = "",
  ...rest
}: SocialButtonProps) {
  return (
    <Pressable
      tw={[
        "h-6 flex-row items-center justify-center rounded-full p-0 duration-150 hover:bg-gray-400/30 md:h-8 md:p-4",
        tw,
      ]}
      {...rest}
    >
      <>
        {children}
        {Boolean(text) && (
          <Text tw="text-sm font-semibold text-gray-900 dark:text-white dark:md:text-gray-400">
            {text}
          </Text>
        )}
      </>
    </Pressable>
  );
}
