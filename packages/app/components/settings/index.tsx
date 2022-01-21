import { useState, Suspense } from "react";
import { View, Spinner, Text } from "design-system";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { Dimensions } from "react-native";

// move to constant
const TAB_LIST_HEIGHT = 64;

// switch theme will cause tab eeror

const SettingsTabs = () => {
  const [selected, setSelected] = useState(0);

  return (
    <View tw="bg-white dark:bg-black flex-1">
      <Tabs.Root
        onIndexChange={setSelected}
        initialIndex={selected}
        tabListHeight={TAB_LIST_HEIGHT}
        lazy
      >
        <Tabs.Header>
          <View tw="bg-white dark:bg-black pt-4 pl-4 pb-[3px]">
            <Text tw="text-gray-900 dark:text-white font-bold text-3xl">
              Settings
            </Text>
          </View>
        </Tabs.Header>
        <Tabs.List
          contentContainerStyle={{
            justifyContent: "space-between",
            width: Dimensions.get("window").width,
          }}
          style={[
            {
              height: TAB_LIST_HEIGHT,
              ...tw.style(
                "dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900"
              ),
            },
          ]}
        >
          <Tabs.Trigger>
            <TabItem name="Wallets" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Email Addresses" selected={selected === 1} />
          </Tabs.Trigger>
          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager>
          <Suspense fallback={<Spinner size="small" />}>
            <Text>k</Text>
          </Suspense>
          <Suspense fallback={<Spinner size="small" />}>
            <Text>k</Text>
          </Suspense>
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

export function Settings() {
  return (
    <View>
      <SettingsTabs />
    </View>
  );
}
