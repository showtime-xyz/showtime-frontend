import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
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
];
const PROFILE_REPORT_LIST = ["They are pretending to be someone else"];

export const ReportModal = () => {
  const router = useRouter();
  const { report } = useReport();
  const isDark = useIsDarkMode();
  const [nftId] = useParam("nftId");
  const [userId] = useParam("userId");
  console.log(userId, nftId);
  const reportOption = nftId ? NFT_REPORT_LIST : PROFILE_REPORT_LIST;
  return (
    <View>
      <View tw="px-4 pt-4 pb-8">
        <Text tw="text-lg text-gray-900 dark:text-white">
          Why are you reporting this?
        </Text>
      </View>
      <View tw="h-px bg-gray-200 dark:bg-gray-800 md:bg-transparent" />
      {reportOption.map((item, i) => (
        <>
          <PressableScale
            onPress={async () => {
              await report({ nftId, userId, description: item });
              router.pop();
            }}
            key={i.toString()}
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
          </PressableScale>
          <View tw="h-px bg-gray-200 dark:bg-gray-800 md:bg-transparent" />
        </>
      ))}
      <PressableScale>
        <View tw="flex-row items-center justify-between p-4">
          <Text tw="flex-1 text-sm font-medium text-gray-900 dark:text-white">
            Something else
          </Text>
          <View tw="w-2" />
          <ChevronRight
            width={24}
            height={24}
            color={isDark ? colors.gray[200] : colors.gray[700]}
          />
        </View>
      </PressableScale>
    </View>
  );
};
