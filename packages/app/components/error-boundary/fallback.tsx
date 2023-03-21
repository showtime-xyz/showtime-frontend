import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { FallbackProps } from "app/components/error-boundary";

import { Text } from "design-system/text";
import { View } from "design-system/view";

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
