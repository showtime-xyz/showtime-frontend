// Web only component. This component never gets rendered on native. It handles the redirect from magic.link
import { useEffect } from "react";

import useSWRMutation from "swr/mutation";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Logger } from "app/lib/logger";
import { createParam } from "app/navigation/use-param";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

type Query = {
  code?: string;
};
const { useParam } = createParam<Query>();

const MagicOauthRedirect = () => {
  const router = useRouter();
  const [code] = useParam("code");
  const { trigger, isMutating, error } = useSWRMutation(
    MY_INFO_ENDPOINT,
    postInstagramAuthCode
  );

  useEffect(() => {
    if (code) {
      console.log("instagram auth code ", code);
      trigger({ code });
    }
  }, [code, trigger]);

  return (
    <View tw="flex h-screen w-screen items-center justify-center">
      {code}
      {isMutating ? (
        <View tw="flex-row items-center">
          <Text tw="text-base font-bold text-gray-900 dark:text-gray-100">
            Please wait...
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

async function postInstagramAuthCode(
  _url: string,
  { arg }: { arg: { code: string } }
) {
  if (arg) {
    try {
      //   const res = await axios({
      //     method: "POST",
      //     url: "/v1/instagram-code",
      //     data: {
      //       code: arg.code,
      //     },
      //   });

      //   return res;
      console.log("call backend api");
      return {};
    } catch (e) {
      Logger.error("Payment intent fetch failed ", e);
      throw e;
    }
  }
}
