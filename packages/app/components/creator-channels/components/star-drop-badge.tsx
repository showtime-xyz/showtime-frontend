import { Showtime } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { LeanText } from "./lean-text";

export const StarDropBadge = () => {
  return (
    <View tw="rounded-md bg-[#CE8903] px-1 py-1">
      <View tw="flex-row items-center justify-center">
        <View tw="mr-1">
          <Showtime
            width={10}
            height={10}
            color={"white"}
            stroke={"white"}
            fill={"white"}
          />
        </View>

        <LeanText
          tw="text-xs font-medium text-white"
          style={{ lineHeight: 14 }}
        >
          Star drop
        </LeanText>
      </View>
    </View>
  );
};
