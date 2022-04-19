import { useRouter } from "app/navigation/use-router";

import { View, Text, Button, ButtonLabel, Pressable } from "design-system";
import ChevronRight from "design-system/icon/ChevronRight";
import { tw } from "design-system/tailwind";

import { SettingSubTitle } from "./settings-subtitle";

export const SettingAccountSlotHeader = () => {
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-gray-900 dark:text-white font-bold text-xl">
          Account
        </Text>
      </SettingSubTitle>
    </View>
  );
};

export const SettingAccountSlotFooter = () => {
  return (
    <View tw="px-4 mt-4">
      <View tw="flex flex-col items-start">
        <Text tw="text-gray-900 dark:text-white font-bold text-base">
          Delete Account
        </Text>
        <Text tw="text-gray-500 dark:text-white text-base mt-1 mb-2">
          This action cannot be undone.
        </Text>
        <View tw="flex flex-row">
          <Button variant="danger" size="small">
            <ButtonLabel>Delete Account</ButtonLabel>
          </Button>
        </View>
      </View>
    </View>
  );
};

export type AccountSettingItemProps = {
  id: number | string;
  title: string;
  subRoute: string;
};

export const AccountSettingItem = (props: AccountSettingItemProps) => {
  const router = useRouter();

  const handleOnPressItem = (route: string) => {
    router.push(`/settings/${route}`);
  };

  return (
    <Pressable
      tw="flex-1 flex-row justify-between w-full p-4 items-center"
      onPress={() => handleOnPressItem(props.subRoute)}
    >
      <View tw="flex flex-col">
        <Text tw="text-gray-900 dark:text-white pb-3">{props.title}</Text>
      </View>
      <View tw="w-8 h-8">
        <ChevronRight
          width={24}
          height={24}
          color={tw.style("dark:bg-gray-700 bg-gray-300").backgroundColor}
        />
      </View>
    </Pressable>
  );
};
