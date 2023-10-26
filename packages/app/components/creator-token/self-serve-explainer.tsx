import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";

import { useSWRConfig } from "swr";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Flip, ShowtimeRounded } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { USER_PROFILE_KEY } from "app/hooks/api-hooks";
import { useCreatorTokenDeployStatus } from "app/hooks/creator-token/use-creator-token-deploy-status";
import { useCreatorTokenOptIn } from "app/hooks/creator-token/use-creator-token-opt-in";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useRedirectToCreatorTokensShare } from "app/hooks/use-redirect-to-creator-tokens-share-screen";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { useFilePicker } from "app/lib/file-picker";
import { Logger } from "app/lib/logger";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { getFileFormData } from "app/utilities";

import { toast } from "design-system/toast";

import { MediaCropper } from "../media-cropper";
import { Preview, getLocalFileURI } from "../preview";

export const SelfServeExplainer = () => {
  const { mutate } = useSWRConfig();
  const matchMutate = useMatchMutate();
  const isDark = useIsDarkMode();
  const { user } = useUser();
  const { top } = useSafeAreaInsets();
  const userProfilePic = user?.data.profile.img_url;

  const [profilePic, setProfilePic] = useState<string | undefined | File>(
    userProfilePic
  );
  const [value, setValue] = useState<File | undefined | string>();

  const [selectedImg, setSelectedImg] = useState<
    string | File | undefined | null
  >(null);

  const pickFile = useFilePicker();
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
  const onSubmit = useCallback(async () => {
    await axios({
      url: "/v1/creator-token/metadata/prepare",
      method: "POST",
    });
    if (value) {
      const formData = new FormData();
      const profilePictureFormData = await getFileFormData(value);
      if (profilePictureFormData) {
        formData.append("image", profilePictureFormData);

        try {
          await axios({
            url: "/v1/profile/photo",
            method: "POST",
            headers: {
              "Content-Type": `multipart/form-data`,
            },
            data: formData,
          });

          // TODO: optimise to make fewer API calls!
          mutate(MY_INFO_ENDPOINT);
          matchMutate(
            (key) => typeof key === "string" && key.includes(USER_PROFILE_KEY)
          );
        } catch (e) {
          toast.error("Failed to upload profile picture. Please try again");
          Logger.error("Failed to upload profile picture.", e);
        }
      }
    }

    await deployContract();
    creatorTokenDeployStatus.pollDeployStatus();
  }, [creatorTokenDeployStatus, deployContract, matchMutate, mutate, value]);

  Logger.log("creatorTokenDeployStatus", creatorTokenDeployStatus.status);

  return (
    <>
      <View
        tw="px-5"
        style={{
          paddingTop: Platform.select({ web: 0, default: top + 48 }),
          paddingHorizontal: 20,
        }}
      >
        <Text tw="text-xl font-bold text-gray-900 dark:text-white">
          Inviting onchain artists like you first.
        </Text>
        <View tw="flex-row items-center py-2">
          <Text tw="mr-1 text-sm text-gray-900 dark:text-white">
            Introducing
          </Text>
          <ShowtimeRounded
            color={isDark ? "white" : colors.gray[900]}
            width={14}
            height={14}
          />
          <Text tw="text-sm font-bold text-gray-900 dark:text-white">
            {" "}
            Creator Tokens.
          </Text>
        </View>
        <Text tw="text-sm text-gray-900 dark:text-white">
          In one click, let your fans access your Channel, starting at $1. Every
          purchase, your Token price increases.
        </Text>
        <View tw="mt-4 items-center rounded-3xl border border-gray-200 px-4 py-6 dark:border-gray-800">
          <Pressable
            onPress={async () => {
              const file = await pickFile({
                mediaTypes: "image",
                option: { allowsEditing: true, aspect: [1, 1] },
              });

              setSelectedImg(getLocalFileURI(file.file));
              setValue(file.file);
              if (Platform.OS !== "web") {
                setProfilePic(file.file);
              }
            }}
            tw="h-28 w-28 overflow-hidden rounded-full"
          >
            <Preview file={profilePic} width={112} height={112} />
            <View tw="absolute bottom-0 left-0 right-0 top-0 flex-row items-center justify-center rounded-full bg-black/30 dark:bg-white/30">
              <Flip color="#fff" width={20} height={20} />
              <Text tw="ml-1 text-base font-bold text-white">
                {profilePic ? "Replace" : "Upload"}
              </Text>
            </View>
          </Pressable>
          <View tw="rounded-4xl mb-2 mt-4 w-full border border-gray-200 px-10 py-4 dark:border-gray-800">
            <View tw="flex-row items-center justify-between gap-4">
              <View tw="flex-1 items-center">
                <Text tw="text-xs text-gray-500">TOKEN</Text>
                <View tw="h-2" />
                <Text tw="text-base font-bold text-gray-900 dark:text-white">
                  $1
                </Text>
                <Button
                  tw="pointer-events-none mt-2.5"
                  style={{ backgroundColor: "#08F6CC", width: "100%" }}
                  disabled
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
                  tw="pointer-events-none mt-2.5"
                  style={{ backgroundColor: "#FD749D", width: "100%" }}
                  disabled
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
            onPress={onSubmit}
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
      <MediaCropper
        src={selectedImg}
        visible={!!selectedImg}
        onClose={() => setSelectedImg(null)}
        aspect={1}
        title={`Crop your Creator Token picture`}
        cropViewHeight={380}
        onApply={async (e) => {
          const timestamp = new Date().valueOf();
          const imgFile = new File([e], timestamp.toString(), {
            lastModified: timestamp,
            type: e.type,
          });

          setProfilePic(imgFile);
          setValue(imgFile);
          setSelectedImg(null);
        }}
      />
    </>
  );
};
