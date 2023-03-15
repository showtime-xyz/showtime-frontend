import React from "react";

import { MotiView } from "moti";

import { Button } from "@showtime-xyz/universal.button";
import {
  Check,
  InstagramColorful,
  Twitter,
} from "@showtime-xyz/universal.icon";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAddMagicSocialAccount } from "app/hooks/use-add-magic-social-account";
import { useUser } from "app/hooks/use-user";

import { Challenge as SkipButton } from "./hcaptcha";
import { useFinishOnboarding } from "./hcaptcha/hcaptcha-utils";

export const SelectSocial = () => {
  const { user } = useUser();
  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={() => {
        "worklet";
        return {
          opacity: 0,
          scale: 0.9,
        };
      }}
      exitTransition={{
        type: "timing",
        duration: 600,
      }}
      style={{ flex: 1 }}
    >
      <View tw="flex-1 px-4 text-center">
        <View tw="items-center">
          <View tw="h-4" />
          <Text tw="text-xl font-bold text-gray-900 dark:text-gray-100">
            Lastly, connect a social account
          </Text>
          <View tw="h-6" />
          <Text tw="text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
            Connect at least one account so people know who you are.
          </Text>
        </View>
        <View tw="mt-16 flex flex-grow-0">
          <ConnectButton
            title="Connect Twitter"
            titleConnected="Connected Twitter"
            icon={<Twitter color="#4A99E9" width={20} height={20} />}
            type="twitter"
            isConnected={user?.data?.profile?.social_login_connections?.twitter}
          />
          <ConnectButton
            title="Connect Instagram"
            titleConnected="Connected Instagram"
            icon={<InstagramColorful color="#4A99E9" width={20} height={20} />}
            type="instagram"
            isConnected={
              user?.data?.profile?.social_login_connections?.instagram
            }
          />

          <SkipButton />
        </View>
      </View>
    </MotiView>
  );
};

const ConnectButton = ({
  title,
  titleConnected,
  icon,
  type,
  isConnected,
}: {
  title: string;
  titleConnected: string;
  icon: any;
  type: "apple" | "google" | "instagram" | "twitter";
  isConnected?: boolean;
}) => {
  const { trigger, isMutating } = useAddMagicSocialAccount();
  const finishOnboarding = useFinishOnboarding();
  return (
    <Button
      size="regular"
      onPress={async () => {
        try {
          await trigger({
            type,
          });
          finishOnboarding();
        } catch {
          // do nothing
        }
      }}
      disabled={isMutating || isConnected}
      tw={`mt-2 ${isMutating ? "opacity-50" : ""}`}
    >
      <View tw="flex-1 flex-row items-center">
        <View tw="flex-1 flex-row items-center justify-center">
          <View tw="mr-1.5">
            {isConnected ? (
              <Check color="#22C55E" width={25} height={25} />
            ) : (
              icon
            )}
          </View>
          <Text tw="font-semibold text-white dark:text-black">
            {isConnected ? titleConnected : title}
          </Text>
        </View>
        {isMutating ? (
          <View tw="absolute right-4 scale-75 justify-center">
            <Spinner size="small" color="darkgrey" />
          </View>
        ) : (
          <></>
        )}
      </View>
    </Button>
  );
};
