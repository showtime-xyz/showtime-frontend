import { useState } from "react";
import { StyleSheet } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Globe, Spotify, Lock } from "@showtime-xyz/universal.icon";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { isMobileWeb } from "../utilities";
import { PlayOnSpotify } from "./play-on-spotify";
import { PlayOnSpinamp } from "./spinamp/play-on-spinamp";
import { TextTooltip } from "./text-tooltip";

type ContentTypeTooltipProps = {
  edition: CreatorEditionResponse | undefined;
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
  music_presave: {
    icon: Spotify,
    text: "Pre-Save to collect",
    typeName: "Pre-Save",
  },
};
const TriggerView = isMobileWeb() ? View : PressableHover;

export const ContentTypeTooltip = ({ edition }: ContentTypeTooltipProps) => {
  const isDark = useIsDarkMode();
  const [open, setOpen] = useState(false);
  // This will be removed after the airdrop
  if (edition?.spinamp_track_url) {
    return <PlayOnSpinamp url={edition?.spinamp_track_url} />;
  }

  if (
    edition?.gating_type === "music_presave" &&
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
        triggerElement={
          <>
            <View
              tw="rounded bg-black/60"
              style={StyleSheet.absoluteFillObject}
            />
            <View tw="z-10 flex-row items-center">
              <Icon color="white" width={20} height={20} />
              {edition.presave_release_date ? (
                <Text tw="px-1 text-xs font-semibold text-white">
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
        <View tw="rounded bg-black/60" style={StyleSheet.absoluteFillObject} />
        <Icon color="white" width={20} height={20} />
      </View>
    );
  }
  return null;
};
