import { useCallback } from "react";
import { Platform } from "react-native";

import { UrlObject } from "url";

import { Pressable, PressableProps } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";

import { Link, LinkProps } from "app/navigation/link";

export const RouteComponent = ({
  children,
  href,
  ...rest
}: LinkProps & {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const onItemPress = useCallback(() => {
    router.push(href);
  }, [href, router]);
  if (Platform.OS === "web") {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <Pressable onPress={onItemPress} {...(rest as PressableProps)}>
      {children}
    </Pressable>
  );
};
