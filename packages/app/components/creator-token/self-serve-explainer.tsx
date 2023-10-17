import { useEffect } from "react";
import { Platform } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Flip, ShowtimeRounded } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useCreatorTokenDeployStatus } from "app/hooks/creator-token/use-creator-token-deploy-status";
import { useCreatorTokenOptIn } from "app/hooks/creator-token/use-creator-token-opt-in";
import { useRedirectToCreatorTokensShare } from "app/hooks/use-redirect-to-creator-tokens-share-screen";
import { useUser } from "app/hooks/use-user";

export const SelfServeExplainer = () => {
  const isDark = useIsDarkMode();
  const router = useRouter();
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
      <Text tw="text-xl font-bold text-gray-900 dark:text-white">
        Inviting onchain artists like you first.
      </Text>
      <View tw="web:py-0 py-4">
        <View tw="flex-row items-center py-2">
          <Text tw="mr-1 text-sm text-gray-900 dark:text-white">
            Introducing
          </Text>
          <ShowtimeRounded color={colors.gray[900]} width={14} height={14} />
          <Text tw="text-sm font-bold text-gray-900 dark:text-white">
            {" "}
            Creator Tokens.
          </Text>
        </View>
      </View>

      <View tw="mt-6 items-center rounded-3xl border border-gray-200 px-4 py-6">
        <Pressable tw="">
          <Avatar url={user?.data.profile.img_url} size={112} />
          <View tw="absolute bottom-0 left-0 right-0 top-0 flex-row items-center justify-center rounded-full bg-black/30">
            <Flip color="#fff" width={20} height={20} />
            <Text tw="ml-1 text-base font-bold text-white">Replace</Text>
          </View>
        </Pressable>
        <View tw="rounded-4xl mb-2 mt-4 w-full border border-gray-200 px-10 py-4">
          <View tw="flex-row items-center justify-between gap-4">
            <View tw="flex-1 items-center">
              <Text tw="text-xs text-gray-500">TOKEN</Text>
              <View tw="h-2" />
              <Text tw="text-base font-bold text-gray-900 dark:text-white">
                $1
              </Text>
              <Button
                tw="mt-2.5"
                style={{ backgroundColor: "#08F6CC", width: "100%" }}
              >
                <>
                  <Text tw="text-base font-bold text-gray-900">Buy</Text>
                </>
              </Button>
            </View>
            <View tw="flex-1 items-center justify-center">
              <Text tw="text-xs text-gray-500">COLLECTORS</Text>
              <View tw="h-2" />
              <Text tw="text-base font-bold text-gray-900 dark:text-white">
                0
              </Text>
              <Button
                tw="mt-2.5"
                style={{ backgroundColor: "#FD749D", width: "100%" }}
              >
                <>
                  <Text tw="text-base font-bold text-gray-900">Sell</Text>
                </>
              </Button>
            </View>
          </View>
        </View>
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
