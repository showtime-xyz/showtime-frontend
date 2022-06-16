import { Button } from "design-system/button";
import { View } from "design-system/view";

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
