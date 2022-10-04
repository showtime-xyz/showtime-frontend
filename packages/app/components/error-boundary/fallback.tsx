import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { FallbackProps } from "app/components/error-boundary";

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <View tw="min-h-[50vh] w-full max-w-screen-xl items-center justify-center">
      <EmptyPlaceholder
        title="Something went wrong!"
        text={error.message}
        hideLoginBtn
      />
      <View tw="h-2" />
      <Text onPress={resetErrorBoundary} tw="text-indigo-500">
        Try again
      </Text>
    </View>
  );
}
