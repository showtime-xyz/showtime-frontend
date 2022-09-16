import { useRef } from "react";
import { Linking, Platform, ScrollView as RNScrollView } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Check } from "@showtime-xyz/universal.icon";
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
import { useMyInfo, useUserProfile } from "app/hooks/api-hooks";
import { useComments } from "app/hooks/api/use-comments";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { useRudder } from "app/lib/rudderstack";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
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
  const { state, claimNFT, onReconnectWallet } = useClaimNFT(
    edition?.creator_airdrop_edition
  );
  const share = useShare();
  const router = useRouter();
  const { isAuthenticated, user } = useUser();
  const navigateToLogin = useNavigateToLogin();
  const scrollViewRef = useRef<RNScrollView>(null);
  const { isMagic } = useWeb3();
  const comment = useRef("");
  const { data: nft } = useNFTDetailByTokenId({
    //@ts-ignore
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition.creator_airdrop_edition.contract_address,
  });

  const isDark = useIsDarkMode();
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

    const success = await claimNFT();

    if (comment.current.trim().length > 0 && success) {
      newComment(comment.current);
    }

    mutate();
  };

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

  if (!isAuthenticated) {
    return (
      <View tw="p-4">
        <Button onPress={navigateToLogin}>Please login to continue</Button>
      </View>
    );
  }

  if (
    !userProfile?.data.profile.username ||
    userHasIncompleteExternalLinks(userProfile?.data.profile) ||
    !userProfile?.data.profile.bio ||
    !userProfile?.data.profile.img_url
  ) {
    return (
      <CompleteProfileModalContent
        title={`Show ${getProfileName(
          creatorProfile?.data?.profile
        )} who you are!`}
        description="Complete your profile first to claim this drop. It will take around 1 minute."
        cta="Complete profile to claim"
      />
    );
  }

  if (state.status === "success") {
    const claimUrl = `https://showtime.xyz/t/${[
      process.env.NEXT_PUBLIC_CHAIN_ID,
    ]}/${edition?.creator_airdrop_edition.contract_address}/0`;

    const isShareAPIAvailable = Platform.select({
      default: true,
      web: typeof window !== "undefined" && !!navigator.share && isMobileWeb(),
    });

    return (
      <View tw="items-center justify-center p-4">
        <Text tw="text-8xl">🎉</Text>
        <View>
          <View tw="h-8" />
          <Text tw="text-center text-4xl text-black dark:text-white">
            Congrats!
          </Text>
          <View tw="mt-8 mb-10">
            <Text tw="text-center text-2xl text-black dark:text-white">
              Now share it with the world!
            </Text>
          </View>
          <Button
            onPress={() => {
              rudder?.track("Drop Shared", { type: "Twitter" });
              Linking.openURL(
                getTwitterIntent({
                  url: claimUrl,
                  message: `I just claimed a free NFT "${
                    nft?.data.item.token_name
                  }" by ${getTwitterIntentUsername(
                    creatorProfile?.data?.profile
                  )} on @Showtime_xyz! 🎁🔗\n\nClaim yours for free here:`,
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
              ? "Share NFT with your friends"
              : "Copy drop link 🔗"}
          </Button>
          <Button variant="tertiary" tw="mt-4" onPress={router.pop}>
            Skip for now
          </Button>
        </View>
      </View>
    );
  }

  const primaryWallet = user?.data.profile.primary_wallet;

  if (!primaryWallet) {
    return (
      <AddWalletOrSetPrimary
        title="Choose a primary wallet to receive your drop"
        description="Please choose which wallet will receive your drop. You only have to do this once!"
      />
    );
  }

  return (
    <ScrollView ref={scrollViewRef}>
      <View tw="flex-1 items-start p-4">
        <View tw="flex-row">
          <Media
            isMuted
            item={nft?.data.item}
            sizeStyle={{
              width: 80,
              height: 80,
            }}
            tw="rounded-lg"
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
              {edition.creator_airdrop_edition.description}
            </Text>
          </View>
          <View tw="flex-row justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <View>
              <Text tw="pb-2 text-sm font-semibold text-gray-600 dark:text-gray-200">
                Wallet
              </Text>
              <Text tw="max-w-[300px] text-sm font-bold text-gray-900 dark:text-gray-100">
                {primaryWallet.nickname +
                  " (" +
                  formatAddressShort(primaryWallet.address) +
                  ")"}
              </Text>
            </View>
            <View>
              <Text tw="pb-2 text-sm font-semibold text-gray-600 dark:text-gray-200">
                Claim amount
              </Text>
              <Text tw="text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                1/{edition.creator_airdrop_edition.edition_size}
              </Text>
            </View>
          </View>

          <View tw="mt-4 flex-row items-center">
            <Check
              height={20}
              width={20}
              //@ts-ignore
              color={isDark ? colors.gray[100] : colors.gray[900]}
            />
            <Text tw="ml-1 text-gray-900 dark:text-gray-100">
              You'll follow {getCreatorUsernameFromNFT(nft?.data.item)}
            </Text>
          </View>

          <Fieldset
            tw="mt-4 flex-1"
            label="Add a comment (optional)"
            placeholder="wow, this is so cool!"
            onChangeText={(v) => (comment.current = v)}
          />
          <View tw="mt-4">
            <Button
              size="regular"
              variant="primary"
              disabled={state.status === "loading"}
              tw={state.status === "loading" ? "opacity-45" : ""}
              onPress={handleClaimNFT}
            >
              {state.status === "loading"
                ? "Claiming..."
                : state.status === "error"
                ? "Failed. Retry!"
                : "Claim for free"}
            </Button>

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
    </ScrollView>
  );
};
