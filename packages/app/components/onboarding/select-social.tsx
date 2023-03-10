import React from "react";

import { MotiView } from "moti";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useAddMagicSocialAccount } from "app/hooks/use-add-magic-social-account";

import { Instagram, Twitter } from "design-system/icon";
import { Spinner } from "design-system/spinner";

import { Challenge } from "./hcaptcha";

export const SelectSocial = () => {
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
            icon={<Twitter color="#4A99E9" width={20} height={20} />}
            type="twitter"
          />
          <ConnectButton
            title="Connect Instagram"
            icon={<Instagram color="#4A99E9" width={20} height={20} />}
            type="instagram"
          />

          <Challenge />
        </View>
      </View>
    </MotiView>
  );
};

const ConnectButton = ({
  title,
  icon,
  type,
}: {
  title: string;
  icon: any;
  type: "apple" | "google" | "instagram" | "twitter";
}) => {
  const { trigger, isMutating } = useAddMagicSocialAccount();
  return (
    <Button
      size="regular"
      tw="mt-2"
      onPress={() =>
        trigger({
          type,
        })
      }
    >
      <View tw="flex-row items-center">
        <View tw="mr-1.5">{icon}</View>
        <Text tw="font-semibold text-white dark:text-black">{title} </Text>
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
