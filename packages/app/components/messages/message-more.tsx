import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

interface MessageMoreProps {
  count?: number;
  onPress?: () => void;
}

export function MessageMore({ count = 0, onPress }: MessageMoreProps) {
  if (count === 0) {
    return null;
  }
  const replyText = count > 1 ? "Show more replies" : "Show reply";
  return (
    <View tw="ml-1 flex pb-5 pl-14">
      <Text tw="text-xs font-bold dark:text-white" onPress={onPress}>
        {`${replyText} (${count})`}
      </Text>
    </View>
  );
}
