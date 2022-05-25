import { useState, useEffect } from "react";
import { Button, Image, Text, View } from "design-system";
import { MotiView, AnimatePresence } from 'moti'
import { tw } from "design-system/tailwind";
import { Dimensions } from "react-native";

const values = [{
  title: "Gift your community a NFT", 
  description: "A reward they can showcase. Bonus: engage them with unlockable features!"
},
{
  title: "Grow your web3 presence", 
  description: "Claimers will follow you on Showtime."
},
{
  title: "Instantly tradable on OpenSea", 
  description: "And it will show up on wallets like Rainbow."
},
{
  title: "Earn royalties each trade", 
  description: "Every resale, you and your fans profit!"
},
{
  title: "Share your drop link!", 
  description: "Your following & friends can claim it for free."
}]

export const DropExplanation = ({onDone}:  {onDone: ()=> void}) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setPage(p => (p + 1) % 5)
    }, 5000)
  }, [])

  return (
    <View tw="p-8 flex-1">
      <View tw="h-30 w-30" />
      {/* Preview component here */}
      <Text tw="text-center text-4xl text-gray-900 dark:text-white">Drop Free NFTs to your followers</Text>
      <View tw="flex-row justify-center mt-10">
          {new Array(5).fill(0).map((v, i) => {
            return <View key={i} tw={`rounded-full bg-gray-${i === page ? 400 : 200} dark:bg-gray-${i === page ? 100 : 500} w-2 h-2 ${i > 0 ? 'ml-2' : ''}`} />
          })}
      </View>
          <MotiView key={page}
            from={{opacity: 0}}
            transition={{duration: 600, type:"timing"}}
            animate={{opacity: 1}}
          style={tw.style("mt-10")}>
            <Text tw='text-2xl text-center text-gray-900 dark:text-white'>{values[page].title}</Text>
            <Text tw="text-lg mt-4 text-center text-gray-600 dark:text-gray-400">{values[page].description}</Text>
          </MotiView>
      <View tw="mt-auto lg:mt-10 pb-10">
        <Button onPress={onDone}>Let's go</Button>
      </View>
    </View>
  );
};
