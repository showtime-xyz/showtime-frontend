import { Platform, useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  CreditCard,
  Check,
  ArrowBottom,
  Trash,
} from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { breakpoints } from "design-system/theme";

import { SettingItemSeparator } from "../setting-item-separator";
import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export type BillingTabProps = {
  index?: number;
};
const CreditCardItem = ({ isDefault }: { isDefault: boolean }) => {
  const isDark = useIsDarkMode();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  return (
    <View tw="flex-row justify-between py-3.5">
      <View tw="flex-row items-center justify-center">
        <View tw="self-start md:self-center">
          <CreditCard
            width={isMdWidth ? 24 : 16}
            height={isMdWidth ? 24 : 16}
            color={isDark ? colors.white : colors.black}
          />
        </View>
        <View tw="ml-2 flex-col items-start md:ml-0 md:flex-row md:items-center">
          <Text tw="ml-0 text-sm font-medium text-gray-900 dark:text-white md:ml-2 md:text-base">
            Ending in 1234
          </Text>
          <View tw="mx-2 h-2 w-0 rounded-full bg-black dark:bg-white md:h-[2px] md:w-[2px]" />
          <Text tw="text-sm font-medium text-gray-500 dark:text-gray-200 md:text-base">
            Expiry 04/28
          </Text>
        </View>
      </View>
      <View tw="flex-row">
        <Button
          size="small"
          variant="tertiary"
          style={isDefault ? { backgroundColor: colors.lime[200] } : {}}
          onPress={() => {}}
        >
          {isDefault ? (
            <>
              <Check color={colors.gray[900]} />
              <Text tw="ml-1 text-xs font-bold">Set as Default</Text>
            </>
          ) : (
            "Set as Default"
          )}
        </Button>
        <Button
          size="small"
          tw="ml-2"
          iconOnly={!isMdWidth}
          variant={isMdWidth ? "tertiary" : "danger"}
          onPress={() => {}}
        >
          {isMdWidth ? "Remove" : <Trash />}
        </Button>
      </View>
    </View>
  );
};
const HistoryItem = () => {
  const isDark = useIsDarkMode();
  return (
    <View tw="flex-row justify-between py-3.5">
      <View tw="flex-col items-start justify-center md:flex-row md:items-center">
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          NFT Name Goes Here Hihi
        </Text>
        <View tw="h-2 w-0 md:w-6" />
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          @creatornamegoeshere11
        </Text>
        <View tw="h-2 w-0 md:w-6" />
        <Text tw="text-sm font-medium text-gray-900 dark:text-white md:text-base">
          Dec 26, 2023
        </Text>
      </View>
      <View tw="flex-row">
        <Button size="small" variant="tertiary" iconOnly>
          <ArrowBottom color={isDark ? colors.white : colors.black} />
        </Button>
      </View>
    </View>
  );
};
export const BillingTab = ({ index = 0 }: BillingTabProps) => {
  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Billing"
        desc="Manage the payment methods connected to your profile."
        buttonText="Add payment method"
        onPress={() => {
          console.log("Add payment method");
        }}
      />
      <View tw="mt-6 px-4 md:px-0">
        {[1, 2].map((item) => (
          <CreditCardItem key={item} isDefault={item === 1} />
        ))}
        <SettingItemSeparator tw="my-2 md:my-8" />
        <SettingsTitle
          title="History"
          titleTw="text-lg font-bold text-gray-900 dark:text-white"
          buttonText="Download full history"
          buttonProps={{
            variant: "tertiary",
          }}
          tw="-mx-4 md:mx-0"
          onPress={() => {
            console.log("Download full history");
          }}
        />
        <View>
          {new Array(10).fill(0).map((item, index) => (
            <HistoryItem key={index} />
          ))}
        </View>
      </View>
    </SettingScrollComponent>
  );
};
