import { useRouter } from "app/navigation/use-router";

import { View, Text, Button, ButtonLabel, Pressable } from "design-system";
import ChevronRight from "design-system/icon/ChevronRight";
import { tw } from "design-system/tailwind";
import { useCallback } from "react";
import { FlatList } from "react-native";

import { SettingSubTitle } from "./settings-subtitle";

export const SettingAccountSlotHeader = () => {
  return (
    <View>
      <SettingSubTitle>
        <Text tw="text-gray-900 dark:text-white font-bold text-xl">
          Privacy & Security
        </Text>
      </SettingSubTitle>
    </View>
  );
};

export type SettingItemProps = {
  id: number | string;
  title: string;
  description?: string;
  route: string;
};

const list = [
    {
        id: 1,
        title: "Blocked Accounts",
        description: "Block accounts from sending you money",
        icon: "lock",
        route: "privacy-and-security",
      },
    ]

export const AccountSettingItem = (props: SettingItemProps) => {
  const router = useRouter();

  return (
    <Pressable
      tw="flex-1 flex-row justify-between w-full p-4 items-center"
      onPress={() => router.push(`/settings/${props.route}`)}
    >
      <View tw="flex flex-col items-start">
        <Text tw="text-gray-900 dark:text-white pb-3">{props.title}</Text>
        <Text tw="text-gray-900 dark:text-white pb-3">{props.description}</Text>
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

export const SettingList = ()=>{
    const renderSetting = useCallback(({item})=>{
        return (
            <AccountSettingItem {...item}/>
        )
    }, [])
    
    return (<FlatList
    data={}
    renderItem={renderSetting}
    />)
}