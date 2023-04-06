import { useState } from "react";
import { Platform, StyleSheet } from "react-native";

import * as Tooltip from "universal-tooltip";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Globe, Spotify, Lock } from "@showtime-xyz/universal.icon";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { isMobileWeb } from "../utilities";
import { PlayOnSpotify } from "./play-on-spotify";
import { PlayOnSpinamp } from "./spinamp/play-on-spinamp";

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
      <Tooltip.Root
        onDismiss={() => {
          setOpen(false);
        }}
        // on web: I want to be triggered automatically with the mouse.
        {...Platform.select({
          web: {},
          default: {
            open,
            onDismiss: () => {
              setOpen(false);
            },
          },
        })}
        delayDuration={100}
      >
        <Tooltip.Trigger>
          <TriggerView
            {...Platform.select({
              web: {},
              default: {
                open,
                onPress: () => {
                  setOpen(true);
                },
              },
            })}
          >
            <View
              tw="rounded bg-black/60"
              style={StyleSheet.absoluteFillObject}
            />
            <View tw="flex-row items-center">
              <Icon color="white" width={20} height={20} className="z-10" />
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
          </TriggerView>
        </Tooltip.Trigger>
        <Tooltip.Content
          sideOffset={3}
          containerStyle={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
          className="web:outline-none"
          side="right"
          presetAnimation="fadeIn"
          backgroundColor={isDark ? "#fff" : "#000"}
          borderRadius={16}
        >
          <Tooltip.Text
            textSize={16}
            fontWeight="bold"
            textColor={isDark ? "#000" : "#fff"}
            text={contentGatingType[edition?.gating_type].text}
          />
        </Tooltip.Content>
      </Tooltip.Root>
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
