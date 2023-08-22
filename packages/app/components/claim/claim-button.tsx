import { useContext, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { formatDistanceToNowStrict } from "date-fns";

import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Spotify,
  Check,
  Hourglass,
  PreAddAppleMusic,
  Sendv2,
} from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ButtonGoldLinearGradient } from "app/components/gold-gradient";
import { ClaimContext } from "app/context/claim-context";
import { useAppleMusicGatedClaim } from "app/hooks/use-apple-music-gated-claim";
import { useClaimDrop } from "app/hooks/use-claim-drop";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToChannelUnlocked } from "app/hooks/use-redirect-to-channel-unlocked-screen";
import { useRedirectToRaffleResult } from "app/hooks/use-redirect-to-raffle-result";
import { useSpotifyGatedClaim } from "app/hooks/use-spotify-gated-claim";
import { useUser } from "app/hooks/use-user";
import { NFT } from "app/types";

import { LABEL_SIZE_TW } from "design-system/button/constants";
import { ThreeDotsAnimation } from "design-system/three-dots";

import { ClaimPaidNFTButton } from "./claim-paid-nft-button";
import { ClaimStatus, getClaimStatus } from "./claim-status";

type ClaimButtonProps = ButtonProps & {
  edition: CreatorEditionResponse;
  tw?: string;
  style?: StyleProp<ViewStyle>;
  nft: NFT | null | undefined;
};

export const ClaimButton = ({
  edition,
  size = "small",
  tw = "",
  style,
  theme,
  nft,
  ...rest
}: ClaimButtonProps) => {
  const isDarkMode = useIsDarkMode();
  const isDark = theme === "dark" || (theme === "light" ? false : isDarkMode);
  const { isMutating: isAppleMusicCollectLoading } = useAppleMusicGatedClaim(
    edition.creator_airdrop_edition
  );
  const redirectToRaffleResult = useRedirectToRaffleResult();
  const { state: claimStates, contractAddress } = useContext(ClaimContext);
  const isProgress =
    claimStates.status === "loading" &&
    claimStates.signaturePrompt === false &&
    contractAddress === edition.creator_airdrop_edition.contract_address;
  const { isMutating: isSpotifyCollectLoading } = useSpotifyGatedClaim(
    edition.creator_airdrop_edition
  );
  const { isAuthenticated, user } = useUser();
  const isSelf =
    user?.data?.profile.profile_id ===
    edition.creator_airdrop_edition?.owner_profile_id;
  const redirectToChannelUnlocked = useRedirectToChannelUnlocked();

  const handleRaffleResultPress = () => {
    redirectToRaffleResult(edition.creator_airdrop_edition.contract_address);
  };
  const { handleClaimNFT } = useClaimDrop(edition);

  const status = getClaimStatus(edition);
  const isRaffleDrop = edition?.raffles && edition.raffles?.length > 0;

  const isPaidGated = edition?.gating_type === "paid_nft";

  const isSoldOut =
    status === ClaimStatus.Soldout || status === ClaimStatus.Claimed;
  const isExpired = status === ClaimStatus.Expired;

  const buttonProps = {
    style: [
      isSoldOut
        ? { backgroundColor: colors.green[600] }
        : isExpired && !isSoldOut
        ? { backgroundColor: colors.gray[500] }
        : {},
      style,
    ],
    size,
    tw: [
      isProgress ? "opacity-50" : isExpired && !isSoldOut ? "opacity-100" : "",
      tw,
    ],
    theme,
    ...rest,
  };

  const preAddIconheight = buttonProps.size === "small" ? 24 : 26;
  const raffleConcludedAt = useMemo(() => {
    if (!isSelf || !isRaffleDrop) return null;
    if (
      (edition.gating_type === "spotify_presave" ||
        edition?.gating_type === "music_presave") &&
      edition?.presave_release_date
    ) {
      return formatDistanceToNowStrict(
        new Date(edition?.presave_release_date),
        {
          addSuffix: true,
        }
      );
    }
    if (edition?.time_limit) {
      return formatDistanceToNowStrict(new Date(edition?.time_limit), {
        addSuffix: true,
      });
    }
  }, [
    edition.gating_type,
    edition?.presave_release_date,
    edition?.time_limit,
    isRaffleDrop,
    isSelf,
  ]);

  const isCanViewRaffleResult = useMemo(() => {
    const isRaffleHasWinner =
      isRaffleDrop && edition.raffles?.findIndex((r) => !!r.winner) != -1;
    return isSelf && isRaffleHasWinner;
  }, [edition.raffles, isRaffleDrop, isSelf]);

  if (isCanViewRaffleResult) {
    return (
      <Button {...buttonProps} onPress={handleRaffleResultPress}>
        <>
          <Text tw={["font-semibold text-white", LABEL_SIZE_TW[size]]}>
            {isPaidGated ? "Announce winner" : "Announce your raffle"}
          </Text>
        </>
      </Button>
    );
  } else if (raffleConcludedAt) {
    return (
      <Button {...buttonProps}>
        <>
          <Text
            tw={["text-center font-semibold text-white", LABEL_SIZE_TW[size]]}
          >
            Your raffle ends {`${raffleConcludedAt}`}
          </Text>
        </>
      </Button>
    );
  } else if (status === ClaimStatus.Claimed) {
    if (isPaidGated) {
      return (
        <Button
          tw={tw}
          size={size}
          {...rest}
          style={[
            style as any,
            {
              backgroundColor: "transparent",
            },
          ]}
          onPress={() => redirectToChannelUnlocked(nft?.contract_address)}
        >
          <>
            <ButtonGoldLinearGradient />
            <Sendv2 color={colors.gray[900]} width={18} height={20} />
            <Text
              tw={["ml-1 font-semibold text-gray-900", LABEL_SIZE_TW[size]]}
            >
              Share
            </Text>
          </>
        </Button>
      );
    }
    return (
      <Button {...buttonProps}>
        <>
          <Check color="white" width={18} height={18} />
          <Text tw={["ml-1 font-semibold text-white", LABEL_SIZE_TW[size]]}>
            Collected
          </Text>
        </>
      </Button>
    );
  } else if (status === ClaimStatus.Soldout) {
    return (
      <Button {...buttonProps} disabled>
        <>
          <Check color="white" width={20} height={20} />
          <Text tw={["ml-1 font-semibold text-white", LABEL_SIZE_TW[size]]}>
            Sold out
          </Text>
        </>
      </Button>
    );
  } else if (isExpired) {
    return (
      <Button {...buttonProps} disabled>
        <>
          <Hourglass color="white" width={16} height={16} />
          <Text tw={["ml-1 font-semibold text-white", LABEL_SIZE_TW[size]]}>
            Time out
          </Text>
        </>
      </Button>
    );
  } else if (isProgress) {
    return (
      <Button {...buttonProps} disabled>
        <Text tw={["font-semibold", LABEL_SIZE_TW[size]]}>
          Collecting
          <ThreeDotsAnimation color={isDark ? colors.black : colors.white} />
        </Text>
      </Button>
    );
  } else if (edition?.gating_type === "spotify_save") {
    return (
      <Button {...buttonProps} onPress={handleClaimNFT}>
        <>
          <Spotify
            color={isDark ? colors.black : colors.white}
            width={20}
            height={20}
          />
          <Text
            tw={["ml-1 font-semibold", LABEL_SIZE_TW[size]]}
            style={{ color: isDark ? colors.black : colors.white }}
          >
            {isAuthenticated ? "Save to Collect" : "Save on Spotify"}
          </Text>
        </>
      </Button>
    );
  } else if (edition?.gating_type === "multi_provider_music_presave") {
    return (
      <View tw="w-full flex-row">
        {edition.creator_apple_music_id ? (
          <Button
            {...buttonProps}
            onPress={handleClaimNFT}
            tw="grow flex-row items-center justify-center bg-black dark:bg-white"
            disabled={isAppleMusicCollectLoading}
          >
            <View tw="mt-[2px]">
              <PreAddAppleMusic
                height={preAddIconheight}
                width={(preAddIconheight * 125) / 27}
                color={isDark ? "black" : "white"}
              />
            </View>
          </Button>
        ) : null}

        {edition.creator_spotify_id ? (
          <>
            <View tw="w-2" />
            <Button
              {...buttonProps}
              onPress={handleClaimNFT}
              tw="grow flex-row justify-center"
              disabled={isSpotifyCollectLoading}
            >
              <Spotify
                color={isDark ? colors.black : colors.white}
                width={preAddIconheight}
                height={preAddIconheight}
              />
              <Text
                tw={["ml-1 font-semibold", LABEL_SIZE_TW[size]]}
                style={{
                  fontSize: 12,
                  color: isDark ? colors.black : colors.white,
                }}
              >
                {isSpotifyCollectLoading ? "Loading..." : "Pre-Save on Spotify"}
              </Text>
            </Button>
          </>
        ) : null}
      </View>
    );
  } else if (edition?.gating_type === "multi_provider_music_save") {
    return (
      <View tw="w-full flex-row">
        {edition?.apple_music_track_url ? (
          <Button
            {...buttonProps}
            onPress={handleClaimNFT}
            tw="grow flex-row items-center justify-center bg-black dark:bg-white"
            disabled={isAppleMusicCollectLoading}
          >
            <View tw="mt-[2px]">
              <PreAddAppleMusic
                height={preAddIconheight}
                width={(preAddIconheight * 125) / 27}
                color={isDark ? "black" : "white"}
              />
            </View>
          </Button>
        ) : null}

        {edition?.spotify_track_url ? (
          <>
            <View tw="w-2" />
            <Button
              {...buttonProps}
              onPress={handleClaimNFT}
              tw="grow flex-row justify-center"
              disabled={isSpotifyCollectLoading}
            >
              <Spotify
                color={isDark ? colors.black : colors.white}
                width={preAddIconheight}
                height={preAddIconheight}
              />
              <Text
                tw={["ml-1 font-semibold", LABEL_SIZE_TW[size]]}
                style={{
                  fontSize: 12,
                  color: isDark ? colors.black : colors.white,
                }}
              >
                {isSpotifyCollectLoading ? "Loading..." : "Save on Spotify"}
              </Text>
            </Button>
          </>
        ) : null}
      </View>
    );
  } else if (
    edition?.gating_type === "music_presave" ||
    edition?.gating_type === "spotify_presave"
  ) {
    return (
      <Button {...buttonProps} onPress={handleClaimNFT}>
        <>
          <Spotify
            color={isDark ? colors.black : colors.white}
            width={20}
            height={20}
          />
          <Text
            tw={["ml-1 font-semibold", LABEL_SIZE_TW[size]]}
            style={{ color: isDark ? colors.black : colors.white }}
          >
            {isAuthenticated ? "Pre-Save to Collect" : "Pre-Save on Spotify"}
          </Text>
        </>
      </Button>
    );
  }
  if (isPaidGated) {
    return (
      <ClaimPaidNFTButton
        edition={edition}
        size={size}
        theme={theme}
        style={style}
        tw={tw}
        {...rest}
      />
    );
  }

  return (
    <Button {...buttonProps} onPress={handleClaimNFT}>
      Collect
    </Button>
  );
};
