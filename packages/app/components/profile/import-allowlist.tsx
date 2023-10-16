import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const ImportAllowlist = () => {
  const router = useRouter();
  return (
    <View tw="px-4 py-4">
      <Text tw="text-xl font-bold text-gray-900 dark:text-white">
        Give your previous collectors free access to your channel.
      </Text>
      <View tw="h-3" />
      <Text tw="text-sm text-gray-800 dark:text-gray-200">
        By importing an allowlist (Ethereum wallet addresses spreadsheet, ENS
        supported), your existing community will not need to buy 1 of your
        Creator Tokens to unlock your channel.
      </Text>
      <Button
        size="regular"
        tw="my-4 w-full"
        onPress={() => {
          const nativeUrl = "/creator-token/import-allowlist-success";
          const url = Platform.select({
            native: nativeUrl,
            web: {
              pathname: router.pathname,
              query: {
                ...router.query,
                creatorTokensImportedAllowlistSuccessModal: true,
              },
            } as any,
          });
          const as = Platform.select({ native: nativeUrl, web: router.asPath });
          if (Platform.OS === "web") {
            router.replace(url, as);
            return;
          }
          router.pop();
          router.push(url, as);
        }}
      >
        Import Allowlist (.csv)
      </Button>
      <Button size="regular" variant="outlined" tw="w-full">
        Download template
      </Button>
    </View>
  );
};
