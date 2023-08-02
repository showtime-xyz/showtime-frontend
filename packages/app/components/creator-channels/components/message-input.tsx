import {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  RefObject,
  useState,
} from "react";
import { Platform } from "react-native";

import Animated, {
  useAnimatedStyle,
  FadeOut,
  FadeIn,
  enableLayoutAnimations,
} from "react-native-reanimated";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Check, Close, ChevronDown } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { FlashList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MessageBox } from "app/components/messages";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

import { useEditChannelMessage } from "../hooks/use-edit-channel-message";
import { useSendChannelMessage } from "../hooks/use-send-channel-message";
import { MissingStarDropModal } from "../missing-star-drop-modal";

export const ScrollToBottomButton = ({ onPress }: { onPress: any }) => {
  return (
    <Pressable
      onPress={onPress}
      tw="items-center justify-center rounded-full bg-black/40 p-1 dark:bg-white/40"
    >
      <ChevronDown height={32} width={32} color="white" />
    </Pressable>
  );
};

export const MessageBoxUnavailable = () => {
  return (
    <MessageBox
      placeholder="Coming soon..."
      tw="bg-white text-center dark:bg-black"
      textInputProps={{
        editable: false,
      }}
      submitButton={<></>}
    />
  );
};

export const MessageInput = ({
  listRef,
  channelId,
  sendMessageCallback,
  editMessage,
  setEditMessage,
  isUserAdmin,
  keyboard,
  latestPaidNFTSlug,
  hasUnlockedMessages,
}: {
  listRef: RefObject<FlashList<any>>;
  channelId: string;
  keyboard: any;
  sendMessageCallback?: () => void;
  editMessage?: undefined | { id: number; text: string };
  setEditMessage: (v: undefined | { id: number; text: string }) => void;
  isUserAdmin?: boolean;
  latestPaidNFTSlug?: string;
  hasUnlockedMessages?: boolean;
}) => {
  const [shouldShowMissingStarDropModal, setShouldShowMissingStarDropModal] =
    useState(false);
  const insets = useSafeAreaInsets();
  const bottomHeight = usePlatformBottomHeight();
  const sendMessage = useSendChannelMessage(channelId);
  const inputRef = useRef<any>(null);
  const editMessages = useEditChannelMessage(channelId);
  const isDark = useIsDarkMode();
  const router = useRouter();
  const bottom = useMemo(
    () =>
      Platform.select({
        web: bottomHeight,
        ios: insets.bottom / 2,
        android: 0,
      }),
    [bottomHeight, insets.bottom]
  );

  useEffect(() => {
    // autofocus with ref is more stable than autoFocus prop
    setTimeout(() => {
      // prevent some UI jank on android
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }, 600);
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      paddingBottom: bottom,
      bottom: 0,
      backgroundColor: isDark ? "black" : "white",
      transform: [
        {
          translateY:
            keyboard.height.value -
            (keyboard.height.value ? -(insets.bottom / 2) : 0),
        },
      ],
    };
  }, [keyboard, bottom]);

  useEffect(() => {
    if (editMessage) {
      inputRef.current?.setValue(editMessage.text);
      inputRef.current?.focus();
    } else {
      inputRef.current?.setValue("");
    }
  }, [editMessage]);

  const handleSubmit = useCallback(
    async (text: string) => {
      if (channelId) {
        inputRef.current?.reset();
        enableLayoutAnimations(false);
        listRef.current?.prepareForLayoutAnimationRender();
        await sendMessage.trigger({
          channelId,
          message: text,
          callback: sendMessageCallback,
        });
        requestAnimationFrame(() => {
          enableLayoutAnimations(true);

          listRef.current?.scrollToIndex({
            index: 0,
            animated: true,
            viewOffset: 1000,
          });
        });
      }

      return Promise.resolve();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channelId, sendMessage, sendMessageCallback]
  );

  const handleEditMessage = useCallback(async () => {
    if (!editMessage) return;

    const newMessage = inputRef.current?.value;
    if (newMessage.trim().length === 0) return;
    inputRef.current?.reset();
    enableLayoutAnimations(true);
    requestAnimationFrame(() => {
      editMessages.trigger({
        messageId: editMessage.id,
        message: newMessage,
        channelId,
      });
      setEditMessage(undefined);
    });
  }, [channelId, editMessage, editMessages, setEditMessage]);

  if (!isUserAdmin && !hasUnlockedMessages) {
    return (
      <View
        tw="justify-center px-3"
        style={{
          paddingBottom: bottom,
        }}
      >
        <Button
          tw={"bg-black dark:bg-white"}
          size={"regular"}
          variant="primary"
          onPress={() => {
            if (latestPaidNFTSlug) {
              router.push(latestPaidNFTSlug);
            }
          }}
        >
          <View tw="w-full flex-row items-center justify-center">
            <View>
              <Image
                source={
                  Platform.OS === "web"
                    ? "https://media.showtime.xyz/assets/st-logo.png"
                    : require("app/components/assets/st-logo.png")
                }
                width={16}
                height={16}
                style={{ width: 16, height: 16 }}
              />
            </View>

            <Text
              tw={
                "ml-2 text-base font-semibold text-[#FFCB6C] dark:text-[#E88A3F]"
              }
            >
              Collect a Star Drop
            </Text>
          </View>
        </Button>
        <View tw="mt-3 pb-4">
          <Text tw="text-center text-xs text-gray-500 dark:text-gray-300">
            Collecting a Star Drop unlocks privileges with this artist like
            exclusive channel content, a Star Badge, and more
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Animated.View style={[{ position: "absolute", width: "100%" }, style]}>
        {isUserAdmin ? (
          <MessageBox
            ref={inputRef}
            placeholder="Send an update..."
            textInputProps={{
              maxLength: 2000,
            }}
            onSubmit={
              !latestPaidNFTSlug
                ? async () => {
                    setShouldShowMissingStarDropModal(true);
                  }
                : editMessage
                ? handleEditMessage
                : handleSubmit
            }
            submitting={editMessages.isMutating || sendMessage.isMutating}
            tw="bg-white dark:bg-black"
            submitButton={
              editMessage ? (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <View tw="flex-row" style={{ gap: 8 }}>
                    <Button
                      variant="secondary"
                      style={{ backgroundColor: colors.red[500] }}
                      iconOnly
                      onPress={() => {
                        setEditMessage(undefined);
                        inputRef.current?.reset();
                      }}
                    >
                      <Close width={20} height={20} color="white" />
                    </Button>
                    <Button
                      disabled={editMessages.isMutating || !editMessage}
                      iconOnly
                      onPress={handleEditMessage}
                    >
                      <Check width={20} height={20} />
                    </Button>
                  </View>
                </Animated.View>
              ) : null
            }
          />
        ) : (
          <MessageBoxUnavailable />
        )}
      </Animated.View>
      <MissingStarDropModal
        isOpen={shouldShowMissingStarDropModal}
        close={() => {
          setShouldShowMissingStarDropModal(false);
        }}
      />
    </>
  );
};
