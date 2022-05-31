import { ComponentProps } from "react";

import { Skeleton as MotiSkeleton } from "moti/skeleton";

import { tw as tailwind } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind/types";

type Props = ComponentProps<typeof MotiSkeleton> & {
  tw?: TW;
};

function Skeleton({ tw, ...props }: Props) {
  return <MotiSkeleton {...props} {...tailwind.style(tw)} />;
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
