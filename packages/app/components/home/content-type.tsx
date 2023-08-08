import { MusicBadge, RaffleBadge } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { TextTooltip, contentGatingType } from "app/components/tooltips";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";

type ContentTypeTooltipProps = {
  edition: CreatorEditionResponse | undefined;
  theme?: "dark" | "light";
};

export const ContentType = ({ edition, ...rest }: ContentTypeTooltipProps) => {
  // This will be removed after the airdrop
  if (
    edition?.spinamp_track_url ||
    edition?.gating_type === "multi_provider_music_presave" ||
    edition?.gating_type === "multi_provider_music_save" ||
    edition?.gating_type === "spotify_presave" ||
    edition?.gating_type === "music_presave" ||
    edition?.gating_type === "spotify_save"
  ) {
    return (
      <TextTooltip
        side="bottom"
        triggerElement={
          <View tw="h-[18px] w-8 items-center justify-center rounded-full bg-black/60">
            <MusicBadge color="#fff" width={10} height={13} />
          </View>
        }
        text={contentGatingType[edition?.gating_type].text}
        {...rest}
      />
    );
  }

  if (edition?.raffles) {
    return (
      <TextTooltip
        side="bottom"
        triggerElement={
          <View tw="h-[18px] w-8 items-center justify-center rounded-full bg-black/60">
            <RaffleBadge width={15} height={10} />
          </View>
        }
        text="Raffle Drop"
        {...rest}
      />
    );
  }

  return null;
};
