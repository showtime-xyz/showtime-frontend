import { useState } from "react";
import { Platform } from "react-native";

import { Text } from "@showtime-xyz/universal.text";
import { Tooltip } from "@showtime-xyz/universal.tooltip";
import { View } from "@showtime-xyz/universal.view";

import type { NFT } from "app/types";

type Props = {
  nft?: NFT;
  cardMaxWidth?: number;
  disableTooltip?: boolean;
};

function Title({ nft, cardMaxWidth, disableTooltip = false }: Props) {
  const [isUseTooltip] = useState(Platform.OS === "web" && !disableTooltip);
  /**
   * Todo: If the content width is greater than the container width, use Tooltip components,
   * but now RecyclerList is used, I can't get valid data, so wait until we replace the list and then implement.
   *
   * */
  // const textRef = useRef<HTMLElement | null>(null);
  // useLayoutEffect(() => {
  // if (textRef.current && Platform.OS === "web") {
  // use range width instead of scrollWidth to determine whether the text is overflowing
  // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
  // const range = document.createRange();
  // range.setStart(textRef.current, 0);
  // range.setEnd(textRef.current, textRef.current.childNodes.length);
  // const rangeWidth = range.getBoundingClientRect().width;
  // setIsOverflow(
  //   rangeWidth + 16 > textRef.current.offsetWidth ||
  //     textRef.current.scrollWidth > textRef.current.offsetWidth
  // );
  // }
  // }, []);

  if (!nft) return null;

  return (
    <View tw="px-4 pt-4">
      {isUseTooltip ? (
        <Tooltip
          delay={300}
          text={nft.token_name}
          contentStyle={{
            maxWidth: cardMaxWidth,
          }}
        >
          <Text
            tw="font-space-bold text-lg leading-8 text-black dark:text-white"
            numberOfLines={1}
          >
            {nft.token_name}
          </Text>
        </Tooltip>
      ) : (
        <Text
          tw="font-space-bold text-lg leading-8 text-black dark:text-white"
          numberOfLines={1}
        >
          {nft.token_name}
        </Text>
      )}
    </View>
  );
}

export { Title };
