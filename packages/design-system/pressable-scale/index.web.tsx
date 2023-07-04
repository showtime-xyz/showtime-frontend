import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";

export type PressableScaleProps = PressableProps & {
  scaleTo?: number;
};

export function PressableScale({
  tw,
  disabled,
  ...props
}: PressableScaleProps) {
  return (
    <Pressable
      disabled={disabled}
      tw={[
        disabled ? "" : "duration-150 active:scale-95",
        Array.isArray(tw) ? tw.join(" ") : tw,
      ].join(" ")}
      {...props}
    />
  );
}
