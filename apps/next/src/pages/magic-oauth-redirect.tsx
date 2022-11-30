// Web only component. This component never gets rendered on native. It handles the redirect from magic.link
import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useMagicAuthRedirect } from "app/hooks/auth/use-magic-auth-redirect";

const MagicOauthRedirect = () => {
  const router = useRouter();

  const { loading, error } = useMagicAuthRedirect();

  return (
    <View tw="flex h-screen w-screen items-center justify-center">
      {loading ? (
        <View tw="flex-row items-center">
          <Text tw="text-base font-bold text-gray-900 dark:text-gray-100">
            Please wait
          </Text>
          <View tw="ml-2">
            <Spinner size="medium" />
          </View>
        </View>
      ) : error ? (
        <View tw="h-screen w-full items-center justify-center">
          <Text tw="text-base font-bold text-gray-900 dark:text-gray-100">
            Sorry. Something went wrong
          </Text>
          <Button
            tw="mt-4"
            onPress={() => {
              router.replace("/");
            }}
          >
            Go back
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default MagicOauthRedirect;
