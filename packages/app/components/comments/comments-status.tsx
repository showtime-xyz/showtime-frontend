import { Spinner } from "design-system/spinner";
import { Text } from "design-system/text";
import { View } from "design-system/view";

interface CommentsStatusProps {
  isLoading?: boolean;
  error?: string;
}

export function CommentsStatus({ isLoading, error }: CommentsStatusProps) {
  return (
    <View tw="flex-row items-center justify-center p-4">
      {isLoading && <Spinner size="small" />}
      <Text tw="ml-2 text-black dark:text-white">
        {isLoading ? "Loading" : error ? "Cannot load comments." : ""}
      </Text>
    </View>
  );
}
