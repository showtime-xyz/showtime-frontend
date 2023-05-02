import React, { memo, useCallback } from "react";
import {
  GestureResponderEvent,
  Linking,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { Spotify } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Preview } from "app/components/preview";
import { useDropNFT } from "app/hooks/use-drop-nft";
import { useUser } from "app/hooks/use-user";
import { useMuted } from "app/providers/mute-provider";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { VerificationBadge } from "design-system";
import { breakpoints } from "design-system/theme";

import { PolygonScanButton } from "../polygon-scan-button";

export type DropPreviewProps = {
  file: any;
  title: string;
  description: string;
  onPressCTA: () => void;
  spotifyUrl?: string;
  releaseDate?: string;
  ctaCopy?: string;
  tw?: string;
  buttonProps?: ButtonProps;
  preivewComponent?: ({
    size,
  }: {
    size: number;
  }) => React.ReactNode | JSX.Element;
};

export const DropPreview = memo(function DropPreview({
  file,
  title,
  description,
  onPressCTA,
  spotifyUrl,
  releaseDate,
  ctaCopy,
  tw = "",
  buttonProps,
  preivewComponent,
}: DropPreviewProps) {
  const { user: userProfile } = useUser();
  const [muted] = useMuted();
  const { width } = useWindowDimensions();
  const isSmWidth = width >= breakpoints["sm"];
  const { state } = useDropNFT();
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
    if (state.status === "loading" && state.transactionHash) {
      return <PolygonScanButton transactionHash={state.transactionHash} />;
    }
    return (
      <Button
        variant="tertiary"
        size="regular"
        disabled={state.status === "loading"}
        tw={state.status === "loading" ? "opacity-60" : ""}
        onPress={onPressCTA}
        {...buttonProps}
      >
        {ctaCopy}
      </Button>
    );
  }, [state.status, state.transactionHash, onPressCTA, buttonProps, ctaCopy]);
  const size = isSmWidth ? 300 : width - 32;

  return (
    <View tw={["animate-fade-in-250 items-center px-4", tw]}>
      <View tw="shadow-light dark:shadow-dark ios:border android:border web:py-8 ios:pb-4 android:pb-4 overflow-hidden rounded-3xl border-gray-100 dark:border-gray-900 sm:w-[300px]">
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
          {(Boolean(spotifyUrl) || Boolean(releaseDate)) && (
            <Pressable
              onPress={onPressSpotify}
              tw="z-9 absolute bottom-2.5 left-2.5"
            >
              <View
                tw="rounded bg-black/60"
                style={StyleSheet.absoluteFillObject}
              />
              <View tw="flex-row items-center">
                <Spotify color="white" width={20} height={20} />
                <Text tw="px-1 text-xs font-semibold text-white">
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
        </View>
        <View tw="px-4">
          <View tw="flex-row py-4">
            <View tw="rounded-full border border-gray-200 dark:border-gray-700">
              <Avatar alt="Avatar" url={userProfile?.data.profile.img_url} />
            </View>
            <View tw="ml-2 justify-center">
              <View>
                <View tw="flex flex-row items-center">
                  <Text tw="text-13 flex font-semibold text-gray-900 dark:text-white">
                    {getCreatorUsernameFromNFT({
                      creator_address:
                        userProfile?.data.profile.primary_wallet?.address,
                      creator_name: userProfile?.data.profile.name,
                      creator_username: userProfile?.data.profile.username,
                    })}
                  </Text>

                  {userProfile?.data.profile.verified ? (
                    <VerificationBadge style={{ marginLeft: 4 }} size={12} />
                  ) : null}
                </View>
                <View tw="h-2" />
                <Text tw="text-xs font-semibold text-gray-900 dark:text-white">
                  now
                </Text>
              </View>
            </View>
          </View>
          <Text tw="text-lg dark:text-white" numberOfLines={3}>
            {title}
          </Text>
          <Text tw="pt-2 text-xs text-gray-600 dark:text-gray-200 ">
            {description}
          </Text>
          <View tw="h-4" />
          {renderButtons()}
        </View>
      </View>
    </View>
  );
});
