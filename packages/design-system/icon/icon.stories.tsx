import React, { createContext, useContext } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import * as Icon from "./index";

export default {
  title: "Components/Icon",
};

type IconItemProps = {
  icon: any;
  title: string;
};
const IconContext = createContext<{
  color: string;
}>({
  color: "#000",
});

const IconItem = ({ icon, title }: IconItemProps) => {
  const { color } = useContext(IconContext);
  return (
    <View
      tw={[
        "m-2 flex w-[140px] flex-col items-center justify-center rounded-md p-4 px-2",
        color === "#fff" ? "bg-black" : "",
      ]}
    >
      {React.createElement(icon, {
        width: 32,
        height: 32,
        color: color,
      })}
      <View tw="h-2" />
      <Text
        tw="text-sm font-medium"
        style={{ color: color === "#fff" ? "#fff" : "#000" }}
      >
        {title}
      </Text>
    </View>
  );
};
const COLORS_LIST = [
  "#fff",
  "#000",
  "#C2272D",
  "#F8931F",
  "#FFFF01",
  "#009245",
  "#0193D9",
  "#0C04ED",
  "#612F90",
];

export const Default = () => {
  const [colorIndex, setColorIndex] = React.useState(0);
  return (
    <IconContext.Provider value={{ color: COLORS_LIST[colorIndex] }}>
      <View tw="bg-white px-4 py-4">
        <View tw="relative mb-6 mt-4 flex-row items-center justify-center">
          <Icon.ShowtimeBrand color="black" width={120} />
        </View>
        <View tw="flex flex-row flex-wrap bg-white">
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
          <IconItem icon={Icon.Check2} title="Check2" />
          <IconItem icon={Icon.Check} title="Check" />
          <IconItem icon={Icon.CheckFilled} title="CheckFilled" />
          <IconItem icon={Icon.CheckFilled1} title="CheckFilled1" />
          <IconItem icon={Icon.ChevronDown} title="ChevronDown" />
          <IconItem icon={Icon.ChevronLeft} title="ChevronLeft" />
          <IconItem icon={Icon.ChevronRight} title="ChevronRight" />
          <IconItem icon={Icon.ChevronUp} title="ChevronUp" />
          <IconItem icon={Icon.Clock} title="Clock" />
          <IconItem icon={Icon.Close} title="Close" />
          <IconItem icon={Icon.CloseLarge} title="CloseLarge" />
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
          <IconItem icon={Icon.Smile} title="Smile" />
          <IconItem icon={Icon.SocialToken} title="SocialToken" />
          <IconItem icon={Icon.Tag} title="Tag" />
          <IconItem icon={Icon.Tezos} title="Tezos" />
          <IconItem icon={Icon.Transfer} title="Transfer" />
          <IconItem icon={Icon.Trending} title="Trending" />
          <IconItem icon={Icon.TrendingFilled} title="TrendingFilled" />
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
          <IconItem icon={Icon.GiftSolid} title="GiftSolid" />
          <IconItem icon={Icon.ZoomIn} title="ZoomIn" />
          <IconItem icon={Icon.ZoomOut} title="ZoomOut" />
          <IconItem icon={Icon.RotateCcw} title="RotateCcw" />
          <IconItem icon={Icon.RotateCw} title="RotateCw" />
          <IconItem icon={Icon.InformationCircle} title="InformationCircle" />
          <IconItem icon={Icon.UserCircle} title="UserCircle" />
          <IconItem icon={Icon.Hourglass} title="Hourglass" />
          <IconItem icon={Icon.DarkMode} title="DarkMode" />
          <IconItem icon={Icon.QrCode} title="QrCode" />
          <IconItem icon={Icon.Refresh} title="Refresh" />
          <IconItem icon={Icon.Eye} title="Eye" />
          <IconItem icon={Icon.EyeOff} title="EyeOff" />
          <IconItem icon={Icon.EyeOffV2} title="EyeOffV2" />
          <IconItem icon={Icon.Location} title="Location" />
          <IconItem icon={Icon.Lock} title="Lock" />
          <IconItem icon={Icon.UnLocked} title="UnLocked" />

          <IconItem icon={Icon.Download} title="Download" />
          <IconItem icon={Icon.Download2} title="Download2" />
          <IconItem icon={Icon.Download3} title="Download3" />
          <IconItem icon={Icon.BellRinging} title="BellRinging" />
          <IconItem icon={Icon.BellPlus} title="BellPlus" />
          <IconItem icon={Icon.BellMinus} title="BellMinus" />
          <IconItem icon={Icon.BellOff} title="BellOff" />
          <IconItem icon={Icon.Trash} title="Trash" />
          <IconItem
            icon={Icon.PhonePortraitOutline}
            title="PhonePortraitOutline"
          />
          <IconItem icon={Icon.CreditCard} title="CreditCard" />
          <IconItem icon={Icon.Receipt} title="Receipt" />
          <IconItem icon={Icon.AddPhoto} title="AddPhoto" />
          <IconItem icon={Icon.PauseOutline} title="PauseOutline" />
          <IconItem icon={Icon.RaffleHorizontal} title="RaffleHorizontal" />
          <IconItem icon={Icon.CreatorChannel} title="CreatorChannel" />
          <IconItem
            icon={Icon.CreatorChannelFilled}
            title="CreatorChannelFilled"
          />
          <IconItem icon={Icon.CreatorChannelType} title="CreatorChannelType" />
          <IconItem icon={Icon.FreeDropType} title="FreeDropType" />
          <IconItem icon={Icon.GiftV2} title="GiftV2" />
          <IconItem icon={Icon.LockRounded} title="LockRounded" />
          <IconItem icon={Icon.MusicDropType} title="MusicDropType" />
          <IconItem icon={Icon.Music} title="Music" />
          <IconItem icon={Icon.Shopping} title="Shopping" />
          <IconItem icon={Icon.Sendv2} title="Sendv2" />
          <IconItem icon={Icon.Messagev2} title="Messagev2" />
          <IconItem icon={Icon.RaffleBadge} title="RaffleBadge" />
          <IconItem icon={Icon.MusicBadge} title="MusicBadge" />
          <IconItem icon={Icon.LockBadge} title="LockBadge" />
          <IconItem icon={Icon.Songs} title="Songs" />
          <IconItem icon={Icon.Saved} title="Saved" />
          <IconItem icon={Icon.Tokens} title="Tokens" />
          <IconItem icon={Icon.Photo} title="Photo" />
          <IconItem icon={Icon.Gallery} title="Gallery" />
          <IconItem icon={Icon.PieChart} title="PieChart" />
          <IconItem icon={Icon.GrowthArrow} title="GrowthArrow" />
          <IconItem icon={Icon.ShowtimeRounded} title="ShowtimeRounded" />
          <IconItem icon={Icon.AccessTicket} title="AccessTicket" />
          <IconItem icon={Icon.ArrowTopRounded} title="ArrowTopRounded" />
          <IconItem icon={Icon.GoldHexagon} title="GoldHexagon" />
          <IconItem icon={Icon.LockV2} title="LockV2" />
        </View>

        <View tw="h-10" />
        <Text tw="text-xl font-bold">Social Icons</Text>
        <View tw="flex flex-row flex-wrap bg-white">
          <IconItem icon={Icon.Showtime} title="Showtime" />
          <IconItem icon={Icon.ShowtimeGradient} title="ShowtimeGradient" />
          <IconItem icon={Icon.Twitter} title="Twitter" />
          <IconItem icon={Icon.Facebook} title="Facebook" />
          <IconItem icon={Icon.OpenSea} title="OpenSea" />
          <IconItem icon={Icon.Instagram} title="Instagram" />
          <IconItem icon={Icon.InstagramColorful} title="InstagramColorful" />
          <IconItem icon={Icon.Facebook} title="Facebook" />
          <IconItem icon={Icon.Apple} title="Apple" />
          <IconItem icon={Icon.GoogleOriginal} title="GoogleOriginal" />
          <IconItem icon={Icon.Github} title="Github" />
          <IconItem icon={Icon.TwitterOutline} title="TwitterOutline" />
          <IconItem icon={Icon.SpotifyPure} title="SpotifyPure" />
          <IconItem icon={Icon.Spotify} title="Spotify" />
          <IconItem icon={Icon.X} title="X" />
        </View>
        <Button
          tw="web:fixed web:right-40 absolute right-10 z-10"
          onPress={() => {
            setColorIndex(() =>
              colorIndex < COLORS_LIST.length - 1 ? colorIndex + 1 : 0
            );
          }}
        >
          Changed Color
        </Button>
      </View>
    </IconContext.Provider>
  );
};
