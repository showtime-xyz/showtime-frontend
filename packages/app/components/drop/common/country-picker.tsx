import {
  createContext,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from "react";
import { Modal, Platform, TextInput } from "react-native";

import { ListRenderItemInfo } from "@shopify/flash-list";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronLeft, Close, Search } from "@showtime-xyz/universal.icon";
import { Check } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Input } from "@showtime-xyz/universal.input";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { SafeAreaView } from "@showtime-xyz/universal.safe-area";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import {
  usePaymentSupportedCountries,
  CountryType,
} from "./use-payment-supported-countries";

type PhoneNumberPickerProp = {
  handleCountrySelect: any;
  selectedCountryCode: string;
};

export const CountryPicker = (props: PhoneNumberPickerProp) => {
  const { selectedCountryCode, handleCountrySelect } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const paymentSupportedCountries = usePaymentSupportedCountries();

  const filteredData = useMemo(() => {
    return search
      ? paymentSupportedCountries.countries.filter((item) => {
          return item.label.toLowerCase().includes(search.toLowerCase());
        })
      : paymentSupportedCountries.countries;
  }, [paymentSupportedCountries.countries, search]);

  const selectedCountry = useMemo(() => {
    return filteredData.find((item) => item.value === selectedCountryCode);
  }, [filteredData, selectedCountryCode]);

  const textInputRef = useRef<TextInput>(null);

  const handleModalHide = useCallback(() => {
    setModalVisible(false);

    // reset focus to phone input on country picker close
    textInputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (value: any) => {
      handleModalHide();
      handleCountrySelect(value);
    },
    [handleModalHide, handleCountrySelect]
  );

  return (
    <>
      <Modal
        visible={modalVisible}
        onRequestClose={handleModalHide}
        animationType="slide"
        transparent={Platform.OS === "web"}
        statusBarTranslucent={Platform.OS === "web"}
      >
        <View tw="min-h-screen bg-white dark:bg-black">
          <SafeAreaView>
            <View tw="mx-auto w-full max-w-screen-md">
              <Header
                title="Select country"
                close={handleModalHide}
                onSearchSubmit={(value) => setSearch(value)}
                twCenter="max-w-screen-sm"
              />
            </View>
          </SafeAreaView>
          <Picker
            data={filteredData}
            value={selectedCountryCode}
            onChange={handleSubmit}
          />
        </View>
      </Modal>
      <View tw="flex-1 rounded-xl bg-gray-100 p-4 dark:bg-gray-900">
        <Text tw="font-bold text-gray-900 dark:text-gray-50">
          Select Country
        </Text>
        <View tw="self-start pt-4">
          <Button
            variant="outlined"
            onPress={() => {
              setSearch("");
              setModalVisible(true);
            }}
          >
            {selectedCountry?.label ?? "Select Country"}
          </Button>
        </View>
      </View>
    </>
  );
};

type Props = {
  title?: string;
  close?: () => void;
  onSearchSubmit: (search: string) => void;
  twCenter?: string;
};

export function Header({ title, close, onSearchSubmit, twCenter = "" }: Props) {
  const isDark = useIsDarkMode();
  const [showSearch, setShowSearch] = useState(true);
  const searchDebounceTimeout = useRef<any>(null);

  const { top: safeAreaTop } = useSafeAreaInsets();

  const handleSearch = (text: string) => {
    if (searchDebounceTimeout.current) {
      clearTimeout(searchDebounceTimeout.current);
    }
    searchDebounceTimeout.current = setTimeout(() => {
      onSearchSubmit(text);
    }, 40);
  };
  const onPressTitle = () => {
    setShowSearch(true);
  };
  useEffect(() => {
    if (!showSearch) {
      onSearchSubmit("");
    }
  }, [showSearch, onSearchSubmit]);

  return (
    <View
      style={{
        marginTop: safeAreaTop,
      }}
      tw="w-full flex-row items-center justify-between bg-white px-4 py-2 dark:bg-black"
    >
      <View tw="h-12 w-12 items-center justify-center">
        <Button
          onPress={close}
          variant="tertiary"
          size="regular"
          iconOnly
          tw="bg-white px-3 dark:bg-gray-900"
        >
          <ChevronLeft
            width={24}
            height={24}
            color={isDark ? "#FFF" : "#000"}
          />
        </Button>
      </View>

      <View tw={["mx-2 my-2 flex-1", twCenter]}>
        {showSearch ? (
          <Input placeholder="Search" autoFocus onChangeText={handleSearch} />
        ) : (
          <Text
            onPress={onPressTitle}
            tw="px-4 py-3.5 text-lg font-bold dark:text-white"
          >
            {title}
          </Text>
        )}
      </View>
      <View tw="h-12 w-12 items-center justify-center">
        <Button
          onPress={() => setShowSearch(!showSearch)}
          variant="tertiary"
          size="regular"
          iconOnly
          tw="bg-white px-3 dark:bg-gray-900"
        >
          {showSearch ? (
            <Close width={24} height={24} color={isDark ? "#FFF" : "#000"} />
          ) : (
            <Search width={24} height={24} color={isDark ? "#FFF" : "#000"} />
          )}
        </Button>
      </View>
    </View>
  );
}

type CountryCodePickerProps = {
  value: string;
  onChange: (value: string) => void;
  data: CountryType[];
};

const PickerContext = createContext<any>(null);

export const Picker = (props: CountryCodePickerProps) => {
  const { onChange, value } = props;
  const sharedValue = useSharedValue(value);

  useEffect(() => {
    sharedValue.value = value;
  }, [sharedValue, value]);

  const contextValue = useMemo(() => {
    return {
      sharedValue: sharedValue,
      onChange: (item: CountryType) => {
        sharedValue.value = item.value;
        onChange(item.value);
      },
    };
  }, [onChange, sharedValue]);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CountryType>) => {
      return <PickerItem item={item} />;
    },
    []
  );
  const ItemSeparatorComponent = useCallback(
    () => <View tw="h-[1px] w-full bg-gray-200 dark:bg-gray-800" />,
    []
  );
  const keyExtractor = useCallback((item: CountryType) => item.value, []);
  return (
    <PickerContext.Provider value={contextValue}>
      <View tw="mx-auto w-full max-w-screen-sm flex-1 bg-white dark:bg-black">
        <InfiniteScrollList
          useWindowScroll={false}
          data={props.data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
          keyboardShouldPersistTaps="handled"
          estimatedItemSize={64}
        />
      </View>
    </PickerContext.Provider>
  );
};

const PickerItem = memo(({ item }: { item: CountryType }) => {
  const isDark = useIsDarkMode();
  const { onChange, sharedValue } = useContext(PickerContext);

  const handleChange = useCallback(() => {
    onChange(item);
  }, [item, onChange]);

  const style = useAnimatedStyle(() => {
    return {
      opacity: sharedValue.value === item.value ? 1 : 0,
    };
  }, [sharedValue.value]);

  return (
    <PressableScale onPress={handleChange}>
      <View tw="flex-row items-center px-8 py-5 dark:bg-black">
        <Text tw="text-sm font-semibold dark:text-gray-100">{item.label}</Text>
        <Animated.View style={[style, { marginLeft: "auto" }]}>
          <Check height={24} width={24} color={isDark ? "#FFF" : "#000"} />
        </Animated.View>
      </View>
    </PressableScale>
  );
});

PickerItem.displayName = "PickerItem";
