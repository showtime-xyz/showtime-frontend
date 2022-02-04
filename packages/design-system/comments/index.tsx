import { useState, useRef, useCallback, useEffect } from "react";
import { Platform, FlatList, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View } from "design-system/view";
import { Text } from "design-system/text";
import {
  MessageBox,
  SCROLL_HEIGHT,
  PADDING_HEIGHT,
} from "design-system/messages";
import { useComments } from "app/hooks/api-hooks";
import { usePanResponder } from "app/hooks/use-pan-responder";
import { useIsMobileWeb } from "app/hooks/use-is-mobile-web";
import type { NFT } from "app/types";
import { useIsDarkMode } from "design-system/hooks";

type Props = {
  nft?: NFT;
};

function Comments({ nft }: Props) {
  const insets = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(SCROLL_HEIGHT);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { isMobileWeb } = useIsMobileWeb();

  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const listener = Keyboard.addListener(
      "keyboardWillShow",
      _keyboardWillShow
    );

    return () => {
      listener.remove();
    };
  }, []);

  const _keyboardWillShow = (e) => {
    const height = e.endCoordinates.height;

    setKeyboardHeight(height);
  };

  const scrollToBottom = () => {
    if (!flatListRef.current) return;

    flatListRef.current.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  const { panHandlers, positionY } = usePanResponder();

  const messageBoxHeight = scrollHeight + PADDING_HEIGHT; // 48 input + 32 padding
  let messagesListBottom = 0;
  if (!isKeyboardOpen && Platform.OS === "web") {
    messagesListBottom = insets.bottom + messageBoxHeight;
  } else if (!isKeyboardOpen && Platform.OS !== "web") {
    // For mobile apps
    messagesListBottom = insets.bottom
      ? insets.bottom + messageBoxHeight
      : messageBoxHeight;
  } else if (Platform.OS === "ios" && isKeyboardOpen) {
    messagesListBottom = keyboardHeight + messageBoxHeight;
  } else {
    messagesListBottom = messageBoxHeight;
  }

  const { data, isLoadingMore, isLoading, isRefreshing, refresh, fetchMore } =
    useComments({
      nftId: nft?.nft_id,
    });

  const keyExtractor = useCallback((item) => {
    return item.comment_id;
  }, []);

  const renderItem = useCallback(
    ({ item }) => <Text tw="text-black dark:text-white">{item.text}</Text>,
    // <Message message={item} />,
    []
  );

  const ListFooterComponent = useCallback(
    () => <View />,
    // <Footer isLoading={isLoadingMore} />
    [isLoadingMore]
  );

  // TODO: getItemLayout

  const comments = data?.[0]?.data?.comments;

  return (
    <View tw="bg-white dark:bg-black">
      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.6}
        removeClippedSubviews={Platform.OS !== "web"}
        ListFooterComponent={ListFooterComponent}
        windowSize={5}
        initialNumToRender={10}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 100,
        }}
        // Not released yet...
        // automaticallyAdjustKeyboardInsets={true}
        // So...
        style={{
          position: "absolute",
          bottom: messagesListBottom,
          width: "100%",
          height: 90, // TODO:
          backgroundColor: isDark ? "black" : "white",
        }}
        {...panHandlers}
      />

      <MessageBox
        scrollToBottom={scrollToBottom}
        onFocus={() => {
          setIsKeyboardOpen(true);
        }}
        onBlur={() => {
          if (Platform.OS === "web" && isMobileWeb) {
            inputRef.current.focus();
          } else {
            setIsKeyboardOpen(false);
          }
          scrollToBottom();
        }}
        inputRef={inputRef}
        scrollHeight={scrollHeight}
        setScrollHeight={setScrollHeight}
        isKeyboardOpen={isKeyboardOpen}
        positionY={positionY}
      />
    </View>
  );
}

export { Comments };
