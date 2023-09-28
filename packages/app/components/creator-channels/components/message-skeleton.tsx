import { Skeleton } from "@showtime-xyz/universal.skeleton";

import { LeanView } from "./lean-text";

export const MessageSkeleton = () => {
  return (
    <LeanView tw="web:pb-4 h-full w-full flex-1 pb-14">
      <LeanView tw="h-full flex-1 justify-end px-4">
        {new Array(8).fill(0).map((_, i) => {
          return (
            <LeanView tw="flex-row pt-4" key={`${i}`}>
              <LeanView tw="mr-2 overflow-hidden rounded-full">
                <Skeleton width={28} height={28} show />
              </LeanView>
              <LeanView>
                <Skeleton width={140} height={10} show />
                <LeanView tw="h-1" />
                <Skeleton width={90} height={10} show />
              </LeanView>
            </LeanView>
          );
        })}
      </LeanView>
    </LeanView>
  );
};
