import { StyleSheet } from "react-native";

import {
  Globe,
  Lock,
  SpotifyPure,
  RaffleHorizontal,
  Music,
  MusicBadge,
  RaffleBadge,
} from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { TextTooltip } from "app/components/text-tooltip";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

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
    icon: SpotifyPure,
    text: "Save on Spotify to collect",
    typeName: "Music",
  },
  multi: {
    icon: Lock,
    text: "Enter password & location to collect",
    typeName: "Password & Location",
  },
  spotify_presave: {
    icon: SpotifyPure,
    text: "Pre-Save to collect",
    typeName: "Pre-Save",
  },
  multi_provider_music_save: {
    icon: SpotifyPure,
    text: "Save on Spotify or Apple Music to collect",
    typeName: "Music",
  },
  music_presave: {
    icon: SpotifyPure,
    text: "Pre-Save to collect",
    typeName: "Pre-Save",
  },
  multi_provider_music_presave: {
    icon: SpotifyPure,
    text: "Pre-Save to collect",
    typeName: "Pre-Save",
  },
};

export const ContentType = ({ edition, ...rest }: ContentTypeTooltipProps) => {
  // This will be removed after the airdrop
  if (
    edition?.spinamp_track_url ||
    edition?.gating_type === "multi_provider_music_presave" ||
    edition?.gating_type === "multi_provider_music_save" ||
    edition?.gating_type === "spotify_presave" ||
    edition?.gating_type === "music_presave" ||
    edition?.gating_type === "spotify_save"
  ) {
    return (
      <TextTooltip
        side="bottom"
        triggerElement={
          <View tw="h-[18px] w-8 items-center justify-center rounded-full bg-black/60">
            <MusicBadge color="#fff" width={10} height={13} />
          </View>
        }
        text={contentGatingType[edition?.gating_type].text}
        {...rest}
      />
    );
  }

  if (!edition?.raffles) {
    return (
      <TextTooltip
        side="bottom"
        triggerElement={
          <View tw="h-[18px] w-8 items-center justify-center rounded-full bg-black/60">
            <RaffleBadge width={15} height={10} />
          </View>
        }
        text="Raffle Drop"
        {...rest}
      />
    );
  }

  return null;
};
