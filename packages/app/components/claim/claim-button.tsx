import { useContext, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { formatDistanceToNowStrict } from "date-fns";

import { Button } from "@showtime-xyz/universal.button";
import { ButtonProps } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Spotify,
  AppleMusic,
  Check,
  Hourglass,
} from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { ClaimContext } from "app/context/claim-context";
import { useAppleMusicGatedClaim } from "app/hooks/use-apple-music-gated-claim";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import { useRedirectToClaimDrop } from "app/hooks/use-redirect-to-claim-drop";
import { useRedirectToRaffleResult } from "app/hooks/use-redirect-to-raffle-result";
import { useSpotifyGatedClaim } from "app/hooks/use-spotify-gated-claim";
import { useUser } from "app/hooks/use-user";
import { Analytics, EVENTS } from "app/lib/analytics";

import { View } from "design-system";
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
  theme,
  ...rest
}: ClaimButtonProps) => {
  const isDarkMode = useIsDarkMode();
  const isDark = theme === "dark" || (theme === "light" ? false : isDarkMode);
  const { claimAppleMusicGatedDrop } = useAppleMusicGatedClaim(
    edition.creator_airdrop_edition
  );
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

  const handleCollectPress = () => {
    if (isCanViewRaffleResult) {
      redirectToRaffleResult(edition.creator_airdrop_edition.contract_address);
      return;
    }
    console.log("efejfof");
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
        edition.gating_type === "spotify_save" ||
        edition.gating_type === "multi_provider_music_save") &&
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

  const disabled = isCanViewRaffleResult
    ? false
    : status === ClaimStatus.Claimed ||
      status === ClaimStatus.Soldout ||
      isExpired ||
      isProgress;

  const bgIsGreen =
    status === ClaimStatus.Claimed || status === ClaimStatus.Soldout;

  const buttonProps = {
    onPress: handleCollectPress,
    disabled,
    style: [
      bgIsGreen
        ? { backgroundColor: colors.green[600] }
        : isExpired && !bgIsGreen
        ? { backgroundColor: colors.gray[500] }
        : {},
      style,
    ],
    size,
    tw: [
      isProgress ? "opacity-50" : isExpired && !bgIsGreen ? "opacity-100" : "",
      tw,
    ],
    theme,
    ...rest,
  };

  if (isCanViewRaffleResult) {
    return (
      <Button {...buttonProps}>
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
      <Button {...buttonProps}>
        <>
          <Check color="white" width={18} height={18} />
          <Text tw="ml-1 text-sm font-semibold text-white">Collected</Text>
        </>
      </Button>
    );
  } else if (status === ClaimStatus.Soldout) {
    return (
      <Button {...buttonProps}>
        <>
          <Check color="white" width={20} height={20} />
          <Text tw="ml-1 text-sm font-semibold text-white">Sold out</Text>
        </>
      </Button>
    );
  } else if (status === ClaimStatus.Expired) {
    return (
      <Button {...buttonProps}>
        <>
          <Hourglass color="white" width={16} height={16} />
          <Text tw="ml-1 text-sm font-semibold text-white">Time out</Text>
        </>
      </Button>
    );
  } else if (isProgress) {
    return (
      <Button {...buttonProps}>
        <Text tw="text-sm font-bold">
          Collecting
          <ThreeDotsAnimation color={isDark ? colors.black : colors.white} />
        </Text>
      </Button>
    );
  } else if (edition?.gating_type === "spotify_save") {
    return (
      <Button {...buttonProps}>
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
  } else if (edition?.gating_type === "multi_provider_music_save") {
    return (
      <View tw="w-full flex-row">
        {edition?.apple_music_track_url ? (
          <Button
            {...buttonProps}
            onPress={() => claimAppleMusicGatedDrop({ closeModal: () => {} })}
            tw="flex-1 flex-row justify-center"
          >
            <AppleMusic width={20} height={20} />
            <Text
              tw="ml-1 text-sm font-semibold"
              style={{ color: isDark ? colors.black : colors.white }}
            >
              Apple Music
            </Text>
          </Button>
        ) : null}

        {edition?.spotify_track_url ? (
          <>
            <View tw="w-2" />
            <Button {...buttonProps} tw="flex-1 flex-row justify-center">
              <Spotify
                color={isDark ? colors.black : colors.white}
                width={20}
                height={20}
              />
              <Text
                tw="ml-1 text-sm font-semibold"
                style={{ color: isDark ? colors.black : colors.white }}
              >
                Spotify
              </Text>
            </Button>
          </>
        ) : null}
      </View>
    );
  } else if (edition?.gating_type === "music_presave") {
    return (
      <Button {...buttonProps}>
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

  return <Button {...buttonProps}>Collect</Button>;
};

// const AppleMusicSaveButton = ({
//   edition,
//   ...rest
// }: {
//   edition: CreatorEditionResponse;
// }) => {
//   const isDark = useIsDarkMode();

//   const { claimAppleMusicGatedDrop, isMutating } = useAppleMusicGatedClaim(
//     edition.creator_airdrop_edition
//   );

//   if (edition.apple_music_track_name) {
//     return (
//       <Button
//         {...rest}
//         onPress={() => claimAppleMusicGatedDrop({ closeModal: () => {} })}
//         disabled={isMutating}
//         size="regular"
//       >
//         <>
//           <AppleMusic width={20} height={20} />
//           <Text tw="ml-1 text-sm font-semibold text-white dark:text-black">
//             Apple Music
//           </Text>
//         </>
//       </Button>
//     );
//   }

//   return null;
// };
