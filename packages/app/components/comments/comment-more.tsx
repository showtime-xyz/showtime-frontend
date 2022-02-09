import { TextButton } from "design-system/button";
import { View } from "design-system";

interface CommentMoreProps {
  count?: number;
  onPress?: () => void;
}

export function CommentMore({ count = 0, onPress }: CommentMoreProps) {
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
