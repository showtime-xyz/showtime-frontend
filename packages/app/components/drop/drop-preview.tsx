import React, { memo, useCallback, forwardRef } from "react";
import {
  GestureResponderEvent,
  Linking,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { toggleColorScheme } from "@showtime-xyz/universal.color-scheme";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ListenOnAppleMusic, SpotifyPure } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Preview } from "app/components/preview";
import { useUser } from "app/hooks/use-user";
import { useFocusEffect } from "app/lib/react-navigation/native";
import { useMuted } from "app/providers/mute-provider";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { VerificationBadge } from "design-system";
import { breakpoints } from "design-system/theme";

export type DropPreviewProps = {
  file: any;
  title: string;
  description: string;
  onPressCTA?: () => void;
  spotifyUrl?: string | null;
  appleMusicTrackUrl?: string | null;
  releaseDate?: string;
  ctaCopy?: string;
  tw?: string;
  buttonProps?: ButtonProps;
  preivewComponent?: ({
    size,
  }: {
    size: number;
  }) => React.ReactNode | JSX.Element;
  isPaidNFT?: boolean;
};

export const DropPreviewComponent = forwardRef<typeof View, DropPreviewProps>(
  function DropPreview(
    {
      file,
      title,
      description,
      onPressCTA,
      spotifyUrl,
      appleMusicTrackUrl,
      releaseDate,
      ctaCopy,
      tw = "",
      buttonProps,
      preivewComponent,
      isPaidNFT,
    },
    ref
  ) {
    const { user: userProfile } = useUser();
    const [muted] = useMuted();
    const { width } = useWindowDimensions();
    const isSmWidth = width >= breakpoints["sm"];

    const isDark = useIsDarkMode();
    useFocusEffect(
      useCallback(() => {
        // The reason for adding setTimeout is that the profile screen has a useFocusEffect hook, which will be affected by this hook.
        setTimeout(() => {
          toggleColorScheme(true);
        }, 100);
        return () => {
          toggleColorScheme(isDark);
        };
      }, [isDark])
    );
    const onPressSpotify = useCallback(
      (e: GestureResponderEvent) => {
        if (Platform.OS === "web") {
          e.preventDefault();
        }
        if (releaseDate) {
          return;
        }
        if (spotifyUrl) {
          Linking.openURL(spotifyUrl);
        }
      },
      [releaseDate, spotifyUrl]
    );
    const renderButtons = useCallback(() => {
      return onPressCTA ? (
        <Button
          variant="tertiary"
          size="regular"
          onPress={onPressCTA}
          {...buttonProps}
          tw="mt-4"
        >
          {ctaCopy}
        </Button>
      ) : null;
    }, [onPressCTA, buttonProps, ctaCopy]);

    const size = isSmWidth ? 300 : width - 32;

    return (
      <View
        tw={["animate-fade-in-250 items-center", tw]}
        collapsable={false}
        ref={ref}
      >
        <View tw="shadow-light dark:shadow-dark ios:border android:borderoverflow-hidden overflow-hidden rounded-3xl border-gray-100 bg-white pb-8 shadow-md">
          <View>
            {preivewComponent ? (
              preivewComponent({ size })
            ) : (
              <Preview
                file={file}
                width={size}
                height={size}
                isMuted={muted}
                showMuteButton
                isLooping
                style={{
                  width: size,
                  height: size,
                }}
              />
            )}
            <View tw="z-9 absolute bottom-2.5 left-2.5 flex-row">
              {(Boolean(spotifyUrl) || Boolean(releaseDate)) && (
                <Pressable onPress={onPressSpotify} tw="py-0.5 pl-0.5">
                  <View
                    tw="rounded bg-black/60"
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View tw="flex-row items-center">
                    <SpotifyPure color="white" width={18} height={18} />
                    <Text tw="px-1 text-xs font-medium text-white">
                      {releaseDate
                        ? `Available on ${new Date(releaseDate).toLocaleString(
                            "default",
                            {
                              month: "long",
                            }
                          )} ${new Date(releaseDate).getDate()}`
                        : spotifyUrl
                        ? "Play on Spotify"
                        : ""}
                    </Text>
                  </View>
                </Pressable>
              )}
              {Boolean(appleMusicTrackUrl) && (
                <Pressable
                  onPress={(e) => {
                    if (Platform.OS === "web") {
                      e.preventDefault();
                    }
                    if (appleMusicTrackUrl) {
                      Linking.openURL(appleMusicTrackUrl);
                    }
                  }}
                  tw="ml-1 px-1 pt-0.5"
                >
                  <View
                    tw="rounded bg-black/60"
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View tw="h-full flex-row items-center justify-center">
                    <ListenOnAppleMusic
                      height={20}
                      width={20 * (125 / 27)}
                      color="white"
                    />
                  </View>
                </Pressable>
              )}
            </View>
          </View>
          <View tw="px-4">
            <View tw="flex-row pb-1.5 pt-2.5">
              <View tw="rounded-full border border-gray-200">
                <Avatar alt="Avatar" url={userProfile?.data.profile.img_url} />
              </View>
              <View tw="ml-2 justify-center">
                <View>
                  <View tw="flex flex-row items-center">
                    <Text tw="text-13 flex font-semibold text-gray-900">
                      {getCreatorUsernameFromNFT({
                        creator_address:
                          userProfile?.data.profile.primary_wallet?.address,
                        creator_name: userProfile?.data.profile.name,
                        creator_username: userProfile?.data.profile.username,
                      })}
                    </Text>

                    {userProfile?.data.profile.verified ? (
                      <VerificationBadge
                        theme={isPaidNFT ? "light" : undefined}
                        style={{ marginLeft: 4 }}
                        size={12}
                      />
                    ) : null}
                  </View>
                  <View tw="h-2" />
                  <Text tw="text-xs font-semibold text-gray-900">now</Text>
                </View>
              </View>
            </View>
            <Text tw="text-sm font-medium text-gray-900" numberOfLines={3}>
              {title}
            </Text>
            <Text tw="pt-2 text-sm text-gray-900 ">{description}</Text>
            {renderButtons()}
          </View>
        </View>
      </View>
    );
  }
);
export const DropPreview = memo(DropPreviewComponent);
