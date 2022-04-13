import React from "react";

import { Meta } from "@storybook/react";

import { Text } from "../text";
import { View } from "../view";
import * as Icon from "./index";

export default {
  title: "Components/Icon",
  argTypes: {
    size: {
      control: { type: "number" },
      defaultValue: 16,
    },
    theme: {
      control: { type: "select", options: ["light", "dark"] },
      defaultValue: "light",
    },
    fill: { control: { type: "color" } },
  },
} as Meta;

type IconItemProps = {
  icon: React.ReactNode;
  title: string;
};

const IconItem = ({ icon, title }: IconItemProps) => {
  return (
    <View tw="p-4 m-2 rounded-md flex flex-col items-center justify-center">
      {React.createElement(icon, {
        width: 32,
        height: 32,
        fill: "black",
      })}
      <Text tw="mt-2">{title}</Text>
    </View>
  );
};

const IconsGrid = (args) => {
  return (
    <View
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
      }}
    >
      <IconItem icon={Icon.ArrowLeft} title="ArrowLeft" {...args} />
      <IconItem icon={Icon.ArrowRight} title="ArrowRight" {...args} />
      <IconItem icon={Icon.Badge} title="Badge" {...args} />
      <IconItem icon={Icon.Basket} title="Basket" {...args} />
      <IconItem icon={Icon.Bell} title="Bell" {...args} />
      <IconItem icon={Icon.BellFilled} title="BellFilled" {...args} />
      <IconItem icon={Icon.Bookmark} title="Bookmark" {...args} />
      <IconItem icon={Icon.Boost} title="Boost" {...args} />
      <IconItem icon={Icon.Check1} title="Check1" {...args} />
      <IconItem icon={Icon.Check} title="Check" {...args} />
      <IconItem icon={Icon.CheckFilled} title="CheckFilled" {...args} />
      <IconItem icon={Icon.ChevronDown} title="ChevronDown" {...args} />
      <IconItem icon={Icon.ChevronLeft} title="ChevronLeft" {...args} />
      <IconItem icon={Icon.ChevronRight} title="ChevronRight" {...args} />
      <IconItem icon={Icon.ChevronUp} title="ChevronUp" {...args} />
      <IconItem icon={Icon.Clock} title="Clock" {...args} />
      <IconItem icon={Icon.Close} title="Close" {...args} />
      <IconItem icon={Icon.Commented} title="Commented" {...args} />
      <IconItem icon={Icon.Compass} title="Compass" {...args} />
      <IconItem icon={Icon.CompassFilled} title="CompassFilled" {...args} />
      <IconItem icon={Icon.Copy} title="Copy" {...args} />
      <IconItem icon={Icon.Corner} title="Corner" {...args} />
      <IconItem icon={Icon.Discord} title="Discord" {...args} />
      <IconItem icon={Icon.Edit} title="Edit" {...args} />
      <IconItem icon={Icon.Ethereum} title="Ethereum" {...args} />
      <IconItem icon={Icon.File} title="File" {...args} />
      <IconItem icon={Icon.Filter} title="Filter" {...args} />
      <IconItem icon={Icon.FilterFilled} title="FilterFilled" {...args} />
      <IconItem icon={Icon.Followed} title="Followed" {...args} />
      <IconItem icon={Icon.Globe} title="Globe" {...args} />
      <IconItem icon={Icon.Heart} title="Heart" {...args} />
      <IconItem icon={Icon.HeartFilled} title="HeartFilled" {...args} />
      <IconItem icon={Icon.Help} title="Help" {...args} />
      <IconItem icon={Icon.Home} title="Home" {...args} />
      <IconItem icon={Icon.HomeFilled} title="HomeFilled" {...args} />
      <IconItem icon={Icon.Hot} title="Hot" {...args} />
      <IconItem icon={Icon.HotFilled} title="HotFilled" {...args} />
      <IconItem icon={Icon.Image} title="Image" {...args} />
      <IconItem icon={Icon.Instagram} title="Instagram" {...args} />
      <IconItem icon={Icon.Layers} title="Layers" {...args} />
      <IconItem icon={Icon.Liked} title="Liked" {...args} />
      <IconItem icon={Icon.Link} title="Link" {...args} />
      <IconItem icon={Icon.Mail} title="Mail" {...args} />
      <IconItem icon={Icon.MarketFilled} title="MarketFilled" {...args} />
      <IconItem icon={Icon.Maximize} title="Maximize" {...args} />
      <IconItem icon={Icon.Menu} title="Menu" {...args} />
      <IconItem icon={Icon.Message} title="Message" {...args} />
      <IconItem icon={Icon.MessageFilled} title="MessageFilled" {...args} />
      <IconItem icon={Icon.MoreHorizontal} title="MoreHorizontal" {...args} />
      <IconItem icon={Icon.Move} title="Move" {...args} />
      <IconItem icon={Icon.Percent} title="Percent" {...args} />
      <IconItem icon={Icon.PlusSquare} title="PlusSquare" {...args} />
      <IconItem icon={Icon.Plus} title="Plus" {...args} />
      <IconItem icon={Icon.PlusFilled} title="PlusFilled" {...args} />
      <IconItem icon={Icon.PolygonScan} title="PolygonScan" {...args} />
      <IconItem icon={Icon.Purchased} title="Purchased" {...args} />
      <IconItem icon={Icon.Search} title="Search" {...args} />
      <IconItem icon={Icon.SearchFilled} title="SearchFilled" {...args} />
      <IconItem icon={Icon.Send} title="Send" {...args} />
      <IconItem icon={Icon.Showtime} title="Showtime" {...args} />
      <IconItem
        icon={Icon.ShowtimeGradient}
        title="ShowtimeGradient"
        {...args}
      />
      <IconItem icon={Icon.Smile} title="Smile" {...args} />
      <IconItem icon={Icon.SocialToken} title="SocialToken" {...args} />
      <IconItem icon={Icon.Tag} title="Tag" {...args} />
      <IconItem icon={Icon.Tezos} title="Tezos" {...args} />
      <IconItem icon={Icon.Transfer} title="Transfer" {...args} />
      <IconItem icon={Icon.Trending} title="Trending" {...args} />
      <IconItem icon={Icon.TrendingFilled} title="TrendingFilled" {...args} />
      <IconItem icon={Icon.Twitter} title="Twitter" {...args} />
      <IconItem icon={Icon.Upload} title="Upload" {...args} />
      <IconItem icon={Icon.UserPlus} title="UserPlus" {...args} />
      <IconItem icon={Icon.Video} title="Video" {...args} />
      <IconItem icon={Icon.Wallet} title="Wallet" {...args} />
      <IconItem icon={Icon.Zap} title="Zap" {...args} />
      <IconItem icon={Icon.ZapFilled} title="ZapFilled" {...args} />
      <IconItem icon={Icon.FlashOff} title="FlashOff" {...args} />
      <IconItem icon={Icon.Flash} title="Flash" {...args} />
      <IconItem icon={Icon.Flip} title="Flip" {...args} />
      <IconItem icon={Icon.Play} title="Play" {...args} />
      <IconItem icon={Icon.Settings} title="Settings" {...args} />
      <IconItem icon={Icon.Share} title="Share" {...args} />
    </View>
  );
};

export const Default = (args) => <IconsGrid {...args} />;
