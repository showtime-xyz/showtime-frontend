import { useMemo } from "react";

import { Twitter, InstagramColorful } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Button, ButtonProps } from "design-system/button";

type ShareButtonParams = ButtonProps & {
  type: "twitter" | "instagram";
};

const shareButtons = {
  twitter: {
    title: "Announce on Twitter",
    Icon: Twitter,
    color: colors.twitter,
  },
  instagram: {
    title: "Announce on Instagram",
    Icon: InstagramColorful,
    color: undefined,
  },
};
export const ShareButton = ({ type, ...rest }: ShareButtonParams) => {
  const ButtonComponent = useMemo(() => shareButtons[type], [type]);
  return (
    <Button size="regular" {...rest}>
      <View tw="flex-1 flex-row items-center">
        <View tw="flex-1 flex-row items-center justify-center">
          <ButtonComponent.Icon color={colors.twitter} height={20} width={20} />
          <Text tw="ml-1 font-semibold text-white dark:text-black">
            {ButtonComponent.title}
          </Text>
        </View>
      </View>
    </Button>
  );
};
