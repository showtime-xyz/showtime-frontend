import { useState, Suspense } from "react";
import { View, Spinner, Text, Button } from "design-system";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { Dimensions } from "react-native";

// move to constant
const TAB_LIST_HEIGHT = 64;
const CONTENT_START = TAB_LIST_HEIGHT * 2;
// variant="text-3xl" no intillisense

const Setting = (props) => {
  const children = props.children;
  return (
    <View tw={["flex-1", "pt-4", "px-4", `mt-[${CONTENT_START}px]`]}>
      {children}
    </View>
  );
};

const SettingSubTitle = (props) => {
  const children = props.children;
  return <View tw="flex flex-row justify-between">{children}</View>;
};

const SettingSlot = (props) => {
  const children = props.children;
  return (
    <View tw="flex flex-row justify-between">
      <Text tw="text-gray-900 dark:text-white">Icon</Text>
      <Text tw="text-gray-900 dark:text-white">Multi</Text>
      <Text tw="text-gray-900 dark:text-white">Button w/ Label</Text>
    </View>
  );
};

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
          style={tw.style(
            `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900`
          )}
        >
          <Tabs.Trigger>
            <TabItem name="Wallets" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Email Addresses" selected={selected === 1} />
          </Tabs.Trigger>
          <SelectedTabIndicator disableBackground={true} />
        </Tabs.List>
        <Tabs.Pager>
          <Setting>
            <SettingSubTitle>
              <Text tw="text-gray-900 dark:text-white font-bold text-xl">
                Your Wallets
              </Text>
              <Button>Add Wallet</Button>
            </SettingSubTitle>
            <SettingSlot />
          </Setting>
          <Setting>
            <SettingSubTitle>
              <Text tw="text-gray-900 dark:text-white font-bold text-xl">
                Manage your emails
              </Text>
              <Button>Add Wallet</Button>
            </SettingSubTitle>
          </Setting>
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

export function Settings() {
  return <SettingsTabs />;
}
