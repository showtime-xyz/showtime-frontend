import { StyleSheet } from "react-native";

import {
  AppleMusic,
  SpotifyPure,
  LockBadge,
} from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { PlayOnAppleMusic } from "../play-on-apple-music";
import { PlayOnSpotify } from "../play-on-spotify";
import { PlayOnSpinamp } from "../spinamp/play-on-spinamp";
import { contentGatingType } from "./content-gating-type";
import { TextTooltip } from "./text-tooltip";

type ContentTypeTooltipProps = {
  edition: CreatorEditionResponse | undefined;
  theme?: "dark" | "light";
};

export const ContentTypeTooltip = ({
  edition,
  ...rest
}: ContentTypeTooltipProps) => {
  if (!edition) return null;
  // This will be removed after the airdrop
  if (edition?.spinamp_track_url) {
    return <PlayOnSpinamp url={edition?.spinamp_track_url} />;
  }

  if (edition?.gating_type === "multi_provider_music_presave") {
    // Show play button if it's released and has track urls
    if (
      edition?.presave_release_date &&
      new Date() >= new Date(edition?.presave_release_date)
    ) {
      if (edition?.apple_music_track_url && edition?.spotify_track_url) {
        return (
          <View tw="flex-row" style={{ columnGap: 4 }}>
            <PlayOnSpotify edition={edition} />
            <PlayOnAppleMusic edition={edition} />
          </View>
        );
      } else if (edition?.apple_music_track_url) {
        return <PlayOnAppleMusic edition={edition} />;
      } else if (edition?.spotify_track_url) {
        return <PlayOnSpotify edition={edition} />;
      }
    }
    // Show available on tooltip if not released yet
    else {
      return (
        <TextTooltip
          side="bottom"
          triggerElement={
            <>
              <View
                tw="rounded bg-black/60"
                style={StyleSheet.absoluteFillObject}
              />
              <View tw="flex-row items-center py-0.5 pl-0.5">
                {edition.creator_apple_music_id ? (
                  <>
                    <AppleMusic height={18} width={18} color={"white"} />
                    <View tw="w-1" />
                  </>
                ) : null}
                {edition.creator_spotify_id ? (
                  <SpotifyPure height={18} width={18} color={"white"} />
                ) : null}
                {edition.presave_release_date ? (
                  <Text tw="mx-1 text-xs font-medium text-white">
                    Available on{" "}
                    {new Date(edition.presave_release_date).toLocaleString(
                      "default",
                      { month: "long" }
                    ) +
                      " " +
                      new Date(edition.presave_release_date).getDate()}
                  </Text>
                ) : (
                  <View tw="w-0.5" />
                )}
              </View>
            </>
          }
          text={contentGatingType[edition?.gating_type].text}
          {...rest}
        />
      );
    }
  }

  // Show play button if it's save drop and has track urls
  if (edition?.gating_type === "multi_provider_music_save") {
    if (edition?.apple_music_track_url && edition?.spotify_track_url) {
      return (
        <View tw="flex-row" style={{ columnGap: 4 }}>
          <PlayOnSpotify edition={edition} />
          <PlayOnAppleMusic edition={edition} />
        </View>
      );
    } else if (edition?.apple_music_track_url) {
      return <PlayOnAppleMusic edition={edition} />;
    } else if (edition?.spotify_track_url) {
      return <PlayOnSpotify edition={edition} />;
    }
  }

  if (
    (edition?.gating_type === "spotify_presave" ||
      edition?.gating_type === "music_presave") &&
    edition?.spotify_track_url &&
    edition?.presave_release_date &&
    new Date() >= new Date(edition?.presave_release_date)
  ) {
    return <PlayOnSpotify edition={edition} />;
  }

  if (edition?.gating_type === "spotify_save" && edition?.spotify_track_url) {
    return <PlayOnSpotify edition={edition} />;
  }
  if (edition?.gating_type === "paid_nft") {
    return (
      <TextTooltip
        side="bottom"
        triggerElement={
          <>
            <View
              tw="rounded bg-black/60"
              style={StyleSheet.absoluteFillObject}
            />
            <View tw="flex-row items-center py-0.5 pl-0.5">
              <LockBadge color="#FFD554" width={18} height={18} />
              <Text tw="mx-1 text-xs font-medium text-[#FFD554]">
                Collect to unlock channel
              </Text>
            </View>
          </>
        }
        text={contentGatingType[edition?.gating_type].text}
        {...rest}
      />
    );
  }
  if (edition?.gating_type && contentGatingType[edition?.gating_type]) {
    const Icon = contentGatingType[edition?.gating_type]
      ? contentGatingType[edition?.gating_type].icon
      : null;

    return (
      <TextTooltip
        side="bottom"
        triggerElement={
          <>
            <View
              tw="rounded bg-black/60"
              style={StyleSheet.absoluteFillObject}
            />
            <View tw="flex-row items-center py-0.5 pl-0.5">
              {Icon ? <Icon color="white" width={18} height={18} /> : null}
              {edition.presave_release_date ? (
                <Text tw="mx-1 text-xs font-medium text-white">
                  Available on{" "}
                  {new Date(edition.presave_release_date).toLocaleString(
                    "default",
                    { month: "long" }
                  ) +
                    " " +
                    new Date(edition.presave_release_date).getDate()}
                </Text>
              ) : (
                <View tw="w-0.5" />
              )}
            </View>
          </>
        }
        text={contentGatingType[edition?.gating_type].text}
        {...rest}
      />
    );
  }
};

export const ContentTypeIcon = ({ edition }: ContentTypeTooltipProps) => {
  if (edition?.gating_type && contentGatingType[edition?.gating_type]) {
    const Icon = contentGatingType[edition?.gating_type]?.icon;
    return (
      <View>
        <View
          tw="rounded-sm bg-black/60"
          style={StyleSheet.absoluteFillObject}
        />
        <View tw="z-10">
          <Icon color="#fff" width={20} height={20} />
        </View>
      </View>
    );
  }
  return null;
};
