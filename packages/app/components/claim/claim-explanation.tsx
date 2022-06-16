import { useState, useEffect } from "react";

import { MotiView } from "moti";

import { Button } from "@showtime-xyz/universal.button";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Media } from "app/components/media";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { IEdition } from "app/types";
import { getCreatorUsernameFromNFT } from "app/utilities";

const values = [
  {
    description: "Showcase the item in your wallet everywhere.",
  },
  {
    description: "This is completely free!",
  },
  {
    description: "This NFT may unlock new features over time.",
  },
];

export const ClaimExplanation = ({
  onDone,
  edition,
}: {
  onDone: () => void;
  edition?: IEdition;
}) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setPage((p) => (p + 1) % values.length);
    }, 3000);
  }, []);

  const { data: token } = useNFTDetailByTokenId({
    //@ts-ignore
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    contractAddress: edition?.contract_address,
    tokenId: "0",
  });

  return (
    <ScrollView>
      <View tw="flex-1 p-8">
        <View tw="items-center">
          <View tw="h-60 w-60 rounded-xl shadow-xl">
            <Media
              resizeMode="contain"
              item={token?.data.item}
              tw="h-60 w-60 overflow-hidden"
            />
          </View>
        </View>
        <View tw="mt-10">
          <Text tw="text-center text-3xl text-gray-900 dark:text-white">
            Claim this free NFT from{" "}
            {getCreatorUsernameFromNFT(token?.data.item)}
          </Text>
        </View>
        <View tw="mt-10 flex-row justify-center">
          {new Array(values.length).fill(0).map((v, i) => {
            return (
              <View
                key={i}
                tw={`rounded-full bg-gray-${
                  i === page ? 400 : 200
                } dark:bg-gray-${i === page ? 100 : 500} h-2 w-2 ${
                  i > 0 ? "ml-2" : ""
                }`}
              />
            );
          })}
        </View>
        <MotiView
          key={page}
          from={{ opacity: 0 }}
          transition={{ duration: 600, type: "timing" }}
          animate={{ opacity: 1 }}
          style={tw.style("mt-10 h-30")}
        >
          <Text tw="text-center text-lg text-gray-600 dark:text-gray-400">
            {values[page].description}
          </Text>
        </MotiView>
        <View tw="mt-auto pb-10 lg:mt-10">
          <Button onPress={onDone}>Continue</Button>
        </View>
      </View>
    </ScrollView>
  );
};
