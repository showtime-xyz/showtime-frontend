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
    <View tw="mb-5 ml-1 flex bg-white pl-14 dark:bg-black">
      <Text tw="text-xs font-bold dark:text-white" onPress={onPress}>
        {`${replyText} (${count})`}
      </Text>
    </View>
  );
}
