import { Showtime } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

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

        <Text tw="text-xs font-medium text-white" style={{ lineHeight: 14 }}>
          Star drop
        </Text>
      </View>
    </View>
  );
};
