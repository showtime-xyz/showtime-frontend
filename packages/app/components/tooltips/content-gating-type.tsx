import {
  Globe,
  Lock,
  SpotifyPure,
  LockBadge,
} from "@showtime-xyz/universal.icon";

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
  paid_nft: {
    icon: LockBadge,
    text: "Collect to unlock channel",
    typeName: "Paid NFT",
  },
};
