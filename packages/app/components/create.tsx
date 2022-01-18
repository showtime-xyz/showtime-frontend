import { View, Text, Fieldset, Select, Checkbox, Button } from "design-system";
import { Close } from "design-system/icon";
import { Image } from "design-system/image";
import { tw } from "design-system/tailwind";
import { useState } from "react";
import { Pressable } from "react-native";
import { useMintNFT } from "../hooks/api-hooks";
import * as FileSystem from "expo-file-system";

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
  const [checked, setChecked] = useState(false);
  const { startMinting, state } = useMintNFT();
  console.log("state ", state);
  const handleSubmit = () => {
    FileSystem.downloadAsync(
      "https://lh3.googleusercontent.com/eDuDBbt8CfAClm4XAfRPf63lZ0DCcf1elQai_43gcmnWr8nuwjXoAZF3xwmWnh5yt8BCA2URJzIJijSVjpUjBVCK-kMi7RZwTuSx=w660",
      FileSystem.documentDirectory + "test.jpg"
    )
      .then(({ uri }) => {
        const fakeData = {
          filePath: uri,
          title: "Nature",
          description: "A beautiful nature",
          notSafeForWork: false,
          editionCount: 1,
          royaltiesPercentage: 10,
        };
        console.log("Finished downloading to ", uri);
        startMinting(fakeData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View tw="p-4">
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
          keyboardType="numeric"
        />
        <Fieldset
          label="Price"
          placeholder="Amount"
          tw="ml-4 flex-1"
          helperText="Add a price if you wish to sell this NFT."
          keyboardType="numeric"
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

      <Button onPress={handleSubmit} disabled={state.status !== "idle"}>
        <Text tw="ml-4 text-white dark:text-gray-900 text-sm">
          {state.status === "idle" ? "Create" : state.status}
        </Text>
      </Button>
    </View>
  );
}

export { Create };
