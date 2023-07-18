import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

interface CommentsStatusProps {
  isLoading?: boolean;
  error?: string;
}

export function CommentsStatus({ isLoading, error }: CommentsStatusProps) {
  return (
    <View tw="ios:min-h-[60vh] android:min-h-[70vh] web:min-h-[350px] -mt-20 h-full flex-1 items-center justify-center">
      {isLoading && <Spinner size="small" />}
      <Text tw="mt-2 text-black dark:text-white">
        {isLoading ? "Loading" : error ? "Cannot load comments." : ""}
      </Text>
    </View>
  );
}
