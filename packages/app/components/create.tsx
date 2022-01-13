import {
  View,
  Text,
  Fieldset,
  ScrollView,
  Select,
  Checkbox,
} from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { Close } from "design-system/icon";
import { Image } from "design-system/image";
import { tw } from "design-system/tailwind";
import { useState } from "react";
import { Pressable } from "react-native";

function CloseButton({
  onPress,
  variant = "light",
  size = "lg",
}: {
  onPress: () => void;
  variant?: "light" | "dark";
  size?: "lg" | "md";
}) {
  const dimension = size === "lg" ? 48 : 24;

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        backgroundColor: tw.color(
          variant === "light" ? "gray-100" : "gray-900"
        ),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Close
        width={size === "lg" ? 24 : 18}
        height={size === "lg" ? 24 : 18}
        color={variant === "light" ? "#000" : "#fff"}
      />
    </Pressable>
  );
}

function Create() {
  const isDark = useIsDarkMode();

  const [checked, setChecked] = useState(false);

  return (
    <ScrollView tw="p-4">
      <View tw="flex-row items-center">
        <CloseButton variant={isDark ? "dark" : "light"} onPress={() => {}} />
        <View tw="absolute w-full items-center">
          <Text tw="text-xl text-gray-900 dark:text-white font-bold">
            Create NFT
          </Text>
        </View>
      </View>
      <View tw="mt-11 flex-row">
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/PUGdxrLBiiJqxFRNfJWkVpyE3xuXC2XXsjYSgeuzX-XM_3ApI7ydBd-E1M3POKp_B8miwtoS4FHhDAiwhyNnxX1S_ktvj-1DvZIe=w1328",
          }}
          style={{ width: 84, height: 84, borderRadius: 20 }}
        />
        <View tw="absolute top-1 left-1">
          <CloseButton size="md" variant="dark" onPress={() => {}} />
        </View>
        <View tw="ml-2 flex-1">
          <Fieldset
            label="Add a title"
            placeholder="What's the title of your nft?"
          />
        </View>
      </View>

      <View tw="mt-4 flex-row">
        <Fieldset
          tw="flex-1"
          label="Copies"
          placeholder="1"
          helperText="1 by default"
        />
        <Fieldset
          label="Price"
          placeholder="Amount"
          tw="ml-4 flex-1"
          helperText="Add a price if you wish to sell this NFT."
          select={{
            options: [{ label: "ETH", value: "a" }],
            placeholder: "ETH",
            value: "a",
          }}
        />
      </View>

      <View tw="mt-4">
        <Select
          options={[{ label: "Option A", value: "a" }]}
          placeholder="Collection"
          value="a"
        />
      </View>

      <View tw="mt-8 flex-row">
        <Checkbox
          onChange={(v) => setChecked(v)}
          checked={checked}
          accesibilityLabel="I agree to the terms and conditions"
        />
        <Pressable onPress={() => setChecked(!checked)}>
          <Text tw="ml-4 text-gray-600 dark:text-gray-400 text-sm">
            I have the rights to publish this artwork, and understand it will be
            minted on the Polygon network.
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export { Create };
