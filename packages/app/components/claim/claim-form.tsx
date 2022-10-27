import { useRef, useContext, useMemo } from "react";
import {
  Linking,
  Platform,
  ScrollView as ReactNativeScrollView,
} from "react-native";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Check } from "@showtime-xyz/universal.icon";
import { Spotify } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AddWalletOrSetPrimary } from "app/components/add-wallet-or-set-primary";
import { CompleteProfileModalContent } from "app/components/complete-profile-modal-content";
import { Media } from "app/components/media";
import { MissingSignatureMessage } from "app/components/missing-signature-message";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { ClaimContext } from "app/context/claim-context";
import { useMyInfo, useUserProfile } from "app/hooks/api-hooks";
import { useComments } from "app/hooks/api/use-comments";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useShare } from "app/hooks/use-share";
import { useSpotifyGatedClaim } from "app/hooks/use-spotify-gated-claim";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { linkifyDescription } from "app/lib/linkify";
import { useRudder } from "app/lib/rudderstack";
import {
  formatAddressShort,
  getCreatorUsernameFromNFT,
  getProfileName,
  getTwitterIntent,
  getTwitterIntentUsername,
  isMobileWeb,
  userHasIncompleteExternalLinks,
} from "app/utilities";

export const ClaimForm = ({ edition }: { edition: CreatorEditionResponse }) => {
  const { rudder } = useRudder();
  const { state } = useContext(ClaimContext);

  const isDark = useIsDarkMode();
  const { claimNFT, onReconnectWallet } = useClaimNFT(
    edition.creator_airdrop_edition
  );
  const { claimSpotifyGatedDrop } = useSpotifyGatedClaim(
    edition.creator_airdrop_edition
  );

  const share = useShare();
  const router = useRouter();
  const { user } = useUser();
  const scrollViewRef = useRef<ReactNativeScrollView>(null);
  const { isMagic } = useWeb3();
  const comment = useRef("");
  const { data: nft } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition.creator_airdrop_edition.contract_address,
  });
  const redirectToClaimDrop = useRedirectToClaimDrop();

  const { newComment } = useComments(nft?.data?.item?.nft_id);

  const { data: creatorProfile } = useUserProfile({
    address: nft?.data.item.creator_address,
  });

  const { follow, data: userProfile } = useMyInfo();
  const { mutate } = useCreatorCollectionDetail(
    nft?.data.item.creator_airdrop_edition_address
  );

  const handleClaimNFT = async () => {
    if (
      nft?.data.item.creator_id &&
      user?.data?.profile.profile_id !== nft?.data.item.creator_id
    ) {
      follow(nft?.data.item.creator_id);
    }

    if (
      edition.gating_type !== "spotify_save" ||
      user?.data.profile.has_spotify_token
    ) {
      router.pop();
    }

    let success: boolean | undefined = false;

    if (edition.gating_type === "spotify_save") {
      success = await claimSpotifyGatedDrop(nft?.data.item);
    } else {
      success = await claimNFT();
    }

    if (comment.current.trim().length > 0 && success) {
      newComment(comment.current);
    }
    mutate();
  };

  const linkifiedDescription = useMemo(
    () => linkifyDescription(edition.creator_airdrop_edition.description),
    [edition.creator_airdrop_edition.description]
  );
  // const [ensName, setEnsName] = React.useState<string | null>(null);
  // React.useEffect(() => {
  //   web3
  //     ?.getSigner()
  //     .getAddress()
  //     .then((addr) => {
  //       web3?.lookupAddress(addr).then((name) => {
  //         setEnsName(name);
  //       });
  //     });
  // }, [web3]);

  if (
    userProfile &&
    (!userProfile.data.profile.username ||
      userHasIncompleteExternalLinks(userProfile.data.profile) ||
      !userProfile.data.profile.bio ||
      !userProfile.data.profile.img_url)
  ) {
    return (
      <CompleteProfileModalContent
        title={`Show ${getProfileName(
          creatorProfile?.data?.profile
        )} who you are!`}
        description="Complete your profile first to collect this drop. It will take around 1 minute."
        cta="Complete profile to collect"
      />
    );
  }

  if (state.status === "share") {
    const claimUrl = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/t/${[
      process.env.NEXT_PUBLIC_CHAIN_ID,
    ]}/${edition?.creator_airdrop_edition.contract_address}/0`;

    const isShareAPIAvailable = Platform.select({
      default: true,
      web: typeof window !== "undefined" && !!navigator.share && isMobileWeb(),
    });

    return (
      <View tw="items-center justify-center">
        <Media
          item={nft?.data.item}
          sizeStyle={{ height: 200, width: 200, borderRadius: 16 }}
        />
        <View>
          <View tw="h-8" />
          <Text tw="text-center text-4xl text-black dark:text-white">
            Congrats!
          </Text>
          <View tw="mt-4">
            <Text tw="text-center text-2xl text-black dark:text-white">
              Share it with the world!
            </Text>
          </View>
          <View tw="mt-4 mb-8">
            <Text tw="text-center text-sm text-gray-900 dark:text-gray-100">
              {user?.data.claim_tank.available_claims
                ? `You have ${user?.data.claim_tank.available_claims}/${user?.data.claim_tank.tank_limit} claims available`
                : `Your next claim will be available in ${user?.data.claim_tank.next_refill_at} min`}
            </Text>
          </View>
          <Button
            onPress={() => {
              rudder?.track("Drop Shared", { type: "Twitter" });
              Linking.openURL(
                getTwitterIntent({
                  url: claimUrl,
                  message: `I just collected a free drop "${
                    nft?.data.item.token_name
                  }" by ${getTwitterIntentUsername(
                    creatorProfile?.data?.profile
                  )} on @Showtime_xyz! 🎁🔗\n\nCollect it for free here:`,
                })
              );
            }}
            tw="bg-[#00ACEE]"
            variant="text"
            accentColor="#fff"
          >
            Share on Twitter
          </Button>
          <View tw="h-4" />
          <Button
            onPress={async () => {
              const result = await share({
                url: claimUrl,
              });

              if (result.action === "sharedAction") {
                rudder?.track(
                  "Drop Shared",
                  result.activityType
                    ? { type: result.activityType }
                    : undefined
                );
              }
            }}
          >
            {isShareAPIAvailable
              ? "Share with your friends"
              : "Copy drop link 🔗"}
          </Button>
        </View>
      </View>
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

  const ScrollComponent =
    Platform.OS === "android" ? BottomSheetScrollView : ScrollView;

  return (
    <ScrollComponent ref={scrollViewRef as any}>
      <View tw="flex-1 items-start p-4">
        <View tw="flex-row">
          <Media
            isMuted
            item={nft?.data.item}
            sizeStyle={{
              width: 80,
              height: 80,
              borderRadius: 16,
            }}
          />
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
          {edition.gating_type === "spotify_save" ? (
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
                  You will save "{edition.spotify_track_name}" to your Spotify
                  library
                </Text>
              </View>
            </>
          ) : null}

          <View tw="mt-4 flex-row items-center">
            <CheckIcon />
            <Text tw="ml-1 text-gray-900 dark:text-gray-100">
              You will follow {getCreatorUsernameFromNFT(nft?.data.item)}
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
              disabled={state.status === "loading"}
              tw={state.status === "loading" ? "opacity-[0.45]" : ""}
              onPress={handleClaimNFT}
            >
              {state.status === "loading" ? (
                "Collecting... it should take about 10 seconds"
              ) : state.status === "error" ? (
                "Failed. Retry!"
              ) : edition.gating_type === "spotify_save" &&
                !user.data.profile.has_spotify_token ? (
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

          {state.signaturePrompt && !isMagic ? (
            <MissingSignatureMessage
              onReconnectWallet={onReconnectWallet}
              onMount={() => {
                scrollViewRef.current?.scrollToEnd();
              }}
            />
          ) : null}
        </View>
      </View>
    </ScrollComponent>
  );
};

const CheckIcon = () => {
  const isDark = useIsDarkMode();
  return (
    <View tw="items-center justify-center">
      <View tw="rounded-full bg-gray-800 p-3 dark:bg-gray-100"></View>
      <View tw="z-9 absolute">
        <Check
          height={20}
          width={20}
          //@ts-ignore
          color={isDark ? colors.gray[900] : colors.gray[100]}
        />
      </View>
    </View>
  );
};
