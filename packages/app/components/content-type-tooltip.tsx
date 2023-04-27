import { StyleSheet } from "react-native";

import { Globe, Spotify, Lock } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { PlayOnAppleMusic } from "./play-on-apple-music";
import { PlayOnSpotify } from "./play-on-spotify";
import { PlayOnSpinamp } from "./spinamp/play-on-spinamp";
import { TextTooltip } from "./text-tooltip";

type ContentTypeTooltipProps = {
  edition: CreatorEditionResponse | undefined;
  theme?: "dark" | "light";
};
export const contentGatingType = {
  location: {
    icon: Globe,
    text: "Share location to collect",
    typeName: "Location",
  },
  password: {
    icon: Lock,
    text: "Enter password to collect",
    typeName: "Password",
  },
  spotify_save: {
    icon: Spotify,
    text: "Save on Spotify to collect",
    typeName: "Music",
  },
  multi: {
    icon: Lock,
    text: "Enter password & location to collect",
    typeName: "Password & Location",
  },
  spotify_presave: {
    icon: Spotify,
    text: "Pre-Save to collect",
    typeName: "Pre-Save",
  },
  music_presave: {
    icon: Spotify,
    text: "Pre-Save to collect",
    typeName: "Pre-Save",
  },
};

export const ContentTypeTooltip = ({
  edition,
  ...rest
}: ContentTypeTooltipProps) => {
  // This will be removed after the airdrop
  if (edition?.spinamp_track_url) {
    return <PlayOnSpinamp url={edition?.spinamp_track_url} />;
  }

  if (edition?.apple_music_track_url && edition?.spotify_track_url) {
    return (
      <View tw="flex-row gap-1">
        <PlayOnSpotify edition={edition} />
        <PlayOnAppleMusic edition={edition} />
      </View>
    );
  }

  if (edition?.apple_music_track_url) {
    return <PlayOnAppleMusic edition={edition} />;
  }

  if (edition?.spotify_track_url) {
    return <PlayOnSpotify edition={edition} />;
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

  if (edition?.gating_type && contentGatingType[edition?.gating_type]) {
    const Icon = contentGatingType[edition?.gating_type].icon;
    return (
      <TextTooltip
        side="bottom"
        triggerElement={
          <>
            <View
              tw="rounded-sm bg-black/60"
              style={StyleSheet.absoluteFillObject}
            />
            <View tw="flex-row items-center py-0.5 pl-0.5">
              {/* @ts-expect-error className not supported */}
              <Icon color="white" width={20} height={20} className="z-10" />
              {edition.presave_release_date ? (
                <Text tw="px-1 text-xs font-medium text-white">
                  Available on{" "}
                  {new Date(edition.presave_release_date).toLocaleString(
                    "default",
                    { month: "long" }
                  ) +
                    " " +
                    new Date(edition.presave_release_date).getDate()}
                </Text>
              ) : null}
            </View>
          </>
        }
        text={contentGatingType[edition?.gating_type].text}
        {...rest}
      />
    );
  }

  return null;
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
