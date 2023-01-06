import { useState } from "react";
import { Platform } from "react-native";

import * as Tooltip from "universal-tooltip/src";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { Globe, Spotify, Lock } from "design-system/icon";

import { isMobileWeb } from "../utilities";
import { PlayOnSpotify } from "./play-on-spotify";

type ContentTypeTooltipProps = {
  edition: CreatorEditionResponse | undefined;
};
const contentGatingType = {
  location: {
    icon: Globe,
    text: "Share location to collect",
  },
  password: {
    icon: Lock,
    text: "Enter password to collect",
  },
  spotify_save: {
    icon: Spotify,
    text: "Save on Spotify to collect",
  },
  multi: {
    icon: Lock,
    text: "Enter password & location to collect",
  },
};
const TriggerView = isMobileWeb() ? View : PressableHover;

export const ContentTypeTooltip = ({ edition }: ContentTypeTooltipProps) => {
  const isDark = useIsDarkMode();
  const [open, setOpen] = useState(false);
  if (edition?.spotify_track_url) {
    return <PlayOnSpotify url={edition?.spotify_track_url} />;
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
            tw="flex-row rounded bg-black/60"
          >
            <Icon color="white" width={20} height={20} />
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
          textSize={16}
          backgroundColor={isDark ? "#fff" : "#000"}
          fontWeight="bold"
          borderRadius={12}
          textColor={isDark ? "#000" : "#fff"}
          text={contentGatingType[edition?.gating_type].text}
        />
      </Tooltip.Root>
    );
  }

  return null;
};

export const ContentTypeIcon = ({ edition }: ContentTypeTooltipProps) => {
  if (edition?.gating_type && contentGatingType[edition?.gating_type]) {
    const Icon = contentGatingType[edition?.gating_type]?.icon;
    return (
      <View tw="flex-row rounded bg-black/60">
        <Icon color="white" width={20} height={20} />
      </View>
    );
  }
  return null;
};
