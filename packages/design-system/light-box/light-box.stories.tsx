import { Dimensions } from "react-native";

import { Image } from "@showtime-xyz/universal.image";
import { View } from "@showtime-xyz/universal.view";

import { LightBoxProvider, LightBox } from "./index";

const URL =
  "https://lh3.googleusercontent.com/4NZDQhHbwkjrewCLnnuvmsXOrjNMrBCZ4xg3cS7FyJAPiT6T2vrdo3ZkVE8RwkQ-4ticjxTVjyGehJS0xOG3SW1UMEKz7qVFIjj1";
export default {
  component: LightBox,
  title: "Components/LightBox",
};

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
            uri: URL,
          }}
          width={500}
          height={500}
        />
      </LightBox>
    </View>
  );
};
export const Basic = () => {
  return (
    <LightBoxProvider>
      <LightBoxBasic />
    </LightBoxProvider>
  );
};
