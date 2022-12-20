import { useState } from "react";

import { Accordion } from "@showtime-xyz/universal.accordion";
import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useReport } from "app/hooks/use-report";
import { createParam } from "app/navigation/use-param";

type Query = {
  nftId: string;
  userId: string;
};

const { useParam } = createParam<Query>();
const NFT_REPORT_LIST = [
  "I just don't like it",
  "It's spam",
  "Not safe for work",
  "Scam or fraud",
  "It's not original content",
];
const PROFILE_REPORT_LIST = ["They are pretending to be someone else"];

export const ReportModal = () => {
  const router = useRouter();
  const { report } = useReport();
  const isDark = useIsDarkMode();
  const [nftId] = useParam("nftId");
  const [userId] = useParam("userId");
  const [description, setDescription] = useState("");
  const reportOption = nftId ? NFT_REPORT_LIST : PROFILE_REPORT_LIST;
  return (
    <View>
      <View tw="px-4 pt-4 pb-8">
        <Text tw="text-lg text-gray-900 dark:text-white">
          Why are you reporting this?
        </Text>
      </View>
      <View tw="h-px bg-gray-100 dark:bg-gray-800" />
      {reportOption.map((item, i) => (
        <View key={i.toString()}>
          <Pressable
            onPress={async () => {
              await report({ nftId, userId, description: item });
              router.pop();
            }}
          >
            <View tw="flex-row items-center justify-between p-4">
              <Text tw="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                {item}
              </Text>
              <View tw="w-2" />
              <ChevronRight
                width={24}
                height={24}
                color={isDark ? colors.gray[200] : colors.gray[700]}
              />
            </View>
          </Pressable>
          <View tw="h-px bg-gray-100 dark:bg-gray-800" />
        </View>
      ))}
      <Accordion.Root>
        <Accordion.Item value="open">
          <Accordion.Trigger>
            <View tw="w-full flex-row items-center justify-between pr-1">
              <Text tw="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                Something else
              </Text>
              <Accordion.Chevron rotazeZ={["right", "bottom"]} />
            </View>
          </Accordion.Trigger>
          <Accordion.Content tw="pt-0">
            <Fieldset
              tw="flex-1"
              containerStyle={{ padding: 20 }}
              label="Description"
              multiline
              textAlignVertical="top"
              placeholder="What are you trying to report?"
              value={description}
              numberOfLines={3}
              onChangeText={setDescription}
            />
            <Button
              variant="primary"
              size="regular"
              tw="mt-4"
              onPress={async () => {
                await report({ nftId, userId, description });
                router.pop();
              }}
            >
              Submit
            </Button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </View>
  );
};
