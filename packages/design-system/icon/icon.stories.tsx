import React from "react";

import { Meta } from "@storybook/react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import * as Icon from "./index";

export default {
  title: "Components/Icon",
} as Meta;

type IconItemProps = {
  icon: React.ReactNode;
  title: string;
};

const IconItem = ({ icon, title }: IconItemProps) => {
  return (
    <View tw="m-2 flex w-[120px] flex-col items-center justify-center rounded-md p-4">
      {React.createElement(icon, {
        width: 32,
        height: 32,
        fill: "black",
      })}
      <View tw="h-2" />
      <Text>{title}</Text>
    </View>
  );
};

export const Default = () => {
  return (
    <View tw="flex flex-row flex-wrap justify-center">
      <IconItem icon={Icon.ArrowTop} title="ArrowTop" />
      <IconItem icon={Icon.ArrowBottom} title="ArrowBottom" />
      <IconItem icon={Icon.ArrowLeft} title="ArrowLeft" />
      <IconItem icon={Icon.ArrowRight} title="ArrowRight" />
      <IconItem icon={Icon.Badge} title="Badge" />
      {/* <IconItem icon={Icon.Basket} title="Basket"  /> */}
      <IconItem icon={Icon.Bell} title="Bell" />
      <IconItem icon={Icon.BellFilled} title="BellFilled" />
      <IconItem icon={Icon.Bookmark} title="Bookmark" />
      <IconItem icon={Icon.Boost} title="Boost" />
      <IconItem icon={Icon.Check1} title="Check1" />
      <IconItem icon={Icon.Check} title="Check" />
      <IconItem icon={Icon.CheckFilled} title="CheckFilled" />
      <IconItem icon={Icon.ChevronDown} title="ChevronDown" />
      <IconItem icon={Icon.ChevronLeft} title="ChevronLeft" />
      <IconItem icon={Icon.ChevronRight} title="ChevronRight" />
      <IconItem icon={Icon.ChevronUp} title="ChevronUp" />
      <IconItem icon={Icon.Clock} title="Clock" />
      <IconItem icon={Icon.Close} title="Close" />
      <IconItem icon={Icon.Commented} title="Commented" />
      <IconItem icon={Icon.Compass} title="Compass" />
      <IconItem icon={Icon.CompassFilled} title="CompassFilled" />
      <IconItem icon={Icon.Copy} title="Copy" />
      <IconItem icon={Icon.Corner} title="Corner" />
      <IconItem icon={Icon.Discord} title="Discord" />
      <IconItem icon={Icon.Edit} title="Edit" />
      <IconItem icon={Icon.Ethereum} title="Ethereum" />
      <IconItem icon={Icon.File} title="File" />
      <IconItem icon={Icon.Filter} title="Filter" />
      <IconItem icon={Icon.FilterFilled} title="FilterFilled" />
      <IconItem icon={Icon.Followed} title="Followed" />
      <IconItem icon={Icon.Globe} title="Globe" />
      <IconItem icon={Icon.Heart} title="Heart" />
      <IconItem icon={Icon.HeartFilled} title="HeartFilled" />
      <IconItem icon={Icon.Help} title="Help" />
      <IconItem icon={Icon.Home} title="Home" />
      <IconItem icon={Icon.HomeFilled} title="HomeFilled" />
      <IconItem icon={Icon.Hot} title="Hot" />
      <IconItem icon={Icon.HotFilled} title="HotFilled" />
      <IconItem icon={Icon.Image} title="Image" />
      <IconItem icon={Icon.Instagram} title="Instagram" />
      <IconItem icon={Icon.Layers} title="Layers" />
      <IconItem icon={Icon.Liked} title="Liked" />
      <IconItem icon={Icon.Link} title="Link" />
      <IconItem icon={Icon.Mail} title="Mail" />
      <IconItem icon={Icon.MarketFilled} title="MarketFilled" />
      <IconItem icon={Icon.Maximize} title="Maximize" />
      <IconItem icon={Icon.Menu} title="Menu" />
      <IconItem icon={Icon.Message} title="Message" />
      <IconItem icon={Icon.MessageFilled} title="MessageFilled" />
      <IconItem icon={Icon.MoreHorizontal} title="MoreHorizontal" />
      <IconItem icon={Icon.Move} title="Move" />
      <IconItem icon={Icon.Percent} title="Percent" />
      <IconItem icon={Icon.PlusSquare} title="PlusSquare" />
      <IconItem icon={Icon.Plus} title="Plus" />
      <IconItem icon={Icon.PlusFilled} title="PlusFilled" />
      <IconItem icon={Icon.PolygonScan} title="PolygonScan" />
      <IconItem icon={Icon.Purchased} title="Purchased" />
      <IconItem icon={Icon.Search} title="Search" />
      <IconItem icon={Icon.SearchFilled} title="SearchFilled" />
      <IconItem icon={Icon.Send} title="Send" />
      <IconItem icon={Icon.Showtime} title="Showtime" />
      <IconItem icon={Icon.ShowtimeGradient} title="ShowtimeGradient" />
      <IconItem icon={Icon.Smile} title="Smile" />
      <IconItem icon={Icon.SocialToken} title="SocialToken" />
      <IconItem icon={Icon.Tag} title="Tag" />
      <IconItem icon={Icon.Tezos} title="Tezos" />
      <IconItem icon={Icon.Transfer} title="Transfer" />
      <IconItem icon={Icon.Trending} title="Trending" />
      <IconItem icon={Icon.TrendingFilled} title="TrendingFilled" />
      <IconItem icon={Icon.Twitter} title="Twitter" />
      <IconItem icon={Icon.Upload} title="Upload" />
      <IconItem icon={Icon.UserPlus} title="UserPlus" />
      <IconItem icon={Icon.Video} title="Video" />
      <IconItem icon={Icon.Wallet} title="Wallet" />
      <IconItem icon={Icon.Zap} title="Zap" />
      <IconItem icon={Icon.ZapFilled} title="ZapFilled" />
      <IconItem icon={Icon.FlashOff} title="FlashOff" />
      <IconItem icon={Icon.Flash} title="Flash" />
      <IconItem icon={Icon.Flip} title="Flip" />
      <IconItem icon={Icon.Play} title="Play" />
      <IconItem icon={Icon.Settings} title="Settings" />
      <IconItem icon={Icon.Share} title="Share" />
    </View>
  );
};
