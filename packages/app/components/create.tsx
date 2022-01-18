import { View, Text, Fieldset, Select, Checkbox, Button } from "design-system";
import { ChevronUp, Close } from "design-system/icon";
import { Image } from "design-system/image";
import { tw } from "design-system/tailwind";
import { useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { useMintNFT } from "../hooks/api-hooks";
import * as FileSystem from "expo-file-system";
import { Accordion } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

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

  const isDark = useIsDarkMode();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View tw="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: tabBarHeight + 100 }}>
        <View tw="p-4">
          <View tw="mt-11 flex-row">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/PUGdxrLBiiJqxFRNfJWkVpyE3xuXC2XXsjYSgeuzX-XM_3ApI7ydBd-E1M3POKp_B8miwtoS4FHhDAiwhyNnxX1S_ktvj-1DvZIe=w1328",
              }}
              style={{ width: 84, height: 84, borderRadius: 20 }}
            />
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
            <Accordion.Root>
              <Accordion.Item value="hello">
                <Accordion.Trigger>
                  <Accordion.Label>Options</Accordion.Label>
                  <Accordion.Chevron>
                    <Button variant="tertiary" tw="rounded-full h-8 w-8">
                      <ChevronUp color={isDark ? "#fff" : "#000"} />
                    </Button>
                  </Accordion.Chevron>
                </Accordion.Trigger>
                <Accordion.Content>
                  <Fieldset
                    label="Description"
                    placeholder="Add a description"
                  />
                  <View tw="flex-row mt-4">
                    <Fieldset
                      label="Choose a collection"
                      placeholder="Collection"
                      selectOnly
                      helperText="Add to an existing collection."
                      tw="w-[48%]"
                      select={{
                        options: [{ label: "ETH", value: "a" }],
                        placeholder: "ETH",
                        value: "a",
                        size: "regular",
                      }}
                    />
                    <Fieldset
                      label="Creator Royalties"
                      placeholder="10%"
                      tw="ml-4 w-[48%]"
                      helperText="How much you'll earn each time this NFT is sold."
                      keyboardType="numeric"
                    />
                  </View>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </View>

          <View tw="mt-8 flex-row">
            <Checkbox
              onChange={(v) => setChecked(v)}
              checked={checked}
              accesibilityLabel="I agree to the terms and conditions"
            />
            <Pressable onPress={() => setChecked(!checked)}>
              <Text tw="ml-4 text-gray-600 dark:text-gray-400 text-sm">
                I have the rights to publish this artwork, and understand it
                will be minted on the Polygon network.
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View tw="absolute px-4 w-full" style={{ bottom: tabBarHeight + 16 }}>
        <Button
          onPress={handleSubmit}
          disabled={state.status !== "idle"}
          tw="h-12 rounded-full"
        >
          <Text tw="text-white dark:text-gray-900 text-sm">
            {state.status === "idle" ? "Create" : state.status}
          </Text>
        </Button>
      </View>
    </View>
  );
}

export { Create };
