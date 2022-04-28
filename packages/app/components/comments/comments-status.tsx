import { Spinner, Text, View } from "design-system";

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
