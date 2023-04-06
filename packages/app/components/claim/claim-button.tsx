import { useContext, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { formatDistanceToNowStrict } from "date-fns";

import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Check, Hourglass } from "@showtime-xyz/universal.icon";
import { Spotify } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { ClaimContext } from "app/context/claim-context";
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
  color?: string;
};

export enum ClaimStatus {
  Soldout,
  Claimed,
  Expired,
  Normal,
}
export const getClaimStatus = (edition: CreatorEditionResponse) => {
  if (!edition) return undefined;
  if (
    edition.total_claimed_count ===
    edition.creator_airdrop_edition?.edition_size
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
  color,
  ...rest
}: ClaimButtonProps) => {
  const isDark = useIsDarkMode();
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
  const { claimSpotifyGatedDrop } = useSpotifyGatedClaim(
    edition.creator_airdrop_edition
  );
  const { isAuthenticated, user } = useUser();
  const isSelf =
    user?.data?.profile.profile_id ===
    edition.creator_airdrop_edition?.owner_profile_id;
  const isRaffleDrop = edition?.raffles && edition.raffles?.length > 0;

  const raffleConcludedAt = useMemo(() => {
    if (!isSelf || !isRaffleDrop) return null;
    if (
      edition.gating_type === "music_presave" &&
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

  const onClaimPress = () => {
    if (isCanViewRaffleResult) {
      redirectToRaffleResult(edition.creator_airdrop_edition.contract_address);
      return;
    }
    if (
      claimStates.status === "loading" &&
      claimStates.signaturePrompt === false
    ) {
      toast("Please wait for the previous collect to complete.");
      return;
    }
    dispatch({ type: "initial" });
    if (
      (edition.gating_type === "music_presave" ||
        edition.gating_type === "spotify_save") &&
      !isAuthenticated
    ) {
      Analytics.track(EVENTS.SPOTIFY_SAVE_PRESSED_BEFORE_LOGIN);
      claimSpotifyGatedDrop();
    } else {
      redirectToClaimDrop(edition.creator_airdrop_edition.contract_address);
    }
  };

  let isExpired = false;
  if (typeof edition?.time_limit === "string") {
    isExpired = new Date() > new Date(edition.time_limit);
  }

  const status = getClaimStatus(edition);

  const bgIsGreen =
    status === ClaimStatus.Claimed || status === ClaimStatus.Soldout;

  const disabled = isCanViewRaffleResult
    ? false
    : status === ClaimStatus.Claimed ||
      status === ClaimStatus.Soldout ||
      isExpired ||
      isProgress;

  const content = useMemo(() => {
    if (isCanViewRaffleResult) {
      return (
        <Text tw="text-sm font-semibold text-white">Announce your raffle</Text>
      );
    }
    if (raffleConcludedAt) {
      return (
        <Text tw="text-center text-sm font-semibold text-white">
          Your raffle ends {`${raffleConcludedAt}`}
        </Text>
      );
    }

    if (status === ClaimStatus.Claimed) {
      return (
        <>
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 text-sm font-semibold text-white">Collected</Text>
        </>
      );
    } else if (status === ClaimStatus.Soldout) {
      return (
        <>
          <Check color="white" width={20} height={20} />
          <Text tw="ml-1 text-sm font-semibold text-white">Sold out</Text>
        </>
      );
    } else if (status === ClaimStatus.Expired) {
      return (
        <>
          <Hourglass color="white" width={16} height={16} />
          <Text tw="ml-1 text-sm font-semibold text-white">Time out</Text>
        </>
      );
    } else if (isProgress) {
      return (
        <Text tw="text-sm font-bold">
          Collecting
          <ThreeDotsAnimation
            color={color ?? isDark ? colors.black : colors.white}
          />
        </Text>
      );
    } else if (edition?.gating_type === "spotify_save") {
      return (
        <>
          <Spotify
            color={color ?? isDark ? colors.black : colors.white}
            width={20}
            height={20}
          />
          <Text
            tw="ml-1 text-sm font-semibold text-white dark:text-black"
            style={{ color }}
          >
            {isAuthenticated ? "Save to Collect" : "Save on Spotify"}
          </Text>
        </>
      );
    } else if (edition?.gating_type === "music_presave") {
      return (
        <>
          <Spotify
            color={color ?? isDark ? colors.black : colors.white}
            width={20}
            height={20}
          />
          <Text
            tw="ml-1 text-sm font-semibold text-white dark:text-black"
            style={{ color, lineHeight: 20 }}
          >
            {isAuthenticated ? "Pre-Save to Collect" : "Pre-Save on Spotify"}
          </Text>
        </>
      );
    }

    return "Collect";
  }, [
    color,
    edition?.gating_type,
    isAuthenticated,
    isCanViewRaffleResult,
    isDark,
    isProgress,
    raffleConcludedAt,
    status,
  ]);

  const opacityTw = useMemo(() => {
    if (isProgress) {
      return "opacity-50";
    }
    if (isExpired && !bgIsGreen) {
      return "opacity-100";
    }
    return "";
  }, [bgIsGreen, isExpired, isProgress]);

  const backgroundColor = useMemo(() => {
    if (bgIsGreen) {
      return { backgroundColor: "#0CB504" };
    }
    if (isExpired && !bgIsGreen) {
      return { backgroundColor: colors.gray[500] };
    }
    return {};
  }, [bgIsGreen, isExpired]);

  return (
    <Button
      onPress={onClaimPress}
      disabled={disabled}
      style={[backgroundColor, style]}
      size={size}
      tw={[opacityTw, tw]}
      {...rest}
    >
      {content}
    </Button>
  );
};
