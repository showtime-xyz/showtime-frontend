import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
  Suspense,
} from "react";
import {
  Dimensions,
  Linking,
  Platform,
  useWindowDimensions,
  View as RNView,
} from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Instagram,
  TwitterOutline,
  Download,
  Link,
} from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors, styled } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { ErrorBoundary } from "app/components/error-boundary";
import { useUserProfile } from "app/hooks/api-hooks";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useGetImageColors } from "app/hooks/use-get-image-colors";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTURL } from "app/hooks/use-share-nft";
import domtoimage from "app/lib/dom-to-image";
import { Logger } from "app/lib/logger";
import Share from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";
import { createParam } from "app/navigation/use-param";
import {
  getCreatorUsernameFromNFT,
  getMediaUrl,
  getProfileImage,
  getTwitterIntent,
  getTwitterIntentUsername,
  isMobileWeb,
} from "app/utilities";

import { Avatar } from "design-system/avatar";
import { Pressable } from "design-system/pressable";
import { breakpoints } from "design-system/theme";
import { toast } from "design-system/toast";

import { contentGatingType } from "../content-type-tooltip";
import { ShowtimeBrandLogo } from "../showtime-brand";
import { StarBottomLeft, StarBottomRight, StarTop } from "./decoration-icons";
import { ShareButton } from "./share-button";

const { width: windowWidth } = Dimensions.get("window");
const StyledLinearGradient = styled(LinearGradient);
const PlatformBlurView = Platform.OS === "web" ? View : styled(BlurView);
type RaffleModalParams = {
  contractAddress?: string | undefined;
};
const { useParam } = createParam<RaffleModalParams>();

const RaffleSkeleton = ({ size = 375 }) => {
  const { colorScheme } = useColorScheme();
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
  const modalScreenContext = useModalScreenContext();
  const router = useRouter();
  const { data: edition, loading: isLoadingCollection } =
    useCreatorCollectionDetail(contractAddress || contractAddressProp);
  const winner = useMemo(() => {
    if (!edition?.raffles) return null;
    const winnerIndex = edition?.raffles.findIndex((item) => !!item.winner);
    if (winnerIndex === -1) return null;
    return edition?.raffles[winnerIndex].winner;
  }, [edition?.raffles]);

  console.log(edition?.raffles);

  const { data: profile } = useUserProfile({
    address: winner?.username ?? `${winner?.profile_id}` ?? winner?.ens_domain,
  });
  const winnerProfile = profile && profile?.data?.profile;

  const viewRef = useRef<RNView | Node>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const isDark = useIsDarkMode();
  const { bottom } = useSafeAreaInsets();

  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["sm"];
  const iconColor = isDark ? colors.white : colors.gray[900];
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

  const size = Platform.OS === "web" ? 276 : windowWidth - 48;

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

  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url: "",
        message: `Congratulations @${getTwitterIntentUsername(
          winnerProfile
        )} on winning the ${
          edition?.creator_airdrop_edition.name
        } raffle on @showtime_xyz! \nDM me for more details!`,
      })
    );
  }, [edition?.creator_airdrop_edition.name, winnerProfile]);

  if (isLoadingCollection) {
    return <RaffleSkeleton size={size} />;
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
              <View tw="px-4">
                <View collapsable={false} ref={viewRef as any}>
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
                        onPress={() =>
                          router.push(
                            `/profile/${winner?.username ?? winner?.profile_id}`
                          )
                        }
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
                  <View tw="m-4 items-center justify-center">
                    <Text tw="text-2xl font-bold text-black dark:text-white">
                      We have a winner 🎉
                    </Text>

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
                        onPress={shareWithTwitterIntent}
                        tw="w-full"
                      />
                    )}
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModalProvider>
        </View>
      </Suspense>
    </ErrorBoundary>
  );
};
