import { useMemo, useCallback, ReactNode } from "react";
import {
  Platform,
  StyleProp,
  ViewStyle,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { Link, LinkProps } from "solito/link";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { GridMedia, ListMedia } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import {
  DESKTOP_CONTENT_WIDTH,
  DESKTOP_PROFILE_WIDTH,
} from "app/constants/layout";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

import { NSFWGate } from "../feed-item/nsfw-gate";

const isWeb = Platform.OS === "web";

const RouteComponent = ({
  children,
  onPress,
  ...rest
}: (LinkProps | PressableProps) & {
  onPress: () => void;
  children: ReactNode;
}) => {
  if (isWeb) {
    return <Link {...(rest as LinkProps)}>{children}</Link>;
  }
  return (
    <Pressable onPress={onPress} {...(rest as PressableProps)}>
      {children}
    </Pressable>
  );
};

type Props = {
  nft: NFT & { loading?: boolean };
  numColumns?: number;
  onPress?: () => void;
  as?: string;
  tw?: string;
  variant?: "nft" | "activity" | "market";
  href?: string;
  showClaimButton?: Boolean;
  sizeStyle?: { width: number; height: number };
  style?: StyleProp<ViewStyle>;
  index: number;
};

export const GAP = StyleSheet.hairlineWidth;

function Card(props: Props) {
  const {
    nft,
    numColumns = 1,
    tw = "",
    sizeStyle,
    onPress,
    href = "",
    as,
    style,
  } = props;
  const { data: edition } = useCreatorCollectionDetail(
    nft.creator_airdrop_edition_address
  );
  const contentWidth = useContentWidth();
  const isMdWidth = contentWidth > DESKTOP_PROFILE_WIDTH - 10;
  const isDark = useIsDarkMode();
  const pagerWidth = isMdWidth ? 536 : contentWidth;

  const mediaWidth = useMemo(() => {
    return Math.ceil(pagerWidth / numColumns);
  }, [numColumns, pagerWidth]);

  const handleOnPress = useCallback(() => {
    if (isWeb) return null;
    onPress?.();
  }, [onPress]);

  return (
    <RouteComponent href={href} as={as} onPress={handleOnPress}>
      <View style={{ width: mediaWidth, height: mediaWidth }}>
        <GridMedia item={nft} optimizedWidth={500} isMuted />
        <NSFWGate show={nft.nsfw} nftId={nft.nft_id} variant="thumbnail" />
      </View>
    </RouteComponent>
  );
}

const MemoizedCard = withMemoAndColorScheme<typeof Card, Props>(Card);

export { MemoizedCard as Card };
