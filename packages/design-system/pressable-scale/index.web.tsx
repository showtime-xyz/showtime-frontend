import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";

export type PressableScaleProps = PressableProps & {
  scaleTo?: number;
};

export function PressableScale({ tw, ...props }: PressableScaleProps) {
  return (
    <Pressable
      tw={[
        "duration-150 active:scale-95",
        Array.isArray(tw) ? tw.join(" ") : tw,
      ].join(" ")}
      {...props}
    />
  );
}
