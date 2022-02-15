import { View } from "design-system";
import { TextButton } from "design-system/button";

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
    <View tw="flex pl-16 bg-white dark:bg-black">
      <TextButton tw="justify-start self-start" onPress={onPress}>
        {`Load more ${replayText} (${count})`}
      </TextButton>
    </View>
  );
}
