import { PortalProvider } from "@gorhom/portal";
import { Meta } from "@storybook/react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Placement } from "./get-placement";
import { Tooltip } from "./index";

export default {
  component: Tooltip,
  title: "Components/Tooltip",
} as Meta;

export const Basic: React.FC<{}> = () => {
  return (
    <PortalProvider>
      <View tw="flex-1 items-center bg-gray-400 ">
        <Tooltip
          style={{ marginTop: 20 }}
          placement={Placement.top}
          text="Tooltip top"
        >
          <Text tw="text-sm font-bold text-white">Tooltip Top</Text>
        </Tooltip>

        <Tooltip
          placement={Placement.bottom}
          delay={0}
          text="Tooltip delay:0"
          style={{ marginTop: 20 }}
        >
          <Text tw="text-sm font-bold text-white">Tooltip Bottom delay:0</Text>
        </Tooltip>

        <Tooltip
          style={{ marginTop: 20 }}
          placement={Placement.bottom}
          text="TooltipTooltip!"
        >
          <Text tw="text-sm font-bold text-white">Tooltip</Text>
        </Tooltip>
        <Tooltip
          style={{ marginTop: 20 }}
          placement={Placement.bottom}
          offset={20}
          text="TooltipTooltip!"
        >
          <Text tw="text-sm font-bold text-white">Tooltip offset:20</Text>
        </Tooltip>
        <Tooltip
          placement={Placement.bottom}
          delay={600}
          text="TooltipTooltipTooltip!"
          style={{ marginTop: 20 }}
        >
          <Text tw="text-sm font-bold text-white">Web only: delayDuration</Text>
        </Tooltip>

        <Tooltip
          style={{ marginTop: 20 }}
          placement={Placement.bottom}
          text="Tooltip very very very very very very very very very very very very very very very very long text"
        >
          <Text tw="text-sm font-bold text-white">Tooltip long text</Text>
        </Tooltip>
        <Tooltip
          style={{ marginTop: 20 }}
          placement={Placement.bottom}
          textTw="text-red-900"
          text="Tooltip"
        >
          <Text tw="text-sm font-bold text-white">Custom text style</Text>
        </Tooltip>
        <Tooltip
          style={{ marginTop: 20 }}
          placement={Placement.bottom}
          customContent={
            <View tw="rounded-sm bg-yellow-300 p-2">
              <Text>I's custom content</Text>
            </View>
          }
        >
          <Text tw="text-sm font-bold text-white">Custom content</Text>
        </Tooltip>
      </View>
    </PortalProvider>
  );
};
