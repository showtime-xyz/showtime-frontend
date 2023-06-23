import { useMemo, useCallback } from "react";
import { Platform } from "react-native";

import { ResizeMode } from "expo-av";

import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { linkifyDescription } from "app/lib/linkify";
import { Link, LinkProps, TextLink } from "app/navigation/link";

export const RouteComponent = ({
  children,
  href,
  ...rest
}: (LinkProps | PressableProps) & {
  children: React.ReactNode;
  href: string;
}) => {
  const router = useRouter();
  const onItemPress = useCallback(() => {
    router.push(href);
  }, [href, router]);
  if (Platform.OS === "web") {
    return <Link {...(rest as LinkProps)}>{children}</Link>;
  }
  return (
    <Pressable onPress={onItemPress} {...(rest as PressableProps)}>
      {children}
    </Pressable>
  );
};
