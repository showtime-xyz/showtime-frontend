import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { LayoutAnimation, UIManager, Platform } from "react-native";

import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import type { NFT } from "app/types";
import { removeTags } from "app/utilities";

type Props = {
  nft?: NFT;
};

const animation = LayoutAnimation.create(
  300,
  LayoutAnimation.Types.easeOut,
  LayoutAnimation.Properties.opacity
);

function Description({ nft }: Props) {
  const textRef = useRef<Element | Text>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }

      return () => {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(false);
        }
      };
    }
  }, []);

  const countLines = useCallback((ele: Element | null) => {
    if (!ele) return 0;
    const styles = window.getComputedStyle(ele, null);
    const lh = parseInt(styles.lineHeight, 10);
    const h = parseInt(styles.height, 10);
    const lc = Math.round(h / lh);
    return lc;
  }, []);

  const onTextLayout = useCallback(
    (lines: number) => {
      if (lines > 3 && !isExpanded) {
        setShowMore(true);
        setNumberOfLines(3);
      }
    },
    [isExpanded]
  );

  useLayoutEffect(() => {
    onTextLayout(countLines(textRef.current as Element));
  }, [countLines, isExpanded, onTextLayout]);

  const description = useMemo(
    () =>
      nft && nft.token_description
        ? removeTags(nft.token_description)
        : undefined,
    [nft]
  );

  const onShowMore = useCallback(() => {
    LayoutAnimation.configureNext(animation);
    setShowMore(false);
    setShowLess(true);
    setIsExpanded(true);
    setNumberOfLines(0);
  }, []);

  const onShowLess = useCallback(() => {
    LayoutAnimation.configureNext(animation);
    setShowLess(false);
    setShowMore(true);
    setIsExpanded(false);
    setNumberOfLines(3);
  }, []);

  if (!nft || !nft.token_description || nft.token_description === "") {
    return null;
  }

  return (
    <View tw="bg-white px-4 pb-4 dark:bg-black">
      <Text
        tw="text-sm text-gray-600 dark:text-gray-400"
        numberOfLines={numberOfLines}
        ref={textRef as any}
        // onTextLayout only support native
        onTextLayout={(e) => onTextLayout(e.nativeEvent.lines.length)}
      >
        {description}
      </Text>

      {(showMore || showLess) && (
        <>
          <View tw="h-1" />
          <PressableScale onPress={showMore ? onShowMore : onShowLess}>
            <Text tw="text-sm font-bold text-gray-600 dark:text-gray-400">
              {showMore ? "More" : "Less"}
            </Text>
          </PressableScale>
        </>
      )}
    </View>
  );
}

export { Description };
