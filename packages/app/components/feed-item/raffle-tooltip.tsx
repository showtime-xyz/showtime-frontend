import { RaffleHorizontal } from "@showtime-xyz/universal.icon";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

import { TextTooltip } from "../tooltips/text-tooltip";

type RaffleTooltipProps = {
  edition?: CreatorEditionResponse;
  side?: "top" | "bottom" | "left" | "right";
  theme?: "dark" | "light";
  tw?: string;
};

export const RaffleTooltip = ({
  edition,
  tw = "",
  ...rest
}: RaffleTooltipProps) => {
  if (!edition?.raffles || !edition?.raffles?.length) return null;
  return (
    <TextTooltip
      side="bottom"
      triggerElement={
        <View
          tw={[
            "h-6 flex-row items-center justify-center self-start rounded-sm bg-black/60 px-1",
            tw,
          ]}
        >
          <RaffleHorizontal color={"#FFC633"} width={20} height={20} />
          <Text tw="ml-1 text-xs font-medium text-white">Raffle</Text>
        </View>
      }
      text="Collect to enter a raffle"
      {...rest}
    />
  );
};
