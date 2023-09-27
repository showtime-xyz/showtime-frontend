import { View } from "@showtime-xyz/universal.view";

import { LeanText } from "./lean-text";

export const CreatorBadge = () => {
  return (
    <View tw="rounded-md bg-[#CE8903] px-2 py-1.5">
      <View tw="flex-row items-center justify-center">
        <LeanText
          tw="text-xs font-medium text-white"
          style={{ lineHeight: 14 }}
        >
          Creator
        </LeanText>
      </View>
    </View>
  );
};
