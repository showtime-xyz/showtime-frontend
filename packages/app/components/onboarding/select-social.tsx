import React, { useContext } from "react";

import { MotiView } from "moti";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useMagicSocialAuth } from "app/lib/social-logins";

import { InstagramColorful, Twitter } from "design-system/icon";
import { Spinner } from "design-system/spinner";

import { Challenge } from "./hcaptcha";
import { OnboardingStepContext } from "./onboarding-context";

export const SelectSocial = () => {
  const { user, redirectUri } = useContext(OnboardingStepContext);
  const { performMagicAuthWithTwitter, connectInstagram, loading } =
    useMagicSocialAuth();

  const handleConnectTwitter = async () => {
    const res = await performMagicAuthWithTwitter();
    console.log("twitter tokens! send it to server ", res);
  };

  const handleConnectInstagram = async () => {
    const res = await connectInstagram();
    console.log("ig code from ig! send it to server ", res);
  };

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
          <Button size="regular" onPress={handleConnectTwitter}>
            <View tw="mr-1">
              <Twitter color="#4A99E9" width={20} height={20} />
            </View>
            Connect Twitter{" "}
            {loading === "twitter" ? (
              <View tw="absolute right-4 scale-75 justify-center">
                <Spinner size="small" color="darkgrey" />
              </View>
            ) : (
              <></>
            )}
          </Button>
          <Button size="regular" tw="mt-2" onPress={handleConnectInstagram}>
            <View tw="mr-1.5">
              <InstagramColorful width={20} height={20} />
            </View>
            Connect Instagram{" "}
            {loading === "instagram" ? (
              <View tw="absolute right-4 scale-75 justify-center">
                <Spinner size="small" color="darkgrey" />
              </View>
            ) : (
              <></>
            )}
          </Button>
          <Challenge />
        </View>
      </View>
    </MotiView>
  );
};
