import { Suspense, useState } from "react";
import { Platform } from "react-native";
import useUnmountSignal from "use-unmount-signal";
import useSWR from "swr";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Pressable, ScrollView, Spinner } from "design-system";
import { Media } from "design-system/media";
import { createParam } from "app/navigation/use-param";
import { axios } from "app/lib/axios";
import { Close } from "design-system/icon";
import { useRouter } from "app/navigation/use-router";
import { tw } from "design-system/tailwind";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { Social } from "design-system/card/social";
import { Collection } from "design-system/card/rows/collection";
import { Title } from "design-system/card/rows/title";
import { Description } from "design-system/card/rows/description";
import { Comments } from "design-system/comments";
import type { NFT } from "app/types";
import { NFTDropdown } from "app/components/nft-dropdown";
import { Owner } from "design-system/card/rows/owner";
import { LikedBy } from "design-system/liked-by";
import { NFT_DETAIL_API } from "app/utilities";
// import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";

// const TAB_LIST_HEIGHT = 64;

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

function Nft({ nft }: { nft: NFT }) {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Collection nft={nft} />

      <PinchToZoom>
        <Media item={nft} numColumns={1} />
      </PinchToZoom>

      <Social nft={nft} />

      <LikedBy nft={nft} />

      <Title nft={nft} />

      <Description nft={nft} />

      <Owner nft={nft} price={true} />
    </ScrollView>
  );
}

function NftScreen() {
  const { top: topSafeArea } = useSafeAreaInsets();
  const router = useRouter();
  const unmountSignal = useUnmountSignal();
  const [nftId, setNftId] = useParam("id");
  const { data, error } = useSWR<{ data: NFT }>(
    `${NFT_DETAIL_API}/${nftId}`,
    (url) => axios({ url, method: "GET", unmountSignal })
  );
  const nft = data?.data;
  const [selected, setSelected] = useState(0);

  if (error) {
    console.error(error);
  }

  return (
    <View
      tw={[
        "flex-1 bg-white dark:bg-black",
        Platform.OS === "web" || Platform.OS === "android"
          ? `pt-[${topSafeArea}px]`
          : "",
      ]}
    >
      <View tw="px-4 h-16 flex-row items-center justify-between">
        <Pressable onPress={router.pop}>
          <Close
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
            width={24}
            height={24}
          />
        </Pressable>
        <NFTDropdown nft={nft} />
      </View>

      <Nft nft={nft} />

      {/* <Suspense fallback={<Spinner />}>
        <Comments nft={nft} />
      </Suspense> */}

      {/* <Tabs.Root
        onIndexChange={setSelected}
        initialIndex={selected}
        tabListHeight={TAB_LIST_HEIGHT}
        lazy
      >
        <Tabs.Header>
          <Nft nft={nft} />
        </Tabs.Header>
        <Tabs.List
          style={tw.style(
            `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900`
          )}
        >
          <Tabs.Trigger key="comments">
            <TabItem name="Comments" selected={selected === 0} />
          </Tabs.Trigger>
          <Tabs.Trigger key="listings">
            <TabItem name="Listings" selected={selected === 1} />
          </Tabs.Trigger>
          <Tabs.Trigger key="activity">
            <TabItem name="Activity" selected={selected === 2} />
          </Tabs.Trigger>
          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager>
          <Suspense fallback={<Spinner />}>
            <Comments nft={nft} />
          </Suspense>
        </Tabs.Pager>
      </Tabs.Root> */}
    </View>
  );
}

export { NftScreen };
