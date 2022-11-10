import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Platform, TextInput } from "react-native";

import * as Localization from "expo-localization";

import { Button } from "@showtime-xyz/universal.button";
import {
  CountryCodePicker,
  data,
} from "@showtime-xyz/universal.country-code-picker";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronLeft, Close, Search } from "@showtime-xyz/universal.icon";
import { Input } from "@showtime-xyz/universal.input";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { SafeAreaView } from "@showtime-xyz/universal.safe-area";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { yup } from "app/lib/yup";

import { LoginInputField } from "./login-input-field";

type PhoneNumberPickerProp = {
  handleSubmitPhoneNumber: any;
};

export const PhoneNumberPicker = (props: PhoneNumberPickerProp) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState(
    () => data.find((item) => item.code === Localization.region)?.code || "US"
  );

  const selectedCountry = useMemo(() => {
    return data.find((item) => item.code === country);
  }, [country]);

  const phoneNumberValidationSchema = useMemo(
    () =>
      yup
        .object({
          data: yup
            .number()
            .required("Please enter a valid phone number.")
            .typeError("Please enter a valid phone number."),
        })
        .required(),
    []
  );

  const filteredData = useMemo(() => {
    return search
      ? data.filter((item) => {
          return item.name.toLowerCase().includes(search.toLowerCase());
        })
      : data;
  }, [search]);

  const leftElement = useMemo(() => {
    return (
      <PressableScale
        onPress={() => {
          setSearch("");
          setModalVisible(true);
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          marginTop: Platform.select({
            android: 7,
            default: 0,
          }),
          height: 28,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            marginTop: Platform.select({
              android: -4,
              default: 0,
            }),
            marginRight: 1,
          }}
        >
          {selectedCountry?.emoji}
        </Text>
        <Text tw="text-base font-semibold text-gray-600 dark:text-gray-400">
          {selectedCountry?.dial_code}{" "}
        </Text>
      </PressableScale>
    );
  }, [selectedCountry]);

  const onSubmit = useCallback(
    (phoneNumber: string) =>
      props.handleSubmitPhoneNumber(
        `${selectedCountry?.dial_code}${phoneNumber}`
      ),
    [props, selectedCountry]
  );

  const textInputRef = useRef<TextInput>(null);

  const handleModalHide = useCallback(() => {
    setModalVisible(false);

    // reset focus to phone input on country picker close
    textInputRef.current?.focus();
  }, []);

  const handleCountrySelect = useCallback(
    (value: any) => {
      setCountry(value);
      handleModalHide();
    },
    [handleModalHide]
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
          <CountryCodePicker
            data={filteredData}
            value={country}
            onChange={handleCountrySelect}
            tw="mx-auto w-full max-w-screen-sm"
          />
        </View>
      </Modal>

      <LoginInputField
        key="login-phone-number-field"
        validationSchema={phoneNumberValidationSchema}
        label="Phone number"
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        textInputRef={textInputRef}
        signInButtonLabel="Send Code"
        leftElement={leftElement}
        onSubmit={onSubmit}
      />
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

      <View tw={["my-2 mx-2 flex-1", twCenter]}>
        {showSearch ? (
          <Input placeholder="Search" autoFocus onChangeText={handleSearch} />
        ) : (
          <Text
            onPress={onPressTitle}
            tw="font-space-bold px-4 py-3.5 text-lg font-bold dark:text-white"
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
