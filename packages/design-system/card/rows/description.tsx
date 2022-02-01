import { useState, useCallback, useEffect, useMemo } from "react";
import { LayoutAnimation, UIManager, Platform } from "react-native";

import { View } from "design-system/view";
import { Text } from "design-system/text";
import { Pressable } from "design-system/pressable-scale";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(undefined);

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

  const description = useMemo(
    () =>
      nft && nft.token_description
        ? removeTags(nft.token_description)
        : undefined,
    [nft]
  );

  const onTextLayout = useCallback(
    (e) => {
      if (e.nativeEvent.lines.length > 3 && !isExpanded) {
        setShowMore(true);
        setNumberOfLines(3);
      }
    },
    [isExpanded]
  );

  const onShowMore = useCallback(() => {
    LayoutAnimation.configureNext(animation);
    setShowMore(false);
    setShowLess(true);
    setIsExpanded(true);
    setNumberOfLines(undefined);
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
    <View tw="px-4 pb-4 bg-white dark:bg-black">
      <Text
        variant="text-sm"
        tw="text-gray-600 dark:text-gray-400"
        numberOfLines={numberOfLines}
        onTextLayout={onTextLayout}
      >
        {description}
      </Text>

      {(showMore || showLess) && (
        <Pressable onPress={showMore ? onShowMore : onShowLess}>
          <Text
            variant="text-sm"
            tw="font-bold text-gray-600 dark:text-gray-400 mt-1"
          >
            {showMore ? "More" : "Less"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export { Description };
