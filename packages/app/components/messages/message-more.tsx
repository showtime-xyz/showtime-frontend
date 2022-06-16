import { Button } from "@showtime-xyz/universal.button";
import { View } from "@showtime-xyz/universal.view";

interface MessageMoreProps {
  count?: number;
  onPress?: () => void;
}

export function MessageMore({ count = 0, onPress }: MessageMoreProps) {
  if (count === 0) {
    return null;
  }
  const replayText = count > 1 ? "replies" : "reply";
  return (
    <View tw="flex bg-white pl-12 dark:bg-black">
      <Button variant="text" tw="justify-start self-start" onPress={onPress}>
        {`Load more ${replayText} (${count})`}
      </Button>
    </View>
  );
}
