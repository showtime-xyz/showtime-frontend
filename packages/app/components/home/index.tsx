import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.image";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const Home = () => {
  return (
    <View tw="w-full flex-1 items-center bg-white pt-8 dark:bg-black">
      <View tw="w-[580px]">
        <View tw="mb-8 h-[164px] w-full rounded-2xl bg-[#4710E1]"></View>
        <Text tw="text-lg text-black dark:text-white">Home V2</Text>
      </View>
    </View>
  );
};
