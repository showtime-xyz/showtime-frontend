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
  const replyText = count > 1 ? "replies" : "reply";
  return (
    <View tw="-mt-2 mb-5 ml-1 flex bg-white pl-14 dark:bg-black">
      <Text tw="font-space-bold text-xs dark:text-white" onPress={onPress}>
        {`Load more ${replyText} (${count})`}
      </Text>
    </View>
  );
}
