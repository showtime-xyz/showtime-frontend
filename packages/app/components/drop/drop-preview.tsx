import React, { memo, useCallback } from "react";
import {
  GestureResponderEvent,
  Linking,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Spotify } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Description } from "app/components/card/rows";
import { Preview } from "app/components/preview";
import { useDropNFT } from "app/hooks/use-drop-nft";
import { useUser } from "app/hooks/use-user";
import { useMuted } from "app/providers/mute-provider";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { VerificationBadge } from "design-system";
import { breakpoints } from "design-system/theme";
import { ThreeDotsAnimation } from "design-system/three-dots";

import { PolygonScanButton } from "../polygon-scan-button";

type DropPreviewProps = {
  file: any;
  title: string;
  description: string;
  onEdit: () => void;
  spotifyUrl?: string;
  releaseDate?: string;
};
const CreatingButton = () => {
  const isDark = useIsDarkMode();
  return (
    <Button variant="tertiary" size="regular">
      <Text tw="text-xs">
        Creating
        <ThreeDotsAnimation color={isDark ? colors.white : colors.black} />
      </Text>
    </Button>
  );
};
export const DropPreview = memo(function DropPreview({
  file,
  title,
  description,
  onEdit,
  spotifyUrl,
  releaseDate,
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
    if (state.status === "loading") {
      return state.transactionHash ? (
        <View tw="flex-row justify-between">
          <View tw="mr-4 flex-1">
            <CreatingButton />
          </View>
          <PolygonScanButton transactionHash={state.transactionHash} />
        </View>
      ) : (
        <CreatingButton />
      );
    }
    return (
      <Button variant="tertiary" size="regular" onPress={onEdit}>
        Edit Drop
      </Button>
    );
  }, [onEdit, state.status, state.transactionHash]);
  return (
    <View tw="items-center">
      <View tw="shadow-light dark:shadow-dark w-full rounded-3xl py-8 sm:w-[375px]">
        <View>
          <Preview
            file={file}
            width={isSmWidth ? 375 : width - 32}
            height={isSmWidth ? 375 : width - 32}
            isMuted={muted}
            showMuteButton
            isLooping
          />
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
                <Spotify
                  color="white"
                  width={20}
                  height={20}
                  className="z-10"
                />
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
          <Description
            descriptionText={description}
            maxLines={2}
            tw="max-h-[30vh] pt-2"
          />
          <View tw="h-4" />
          {renderButtons()}
        </View>
      </View>
    </View>
  );
});
