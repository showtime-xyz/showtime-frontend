import { baseColors } from "moti/build/skeleton/shared";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { TW } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { SkeletonProps } from "./type";

type Props = SkeletonProps & {
  tw?: TW;
  radius?: number;
};

function Skeleton({
  tw,
  width,
  height,
  show = true,
  colorMode: colorModeProps = "dark",
  children,
  radius = 8,
  backgroundColor,
  ...props
}: Props) {
  const colorMode = useColorScheme();
  if (!show) {
    return children;
  }

  return (
    <View
      {...props}
      tw={["animate-pulse", tw].join(" ")}
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: baseColors[colorModeProps ?? colorMode].secondary,
      }}
    />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
