import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
  Suspense,
} from "react";
import {
  Linking,
  Platform,
  useWindowDimensions,
  View as RNView,
} from "react-native";

import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { ErrorBoundary } from "app/components/error-boundary";
import { useUserProfile } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { Logger } from "app/lib/logger";
import Share from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";
import {
  getInstagramUsername,
  getProfileImage,
  getTwitterIntent,
  getTwitterIntentUsername,
} from "app/utilities";

import { Avatar } from "design-system/avatar";
import { Pressable } from "design-system/pressable";
import { breakpoints } from "design-system/theme";

import { ShowtimeBrandLogo } from "../showtime-brand";
import { StarBottomLeft, StarBottomRight, StarTop } from "./decoration-icons";
import { ShareButton } from "./share-button";

type RaffleModalParams = {
  contractAddress?: string | undefined;
};
const { useParam } = createParam<RaffleModalParams>();

const RaffleSkeleton = () => {
  return (
    <View tw="items-center p-4">
      <View tw="shadow-light dark:shadow-dark w-full max-w-[420px] items-center justify-center rounded-3xl py-4">
        <Spinner />
      </View>
    </View>
  );
};

export const Raffle = (props?: RaffleModalParams) => {
  const { contractAddress: contractAddressProp } = props ?? {};
  const [contractAddress] = useParam("contractAddress");
  const router = useRouter();
  const { data: edition, loading: isLoadingCollection } =
    useCreatorCollectionDetail(contractAddress || contractAddressProp);
  const winner = useMemo(() => {
    if (!edition?.raffles) return null;
    const winnerIndex = edition?.raffles.findIndex((item) => !!item.winner);
    if (winnerIndex === -1) return null;
    return edition?.raffles[winnerIndex].winner;
  }, [edition?.raffles]);
  const { data: profile } = useUserProfile({
    address: winner?.username ?? `${winner?.profile_id}` ?? winner?.ens_domain,
  });
  const winnerProfile = profile && profile?.data?.profile;

  const viewRef = useRef<RNView | Node>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const isDark = useIsDarkMode();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["sm"];
  const [isInstalledApps, setIsInstalledApps] = useState({
    twitter: false,
    instagram: false,
  });
  useEffect(() => {
    // Notes: According on App Store rules, must be hide the option if the device doesn't have the app installed.
    const checkInstalled = async () => {
      let isInstalled = {
        twitter: false,
        instagram: false,
      };

      if (Platform.OS === "ios") {
        isInstalled = {
          instagram: await Linking.canOpenURL("instagram://"),
          twitter: await Linking.canOpenURL("twitter://"),
        };
      } else if (Platform.OS === "android") {
        const { isInstalled: instagram } = await Share.isPackageInstalled(
          "com.instagram.android"
        );
        const { isInstalled: twitter } = await Share.isPackageInstalled(
          "com.twitter.android"
        );
        isInstalled = {
          instagram,
          twitter,
        };
      }
      setIsInstalledApps({
        ...isInstalled,
      });
    };
    checkInstalled();
  }, []);

  const getViewShot = async (result?: CaptureOptions["result"]) => {
    const date = new Date();
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
        fileName: `QR Code - ${date.valueOf()}`,
        /**
         * Notes: Instagram need to format to base64,
         * I guess it's becuase of can't access private folder when deep link to other App
         */
        ...(result ? { result } : {}),
      });
      return uri;
    } catch (error) {
      Logger.log(`captureRefError: ${error}`);
    }
  };
  const checkPhotosPermission = useCallback(async () => {
    let hasPermission = false;
    if (status?.granted) {
      hasPermission = status?.granted;
    } else {
      const res = await requestPermission();
      hasPermission = res?.granted;
    }
    if (!hasPermission) {
      Alert.alert(
        "No permission",
        "To share the photo, you'll need to enable photo permissions first",
        [
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
    return hasPermission;
  }, [requestPermission, status?.granted]);
  const prepareShareToIG = useCallback(
    async (url: string) => {
      const hasPermission = await checkPhotosPermission();
      if (hasPermission) {
        await MediaLibrary.saveToLibraryAsync(url);
      }
      return hasPermission;
    },
    [checkPhotosPermission]
  );
  const shareSingleImage = useCallback(async () => {
    const url = await getViewShot();

    if (!url) {
      Alert.alert("Oops, An error occurred.");
      return;
    }
    const isCanShareToIG = await prepareShareToIG(url);
    if (!isCanShareToIG) {
      return;
    }
    try {
      const ShareResponse = await Share.shareSingle({
        title: getInstagramUsername(winnerProfile)
          ? `Congratulations ${getInstagramUsername(
              winnerProfile
            )} on winning the ${
              edition?.creator_airdrop_edition.name
            } raffle on @showtime_xyz!`
          : ``,
        backgroundImage: url,
        social: Share.Social.INSTAGRAM_STORIES,
        appId: "219376304", //instagram appId
        filename: `${
          edition?.creator_airdrop_edition?.name
        }-Raffle-Winner-${new Date().valueOf()}`,
      });
      Logger.log("shareSingleImage Result =>", ShareResponse);
    } catch (error) {
      Logger.error("shareSingleImage Error =>", error);
    }
  }, [edition?.creator_airdrop_edition.name, prepareShareToIG, winnerProfile]);
  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: "",
        message: `Congratulations to ${getTwitterIntentUsername(
          winnerProfile
        )}: you just won the raffle for "${
          edition?.creator_airdrop_edition.name
        }" on @showtime_xyz ✦\n\nDM me for more details.`,
      })
    );
  }, [edition?.creator_airdrop_edition.name, winnerProfile]);

  if (isLoadingCollection) {
    return <RaffleSkeleton />;
  }
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <View tw="p-4">
            <Spinner />
          </View>
        }
      >
        <View tw="w-full flex-1">
          <BottomSheetModalProvider>
            <BottomSheetScrollView>
              <View
                tw="bg-white px-4 py-8 dark:bg-black"
                collapsable={false}
                ref={viewRef as any}
              >
                <View tw="ml-2 md:ml-4">
                  <ShowtimeBrandLogo
                    color={isDark ? "#fff" : "#000"}
                    size={isMdWidth ? 20 : 16}
                  />
                </View>
                <View tw="items-center justify-center py-10">
                  <View tw="item-center justify-center">
                    <Avatar
                      url={getProfileImage(winnerProfile)}
                      alt={"Winner Avatar"}
                      size={240}
                      enableSkeleton
                    />
                    <Text tw="absolute -top-8 left-4 -rotate-[25deg] text-7xl">
                      👑
                    </Text>
                    <Pressable
                      onPress={() => {
                        if (Platform.OS !== "web") {
                          router.pop();
                          router.push(
                            `/@${winner?.username ?? winner?.profile_id}`
                          );
                        } else {
                          router.replace(
                            `/@${winner?.username ?? winner?.profile_id}`
                          );
                        }
                      }}
                      tw="-top-4 self-center rounded-full bg-white p-4 shadow-lg shadow-black/10 dark:bg-black dark:shadow-white/20"
                    >
                      <Text tw="text-lg font-bold text-black dark:text-white">
                        @{winner?.username}
                      </Text>
                    </Pressable>
                  </View>
                  <View tw="absolute right-6 top-0">
                    <StarTop
                      color={isDark ? colors.gray[900] : colors.gray[50]}
                      width={70}
                      height={70}
                    />
                  </View>
                  <View tw="absolute bottom-2 left-0">
                    <StarBottomLeft
                      color={isDark ? colors.gray[900] : colors.gray[50]}
                      width={80}
                      height={80}
                    />
                  </View>
                  <View tw="absolute bottom-0 right-0">
                    <StarBottomRight
                      color={isDark ? colors.gray[900] : colors.gray[50]}
                      width={75}
                      height={75}
                    />
                  </View>
                </View>
                <View tw="mx-4 items-center justify-center">
                  <Text tw="text-2xl font-bold text-black dark:text-white">
                    We have a winner 🎉
                  </Text>
                </View>
              </View>
              <View tw="mx-6">
                {(isInstalledApps.twitter || Platform.OS === "web") && (
                  <ShareButton
                    type="twitter"
                    onPress={shareWithTwitterIntent}
                    tw="mb-4 mt-8 w-full"
                  />
                )}

                {Platform.OS != "web" && isInstalledApps.instagram && (
                  <ShareButton
                    type="instagram"
                    onPress={shareSingleImage}
                    tw="w-full"
                  />
                )}
              </View>
            </BottomSheetScrollView>
          </BottomSheetModalProvider>
        </View>
      </Suspense>
    </ErrorBoundary>
  );
};
