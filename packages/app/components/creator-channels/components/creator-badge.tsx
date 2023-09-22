import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const CreatorBadge = () => {
  return (
    <View tw="rounded-md bg-[#CE8903] px-2 py-1.5">
      <View tw="flex-row items-center justify-center">
        <Text tw="text-xs font-medium text-white" style={{ lineHeight: 14 }}>
          Creator
        </Text>
      </View>
    </View>
  );
};
