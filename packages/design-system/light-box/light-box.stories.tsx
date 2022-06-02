import { Meta } from "@storybook/react";

import { View } from "@showtime-xyz/universal.view";

// import "photoswipe/dist/photoswipe.css";
import { LightBoxProvider } from "./index";
import { LightBoxImg } from "./light-box-image";

export default {
  component: LightBoxImg,
  title: "Components/LightBoxImg",
} as Meta;

const LightBoxBasic = () => {
  return (
    <View tw="flex-1 items-center justify-center">
      <LightBoxImg
        source={{
          uri: "https://storage.googleapis.com/showtime-test/cdnv2/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/114091279957330982022734478648167430968491445987545800607311341400684004114433",
        }}
        width={120}
        height={120}
        imgLayout={{
          width: 128,
          height: 128,
        }}
      />
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
