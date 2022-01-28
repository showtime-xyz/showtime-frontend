import { useState, Suspense } from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { View, Spinner, Text, Button, Skeleton } from "design-system";
import { Ethereum, MoreHorizontal, Tezos } from "design-system/icon";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { useColorScheme } from "design-system/hooks";
import { tw } from "design-system/tailwind";
import { Dimensions, Platform, SafeAreaView, StatusBar } from "react-native";
import { useUser } from "app/hooks/use-user";
import { formatAddressShort } from "app/lib/utilities";
// move to constant
const TAB_LIST_HEIGHT = 64;
const CONTENT_START = TAB_LIST_HEIGHT * 2;
// variant="text-3xl" no intillisense

const Setting = (props) => {
  const children = props.children;
  return <View>{children}</View>;
};

const SettingSubTitle = (props) => {
  const children = props.children;
  return (
    <View tw="flex flex-row justify-between px-4 py-4 items-center">
      {children}
    </View>
  );
};

const SettingSlot = (props) => {
  const address = props.address;
  const ensDomain = props.ensDomain;
  const display = ensDomain ? ensDomain : formatAddressShort(address);
  return (
    <View tw="flex-1 flex-row justify-between w-full p-4 max-h-[150px]">
      <View tw="justify-center">
        <Text tw="text-gray-900 dark:text-white">Icon</Text>
      </View>
      <View tw="flex-1 px-4">
        <Text tw="text-gray-900 dark:text-white pb-3 text-base">{display}</Text>
        <Text tw="text-gray-900 dark:text-white pb-3">Multi</Text>

        <Text tw="text-gray-900 dark:text-white text-xs pb-3">{address}</Text>

        <Text tw="text-gray-900 dark:text-white">Multi</Text>
      </View>
      <Text tw="text-gray-900 dark:text-white">Button w/ Label</Text>
    </View>
  );
};

const SettingEmail = (props) => {
  const email = props.email;
  return (
    <View tw="flex-1 flex-row justify-between w-full p-4 items-center">
      <Text tw="text-gray-900 dark:text-white font-bold">{email}</Text>
      <Button iconOnly={true} variant="tertiary">
        <MoreHorizontal />
      </Button>
    </View>
  );
};

// skeleton

const SettingWalletSkeleton = () => {
  const colorMode = useColorScheme();
  return (
    <View tw="flex-1 flex-row justify-between w-full p-4 max-h-[150px]">
      <View tw="flex justify-center">
        <Skeleton
          height={25}
          width={25}
          show={true}
          colorMode={colorMode as any}
          radius="round"
        >
          <Animated.View entering={FadeIn}></Animated.View>
        </Skeleton>
      </View>
      <View tw="px-4">
        <View tw="pb-3">
          <Skeleton
            height={16}
            width={128}
            show={true}
            colorMode={colorMode as any}
          >
            <Animated.View entering={FadeIn}></Animated.View>
          </Skeleton>
        </View>
        <View tw="pb-3">
          <Skeleton
            height={16}
            width={256}
            show={true}
            colorMode={colorMode as any}
          >
            <Animated.View entering={FadeIn}></Animated.View>
          </Skeleton>
        </View>
        <View tw="pb-3">
          <Skeleton
            height={32}
            width={300}
            show={true}
            colorMode={colorMode as any}
          >
            <Animated.View entering={FadeIn}></Animated.View>
          </Skeleton>
        </View>
        <View>
          <Skeleton
            height={16}
            width={300}
            show={true}
            colorMode={colorMode as any}
          >
            <Animated.View entering={FadeIn}></Animated.View>
          </Skeleton>
        </View>
      </View>
      {/* <Skeleton
        height={16}
        width={100}
        show={true}
        colorMode={colorMode as any}
      >
        <Animated.View entering={FadeIn}></Animated.View>
      </Skeleton> */}
    </View>
  );
};

const SettingEmailSkeleton = () => {
  const colorMode = useColorScheme();
  return (
    <View tw="p-4">
      <View tw="pb-3">
        <Skeleton
          height={16}
          width={128}
          show={true}
          colorMode={colorMode as any}
        >
          <Animated.View entering={FadeIn}></Animated.View>
        </Skeleton>
      </View>
      <View tw="pb-3">
        <Skeleton
          height={32}
          width={300}
          show={true}
          colorMode={colorMode as any}
        >
          <Animated.View entering={FadeIn}></Animated.View>
        </Skeleton>
      </View>
    </View>
  );
};

const SettingWalletHeader = () => (
  <SettingSubTitle>
    <Text tw="text-gray-900 dark:text-white font-bold text-xl">
      Your Wallets
    </Text>
    <Button variant="tertiary">Add Wallet</Button>
  </SettingSubTitle>
);

const SettingEmailsHeader = () => (
  <SettingSubTitle>
    <Text tw="text-gray-900 dark:text-white font-bold text-xl">
      Manage your emails
    </Text>
    <Button variant="tertiary" size="regular">
      Add Wallet
    </Button>
  </SettingSubTitle>
);

const SettingsTabs = () => {
  const [selected, setSelected] = useState(0);
  const { user } = useUser();
  const emailWallets = user?.data.profile.wallet_addresses_v2.filter(
    (wallet) => wallet.is_email
  );
  const wallets = user?.data.profile.wallet_addresses_excluding_email_v2;

  const renderEmail = ({ item }) => {
    const email = item.email;
    return <SettingEmail email={email} />;
  };

  const renderWallet = ({ item }) => {
    const address = item.address;
    const ensDomain = item.ens_domain;
    const mintingEnabled = item.minting_enabled;

    return (
      <SettingSlot
        address={address}
        ensDomain={ensDomain}
        mintingEnabled={mintingEnabled}
      />
    );
  };

  const keyExtractor = (wallet) => wallet.address;

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
            <Tabs.FlatList
              data={wallets}
              keyExtractor={keyExtractor}
              renderItem={renderWallet}
              removeClippedSubviews={Platform.OS !== "web"}
              ListEmptyComponent={<SettingWalletSkeleton />}
              ListHeaderComponent={<SettingWalletHeader />}
              alwaysBounceVertical={false}
              minHeight={Dimensions.get("window").height}
              ItemSeparatorComponent={() => <View tw="h-[1px] bg-gray-200" />}
            />
          </Setting>
          <Setting>
            <Tabs.FlatList
              data={emailWallets}
              keyExtractor={keyExtractor}
              renderItem={renderEmail}
              removeClippedSubviews={Platform.OS !== "web"}
              ListEmptyComponent={<SettingEmailSkeleton />}
              ListHeaderComponent={<SettingEmailsHeader />}
              alwaysBounceVertical={false}
              minHeight={Dimensions.get("window").height}
              ItemSeparatorComponent={() => <View tw="h-[1px] bg-gray-200" />}
            />
          </Setting>
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

export function Settings() {
  return <SettingsTabs />;
}
