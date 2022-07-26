import { Dimensions, StyleSheet } from "react-native";

import { Meta } from "@storybook/react";

import { Image } from "@showtime-xyz/universal.image";
import { View } from "@showtime-xyz/universal.view";

import { LightBoxProvider, LightBox } from "./index";

export default {
  component: LightBox,
  title: "Components/LightBox",
} as Meta;
const { width } = Dimensions.get("window");

const LightBoxBasic = () => {
  return (
    <View tw="flex-1 items-center justify-center">
      <LightBox
        width={120}
        height={120}
        imgLayout={{ width, height: width }}
        tapToClose
      >
        <Image
          source={{
            uri: "https://storage.googleapis.com/showtime-test/cdnv2/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/114091279957330982022734478648167430968491445987545800607311341400684004114433",
          }}
          width={120}
          height={120}
          style={StyleSheet.absoluteFillObject}
        />
      </LightBox>
    </View>
  );
};
export const Basic: React.FC<{}> = () => {
  return (
    <LightBoxProvider>
      <LightBoxBasic />
    </LightBoxProvider>
  );
};
