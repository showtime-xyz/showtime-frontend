import { Platform } from "react-native";

import { Raffle } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { TextTooltip } from "../text-tooltip";

type RaffleTooltipProps = {
  edition?: CreatorEditionResponse;
  side?: "top" | "bottom" | "left" | "right";
  theme?: "dark" | "light";
};

export const RaffleTooltip = ({
  edition,
  side = "bottom",
  ...rest
}: RaffleTooltipProps) => {
  if (!edition?.raffles || !edition?.raffles?.length) return null;
  return (
    <TextTooltip
      triggerElement={
        <View tw="mr-2 flex flex-row items-center rounded-full border-2 border-[#F7FF97] text-[#F7FF97] dark:border-[#F7FF97] dark:text-[#F7FF97] md:border-[#FFDF00] md:text-[#FFDF00]">
          <Raffle
            color={Platform.select({
              web: "currentColor",
              default: "#F7FF97",
            })}
            width={28}
            height={28}
          />
        </View>
      }
      text="Collect to enter a raffle"
      side={side}
      {...rest}
    />
  );
};
