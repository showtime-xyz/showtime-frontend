import { useState } from "react";
import useUnmountSignal from "use-unmount-signal";
import useSWR from "swr";

import { View, Text, Button } from "design-system";
import { Media } from "design-system/card/media";
import { createParam } from "app/navigation/use-param";
import { axios } from "app/lib/axios";
import { Close, MoreHorizontal } from "design-system/icon";
import { useRouter } from "app/navigation/use-router";
import { tw } from "design-system/tailwind";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { Social } from "design-system/card/social";
import { Collection } from "design-system/card/rows/collection";
import { Title } from "design-system/card/rows/title";
import { Description } from "design-system/card/rows/description";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

function NftScreen() {
  const router = useRouter();
  const unmountSignal = useUnmountSignal();
  const [nftId, setNftId] = useParam("id");
  const [url, setUrl] = useState(`/v2/nft_detail/${nftId}`);
  const { data, error } = useSWR([url], (url) =>
    axios({ url, method: "GET", unmountSignal })
  );
  const nft = data?.data;

  if (error) {
    console.error(error);
  }

  return (
    <View tw="flex-1 bg-gray-200 dark:bg-black">
      <View tw="p-6 h-16 flex-row items-center justify-between">
        <View tw="w-8 h-8">
          <Button
            onPress={router.pop}
            variant="tertiary"
            tw="h-8 rounded-full p-2"
            iconOnly={true}
          >
            <Close
              width={24}
              height={24}
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
            />
          </Button>
        </View>
        <View tw="w-8 h-8">
          <Button
            onPress={router.pop}
            variant="tertiary"
            tw="h-8 rounded-full p-2"
            iconOnly={true}
          >
            <MoreHorizontal
              width={24}
              height={24}
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
            />
          </Button>
        </View>
      </View>

      <PinchToZoom>
        <Media nfts={[nft]} />
      </PinchToZoom>

      <Social nft={nft} />

      <Title nft={nft} />

      <Description nft={nft} />

      <Collection nft={nft} />
    </View>
  );
}

export { NftScreen };
