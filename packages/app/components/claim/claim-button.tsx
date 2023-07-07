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
} from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ClaimContext } from "app/context/claim-context";
import { useAppleMusicGatedClaim } from "app/hooks/use-apple-music-gated-claim";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useRedirectToRaffleResult } from "app/hooks/use-redirect-to-raffle-result";
import { useSpotifyGatedClaim } from "app/hooks/use-spotify-gated-claim";
import { useUser } from "app/hooks/use-user";
import { Analytics, EVENTS } from "app/lib/analytics";

import { ThreeDotsAnimation } from "design-system/three-dots";
import { toast } from "design-system/toast";

type ClaimButtonProps = ButtonProps & {
  edition: CreatorEditionResponse;
  tw?: string;
  style?: StyleProp<ViewStyle>;
};

export enum ClaimStatus {
  Soldout,
  Claimed,
  Expired,
  Normal,
}
export const getClaimStatus = (edition?: CreatorEditionResponse) => {
  if (!edition) return undefined;
  if (
    edition.creator_airdrop_edition?.edition_size !== 0 &&
    edition.total_claimed_count >= edition.creator_airdrop_edition?.edition_size
  )
    return ClaimStatus.Soldout;

  if (edition.is_already_claimed) return ClaimStatus.Claimed;

  return typeof edition?.time_limit === "string" &&
    new Date() > new Date(edition.time_limit)
    ? ClaimStatus.Expired
    : ClaimStatus.Normal;
};

export const ClaimButton = ({
  edition,
  size = "small",
  tw = "",
  style,
  theme,
  ...rest
}: ClaimButtonProps) => {
  const isDarkMode = useIsDarkMode();
  const isDark = theme === "dark" || (theme === "light" ? false : isDarkMode);
  const { claimAppleMusicGatedDrop, isMutating: isAppleMusicCollectLoading } =
    useAppleMusicGatedClaim(edition.creator_airdrop_edition);
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const redirectToRaffleResult = useRedirectToRaffleResult();
  const {
    state: claimStates,
    dispatch,
    contractAddress,
  } = useContext(ClaimContext);
  const isProgress =
    claimStates.status === "loading" &&
    claimStates.signaturePrompt === false &&
    contractAddress === edition.creator_airdrop_edition.contract_address;
  const { claimSpotifyGatedDrop, isMutating: isSpotifyCollectLoading } =
    useSpotifyGatedClaim(edition.creator_airdrop_edition);
  const { isAuthenticated, user } = useUser();
  const isSelf =
    user?.data?.profile.profile_id ===
    edition.creator_airdrop_edition?.owner_profile_id;
  const isRaffleDrop = edition?.raffles && edition.raffles?.length > 0;

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

  const handleRaffleResultPress = () => {
    redirectToRaffleResult(edition.creator_airdrop_edition.contract_address);
  };

  const handleCollectPress = (type: "free" | "appleMusic" | "spotify") => {
    if (
      claimStates.status === "loading" &&
      claimStates.signaturePrompt === false
    ) {
      toast("Please wait for the previous collect to complete.");
      return;
    }
    dispatch({ type: "initial" });

    if (
      (edition.gating_type === "spotify_presave" ||
        edition.gating_type === "spotify_save" ||
        edition?.gating_type === "music_presave" ||
        edition.gating_type === "multi_provider_music_save" ||
        edition.gating_type === "multi_provider_music_presave") &&
      !isAuthenticated
    ) {
      if (type === "spotify") {
        Analytics.track(EVENTS.SPOTIFY_SAVE_PRESSED_BEFORE_LOGIN);
        claimSpotifyGatedDrop({});
      } else if (type === "appleMusic") {
        Analytics.track(EVENTS.APPLE_MUSIC_SAVE_PRESSED_BEFORE_LOGIN);
        claimAppleMusicGatedDrop({});
      }
    } else {
      redirectToClaimDrop(
        edition.creator_airdrop_edition.contract_address,
        type
      );
    }
  };

  const status = getClaimStatus(edition);

  const bgIsGreen =
    status === ClaimStatus.Claimed || status === ClaimStatus.Soldout;

  const buttonProps = {
    style: [
      bgIsGreen
        ? { backgroundColor: colors.green[600] }
        : status === ClaimStatus.Expired && !bgIsGreen
        ? { backgroundColor: colors.gray[500] }
        : {},
      style,
    ],
    size,
    tw: [
      isProgress
        ? "opacity-50"
        : status === ClaimStatus.Expired && !bgIsGreen
        ? "opacity-100"
        : "",
      tw,
    ],
    theme,
    ...rest,
  };

  const preAddIconheight = buttonProps.size === "small" ? 24 : 26;
  if (isCanViewRaffleResult) {
    return (
      <Button {...buttonProps} onPress={handleRaffleResultPress}>
        <>
          <Text tw="text-sm font-semibold text-white">
            Announce your raffle
          </Text>
        </>
      </Button>
    );
  } else if (raffleConcludedAt) {
    return (
      <Button {...buttonProps}>
        <>
          <Text tw="text-center text-sm font-semibold text-white">
            Your raffle ends {`${raffleConcludedAt}`}
          </Text>
        </>
      </Button>
    );
  } else if (status === ClaimStatus.Claimed) {
    return (
      <Button {...buttonProps} disabled>
        <>
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 text-sm font-semibold text-white">Collected</Text>
        </>
      </Button>
    );
  } else if (status === ClaimStatus.Soldout) {
    return (
      <Button {...buttonProps} disabled>
        <>
          <Check color="white" width={20} height={20} />
          <Text tw="ml-1 text-sm font-semibold text-white">Sold out</Text>
        </>
      </Button>
    );
  } else if (status === ClaimStatus.Expired) {
    return (
      <Button {...buttonProps} disabled>
        <>
          <Hourglass color="white" width={16} height={16} />
          <Text tw="ml-1 text-sm font-semibold text-white">Time out</Text>
        </>
      </Button>
    );
  } else if (isProgress) {
    return (
      <Button {...buttonProps} disabled>
        <Text tw="text-sm font-bold">
          Collecting
          <ThreeDotsAnimation color={isDark ? colors.black : colors.white} />
        </Text>
      </Button>
    );
  } else if (edition?.gating_type === "spotify_save") {
    return (
      <Button {...buttonProps} onPress={() => handleCollectPress("spotify")}>
        <>
          <Spotify
            color={isDark ? colors.black : colors.white}
            width={20}
            height={20}
          />
          <Text
            tw="ml-1 text-sm font-semibold"
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
            onPress={() => handleCollectPress("appleMusic")}
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
              onPress={() => handleCollectPress("spotify")}
              tw="grow flex-row justify-center"
              disabled={isSpotifyCollectLoading}
            >
              <Spotify
                color={isDark ? colors.black : colors.white}
                width={preAddIconheight}
                height={preAddIconheight}
              />
              <Text
                tw="ml-1 text-sm font-semibold"
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
            onPress={() => handleCollectPress("appleMusic")}
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
              onPress={() => handleCollectPress("spotify")}
              tw="grow flex-row justify-center"
              disabled={isSpotifyCollectLoading}
            >
              <Spotify
                color={isDark ? colors.black : colors.white}
                width={preAddIconheight}
                height={preAddIconheight}
              />
              <Text
                tw="ml-1 text-sm font-semibold"
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
      <Button {...buttonProps} onPress={() => handleCollectPress("spotify")}>
        <>
          <Spotify
            color={isDark ? colors.black : colors.white}
            width={20}
            height={20}
          />
          <Text
            tw="ml-1 text-sm font-semibold leading-5"
            style={{ color: isDark ? colors.black : colors.white }}
          >
            {isAuthenticated ? "Pre-Save to Collect" : "Pre-Save on Spotify"}
          </Text>
        </>
      </Button>
    );
  }

  return (
    <Button
      {...buttonProps}
      onPress={() => {
        handleCollectPress("free");
      }}
    >
      Collect
    </Button>
  );
};
