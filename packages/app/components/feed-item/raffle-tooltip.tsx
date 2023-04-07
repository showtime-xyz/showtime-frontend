import { Platform } from "react-native";

import { Raffle, RaffleHorizontal } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { TextTooltip } from "../text-tooltip";

type RaffleTooltipProps = {
  edition?: CreatorEditionResponse;
  side?: "top" | "bottom" | "left" | "right";
  theme?: "dark" | "light";
};

export const RaffleTooltip = ({ edition, ...rest }: RaffleTooltipProps) => {
  if (!edition?.raffles || !edition?.raffles?.length) return null;
  return (
    <TextTooltip
      triggerElement={
        <View tw="h-5 flex-row items-center justify-center self-start rounded-sm bg-black/50 px-1">
          <RaffleHorizontal color={"#FFC633"} width={20} height={20} />
          <Text tw="ml-1 text-xs text-white">Raffle</Text>
        </View>
      }
      text="Collect to enter a raffle"
      {...rest}
    />
  );
};
