import { useEffect } from "react";
import { Platform } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Flip, ShowtimeRounded } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useCreatorTokenDeployStatus } from "app/hooks/creator-token/use-creator-token-deploy-status";
import { useCreatorTokenOptIn } from "app/hooks/creator-token/use-creator-token-opt-in";
import { useContentWidth } from "app/hooks/use-content-width";
import { useRedirectToCreatorTokensShare } from "app/hooks/use-redirect-to-creator-tokens-share-screen";
import { useUser } from "app/hooks/use-user";

export const SelfServeExplainer = () => {
  const isDark = useIsDarkMode();
  const width = useContentWidth();
  const { user } = useUser();
  const { top } = useSafeAreaInsets();
  const { trigger: deployContract, isMutating } = useCreatorTokenOptIn();
  const redirectToCreatorTokensShare = useRedirectToCreatorTokensShare();
  const creatorTokenDeployStatus = useCreatorTokenDeployStatus({
    onSuccess: () => {
      if (user?.data.profile.username) {
        redirectToCreatorTokensShare({
          username: user?.data.profile.username,
          type: "launched",
        });
      }
    },
  });

  const loading = creatorTokenDeployStatus.status === "pending" || isMutating;
  console.log("creatorTokenDeployStatus", creatorTokenDeployStatus.status);

  return (
    <View
      tw="md:max-w-screen-content px-5"
      style={{
        paddingTop: Platform.select({ web: 0, default: top + 48 }),
        paddingHorizontal: 20,
      }}
    >
      <Text tw="text-2xl font-bold text-gray-900 dark:text-white">
        You're invited to be first.
      </Text>
      <View tw="web:py-0 py-4">
        <View tw="flex-row items-center py-2">
          <Text tw="text-sm text-gray-900 dark:text-white">
            Introducing{" "}
            <View tw="flex-row items-end pt-0.5">
              <ShowtimeRounded
                color={colors.gray[900]}
                width={16}
                height={16}
              />
              <Text tw="font-bold"> Creator Tokens.</Text>
            </View>
          </Text>
        </View>
        <Text tw="leading45 text-sm text-gray-900 dark:text-white">
          In one click, let your fans access your{" "}
          <Text tw="font-bold">Channel.</Text>, starting at $1. Every purchase,
          your Token <Text tw="font-bold">price increases.</Text>
        </Text>
      </View>
      <Image
        source={{
          uri: "https://showtime-media.b-cdn.net/assets/creator-profile-example.png",
        }}
        tw="ios:-mx-5 android:-mx-5"
        width={width}
        height={width * (203 / 284)}
      />
      <View tw="items-center rounded-3xl border border-gray-200 px-4 py-6">
        <Pressable tw="">
          <Avatar url={user?.data.profile.img_url} size={112} />
          <View tw="absolute bottom-0 left-0 right-0 top-0 flex-row items-center justify-center rounded-full bg-black/30">
            <Flip color="#fff" width={20} height={20} />
            <Text tw="ml-1 text-base font-bold text-white">Replace</Text>
          </View>
        </Pressable>
        <View tw="pb-6 pt-4">
          <Text tw="text-13 text-gray-900 dark:text-white">
            Your Creator Token is a collectible, and your profile picture will
            be its image. You can update this later.
          </Text>
        </View>
        <Button
          size="regular"
          tw={`w-full ${loading ? "opacity-50" : ""}`}
          disabled={loading}
          onPress={async () => {
            await deployContract();
            creatorTokenDeployStatus.pollDeployStatus();
          }}
        >
          <>
            <ShowtimeRounded
              color={isDark ? colors.gray[900] : colors.white}
              width={20}
              height={20}
            />
            <Text tw="ml-1 text-base font-bold text-white dark:text-gray-900">
              {loading ? "Creating your Token..." : "Create your Token"}
            </Text>
          </>
        </Button>
      </View>
    </View>
  );
};
