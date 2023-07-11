import {
  useRef,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Linking,
  Platform,
  ScrollView as ReactNativeScrollView,
} from "react-native";

import * as Location from "expo-location";
import type { LocationObject } from "expo-location";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CheckFilled } from "@showtime-xyz/universal.icon";
import { Spotify } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AddWalletOrSetPrimary } from "app/components/add-wallet-or-set-primary";
import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { Media } from "app/components/media";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { QRCodeModal } from "app/components/qr-code";
import { ClaimContext } from "app/context/claim-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useComments } from "app/hooks/api/use-comments";
import { useAppleMusicGatedClaim } from "app/hooks/use-apple-music-gated-claim";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useSpotifyGatedClaim } from "app/hooks/use-spotify-gated-claim";
import { useUser } from "app/hooks/use-user";
import { Analytics, EVENTS } from "app/lib/analytics";
import { linkifyDescription } from "app/lib/linkify";
import { createParam } from "app/navigation/use-param";
import { ContractVersion } from "app/types";
import {
  cleanUserTextInput,
  formatAddressShort,
  getCreatorUsernameFromNFT,
  limitLineBreaks,
  removeTags,
} from "app/utilities";

export type ClaimType = "appleMusic" | "spotify" | "free";
type Query = {
  type: ClaimType;
};

const { useParam } = createParam<Query>();

export const ClaimForm = ({
  edition,
  password: passwordFromQueryParam = "",
}: {
  edition: CreatorEditionResponse;
  password?: string;
}) => {
  const { state } = useContext(ClaimContext);

  const [claimType] = useParam("type");
  const isDark = useIsDarkMode();
  const { claimNFT } = useClaimNFT(edition.creator_airdrop_edition);
  const { claimSpotifyGatedDrop, isMutating: isSpotifyDropMutating } =
    useSpotifyGatedClaim(edition.creator_airdrop_edition);
  const { claimAppleMusicGatedDrop, isMutating: isAppleMusicDropMutating } =
    useAppleMusicGatedClaim(edition.creator_airdrop_edition);

  const isLoading = isAppleMusicDropMutating || isSpotifyDropMutating;
  const router = useRouter();
  const { user, isIncompletedProfile } = useUser({
    redirectTo: "/login",
    redirectIfProfileIncomplete: true,
  });

  const scrollViewRef = useRef<ReactNativeScrollView>(null);
  const comment = useRef("");
  const { data: nft } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition.creator_airdrop_edition.contract_address,
  });
  const redirectToClaimDrop = useRedirectToClaimDrop();

  const { newComment } = useComments(nft?.data?.item?.nft_id);

  const { follow } = useMyInfo();
  const { mutate } = useCreatorCollectionDetail(
    nft?.data.item.creator_airdrop_edition_address
  );
  const [password, setPassword] = useState(passwordFromQueryParam);

  const [location, setLocation] = useState<LocationObject | undefined>(
    undefined
  );
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const getLocation = useCallback(async () => {
    const { status, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocationErrorMsg("Permission to access location was denied");
      if (canAskAgain && Platform.OS !== "web") {
        getLocation();
      } else {
        Alert.alert(
          "Location",
          "Needs your location services to continue. You can turn them on in your device’s settings.",
          Platform.select({
            native: [
              {
                text: "Not now",
              },
              {
                text: "Settings",
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
            default: [
              {
                text: "Got it",
              },
            ],
          })
        );
      }
      return;
    } else {
      setLocationErrorMsg(null);
    }

    const location = await Location.getCurrentPositionAsync();
    setLocation(location);
  }, []);

  useEffect(() => {
    if (edition.gating_type === "location" || edition.gating_type === "multi") {
      getLocation();
    }
  }, [edition.gating_type, getLocation]);
  const closeModal = () => {
    router.pop();
  };
  const handleClaimNFT = async () => {
    if (
      nft?.data.item.creator_id &&
      user?.data?.profile.profile_id !== nft?.data.item.creator_id
    ) {
      follow(nft?.data.item.creator_id);
    }

    let success: boolean | undefined | void = false;

    if (
      edition.gating_type === "multi_provider_music_save" ||
      edition.gating_type === "multi_provider_music_presave"
    ) {
      if (claimType === "spotify") {
        Analytics.track(EVENTS.SPOTIFY_SAVE_PRESSED_BEFORE_LOGIN);
        success = await claimSpotifyGatedDrop({ closeModal });
      } else if (claimType === "appleMusic") {
        Analytics.track(EVENTS.APPLE_MUSIC_SAVE_PRESSED_BEFORE_LOGIN);
        success = await claimAppleMusicGatedDrop({ closeModal });
      } else {
        success = await claimNFT({ closeModal });
      }
    } else if (
      edition.gating_type === "spotify_save" ||
      edition.gating_type === "spotify_presave" ||
      edition?.gating_type === "music_presave"
    ) {
      Analytics.track(EVENTS.SPOTIFY_SAVE_PRESSED_BEFORE_LOGIN);
      success = await claimSpotifyGatedDrop({ closeModal });
    } else if (edition.gating_type === "password") {
      success = await claimNFT({ password: password.trim(), closeModal });
    } else if (edition.gating_type === "location") {
      success = await claimNFT({ location, closeModal });
    } else if (edition.gating_type === "multi") {
      success = await claimNFT({
        password: password.trim(),
        location,
        closeModal,
      });
    } else {
      success = await claimNFT({ closeModal });
    }

    if (comment.current.trim().length > 0 && success) {
      newComment(comment.current);
    }
    mutate();
  };

  const linkifiedDescription = useMemo(
    () =>
      edition?.creator_airdrop_edition?.description
        ? linkifyDescription(
            limitLineBreaks(
              cleanUserTextInput(
                removeTags(edition.creator_airdrop_edition.description)
              )
            )
          )
        : "",
    [edition?.creator_airdrop_edition?.description]
  );
  const isDisableButton =
    isLoading ||
    state.status === "loading" ||
    (edition.gating_type === "multi" && !location && !password) ||
    (edition.gating_type === "password" && !password) ||
    (edition.gating_type === "location" && !location?.coords);

  const collectingMsg =
    edition.creator_airdrop_edition?.contract_version ===
    ContractVersion.BATCH_V1
      ? "Collecting..."
      : "Collecting... it should take about 10 seconds";

  if (isIncompletedProfile) {
    return null;
  }

  if (state.status === "share") {
    return (
      <QRCodeModal
        contractAddress={edition?.creator_airdrop_edition.contract_address}
      />
    );
  }

  const primaryWallet = user?.data.profile.primary_wallet;

  if (!primaryWallet) {
    return (
      <AddWalletOrSetPrimary
        onPrimaryWalletSetCallback={() =>
          redirectToClaimDrop(edition.creator_airdrop_edition.contract_address)
        }
        title="Choose a primary wallet to receive your drop"
        description="Please choose which wallet will receive your drop. You only have to do this once!"
      />
    );
  }

  return (
    <BottomSheetScrollView ref={scrollViewRef as any}>
      <View tw="flex-1 items-start p-4">
        <View tw="flex-row">
          <View tw="relative overflow-hidden rounded-2xl">
            <Media
              isMuted
              item={nft?.data.item}
              sizeStyle={{
                width: 80,
                height: 80,
              }}
            />
          </View>
          <View tw="ml-4 flex-1">
            <Text
              tw="text-xl font-bold text-black dark:text-white"
              numberOfLines={2}
            >
              {edition.creator_airdrop_edition.name}
            </Text>
            <View tw="h-2" />
            <Text tw="text-gray-700 dark:text-gray-400">
              {getCreatorUsernameFromNFT(nft?.data.item)}
            </Text>
          </View>
        </View>
        <View tw="mt-4 w-full">
          <View tw="mb-4">
            <Text tw="text-gray-900 dark:text-gray-100">
              {linkifiedDescription}
            </Text>
          </View>
          {edition.gating_type === "spotify_save" ||
          edition?.gating_type === "music_presave" ||
          edition.gating_type === "spotify_presave" ? (
            <>
              <View tw="mt-4 flex-row items-center">
                {user.data.profile.has_spotify_token ? (
                  <CheckIcon />
                ) : (
                  <View tw="rounded-full border-[1px] border-gray-800 p-3 dark:border-gray-100" />
                )}
                <Text tw="ml-1 text-gray-900 dark:text-gray-100">
                  Connect your Spotify account
                </Text>
              </View>

              <View tw="mt-4 flex-row items-center">
                <CheckIcon />
                <Text tw="ml-1 text-gray-900 dark:text-gray-100">
                  {edition.gating_type === "spotify_save"
                    ? `You will save ${
                        edition.spotify_track_name
                          ? '"' + edition.spotify_track_name + '"'
                          : "this song"
                      } to your Spotify library`
                    : `You will pre-save ${
                        edition.spotify_track_name
                          ? '"' + edition.spotify_track_name + '"'
                          : "this song"
                      } to your Spotify library`}
                </Text>
              </View>
            </>
          ) : null}

          {edition.gating_type === "multi_provider_music_save" ||
          edition.gating_type === "multi_provider_music_presave" ? (
            <>
              {claimType === "appleMusic" ? (
                <>
                  <View tw="mt-4 flex-row items-center">
                    {user.data.profile.has_apple_music_token ? (
                      <CheckIcon />
                    ) : (
                      <View tw="h-5 w-5 rounded-full border-[1px] border-gray-800 dark:border-gray-100" />
                    )}
                    <Text tw="ml-1 text-gray-900 dark:text-gray-100">
                      Connect your Apple Music account
                    </Text>
                  </View>
                  <View tw="mt-4 flex-row items-center">
                    <CheckIcon />
                    <Text tw="ml-1 text-gray-900 dark:text-gray-100">
                      You will save{" "}
                      {edition.spotify_track_name
                        ? '"' + edition.spotify_track_name + '"'
                        : "this song"}{" "}
                      to your Apple Music library
                    </Text>
                  </View>
                </>
              ) : null}
              {claimType === "spotify" ? (
                <>
                  <View tw="mt-4 flex-row items-center">
                    {user.data.profile.has_spotify_token ? (
                      <CheckIcon />
                    ) : (
                      <View tw="h-5 w-5 rounded-full border-[1px] border-gray-800 dark:border-gray-100" />
                    )}
                    <Text tw="ml-1 text-gray-900 dark:text-gray-100">
                      Connect your Spotify account
                    </Text>
                  </View>
                  <View tw="mt-4 flex-row items-center">
                    <CheckIcon />
                    <Text tw="ml-1 text-gray-900 dark:text-gray-100">
                      You will save{" "}
                      {edition.spotify_track_name
                        ? '"' + edition.spotify_track_name + '"'
                        : "this song"}{" "}
                      to your Spotify library
                    </Text>
                  </View>
                </>
              ) : null}
            </>
          ) : null}

          {edition.gating_type === "password" ||
          edition.gating_type === "multi" ? (
            <>
              <View tw="mt-4 flex-row items-center">
                <Fieldset
                  tw="mt-4 flex-1"
                  label="Password"
                  placeholder="Enter the password"
                  onChangeText={setPassword}
                  returnKeyLabel="Enter"
                  returnKeyType="done"
                  onSubmitEditing={handleClaimNFT}
                  secureTextEntry
                  defaultValue={password}
                />
              </View>
            </>
          ) : null}

          {edition.gating_type === "location" ||
          edition.gating_type === "multi" ? (
            <>
              <View tw="mt-4 flex-row items-center">
                {locationErrorMsg ? (
                  <Pressable onPress={getLocation} tw="flex-row items-center">
                    <CheckIcon disabled />
                    <Text tw="ml-1 text-gray-900 dark:text-gray-100">
                      {locationErrorMsg}
                    </Text>
                  </Pressable>
                ) : (
                  <>
                    <CheckIcon disabled={!location?.coords} />
                    <Text tw="ml-1 text-gray-900 dark:text-gray-100">
                      {location?.coords.latitude &&
                      location?.coords.longitude ? (
                        <Text>
                          Latitude: {location?.coords.latitude.toFixed(2)}{" "}
                          Longitude: {location?.coords.longitude.toFixed(2)}
                        </Text>
                      ) : (
                        "Fetching your location..."
                      )}
                    </Text>
                  </>
                )}
              </View>
            </>
          ) : null}

          <View tw="mt-4 flex-row items-center">
            <CheckIcon />
            <Text tw="ml-1 text-gray-900 dark:text-gray-100">
              You will follow{" "}
              <Text tw="font-semibold">
                {getCreatorUsernameFromNFT(nft?.data.item)}
              </Text>
            </Text>
          </View>

          <View tw="mt-4 flex-row items-center">
            <CheckIcon />
            <Text tw="ml-1 text-gray-900 dark:text-gray-100">
              You will join{" "}
              <Text tw="font-semibold">
                {getCreatorUsernameFromNFT(nft?.data.item)}
              </Text>
              's channel
            </Text>
          </View>

          {state.status === "idle" ? (
            <Fieldset
              tw="mt-4 flex-1"
              label="Comment (optional)"
              placeholder="Wow, this is so cool!"
              onChangeText={(v) => (comment.current = v)}
              returnKeyLabel="Collect"
              returnKeyType="done"
              onSubmitEditing={handleClaimNFT}
            />
          ) : null}

          <View tw="mt-4">
            <Button
              size="regular"
              variant="primary"
              disabled={isDisableButton}
              tw={isDisableButton ? "opacity-[0.45]" : ""}
              onPress={handleClaimNFT}
            >
              {isLoading ? (
                "Loading..."
              ) : state.status === "loading" ? (
                collectingMsg
              ) : state.status === "error" ? (
                "Failed. Retry!"
              ) : edition.gating_type === "spotify_save" ||
                edition.gating_type === "spotify_presave" ||
                edition?.gating_type === "music_presave" ? (
                <View tw="w-full flex-row items-center justify-center">
                  <Spotify color={isDark ? "#000" : "#fff"} />
                  <Text tw="ml-2 font-semibold text-white dark:text-black">
                    Save to Collect
                  </Text>
                </View>
              ) : (
                "Collect"
              )}
            </Button>
            <View tw="mt-4">
              <Text tw="text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                to{" "}
                {primaryWallet.nickname
                  ? primaryWallet.nickname +
                    " (" +
                    formatAddressShort(primaryWallet.address) +
                    ")"
                  : formatAddressShort(primaryWallet.address)}
              </Text>
            </View>
            <View tw="mt-4">
              <PolygonScanButton transactionHash={state.transactionHash} />
            </View>
          </View>

          {state.error ? (
            <View tw="mt-4">
              <Text tw="text-red-500">{state.error}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

const CheckIcon = ({ disabled = false }) => {
  const isDark = useIsDarkMode();
  return (
    <View tw={["items-center justify-center", disabled ? "opacity-60" : ""]}>
      <CheckFilled
        height={20}
        width={20}
        color={isDark ? colors.white : colors.gray[700]}
      />
    </View>
  );
};
