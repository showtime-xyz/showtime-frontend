import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Platform } from "react-native";

import Animated, { FadeIn } from "react-native-reanimated";

import { SafeAreaView } from "app/lib/safe-area";
import { yup } from "app/lib/yup";

import { CountryCodePicker, View, Text, Pressable } from "design-system";
import { Button } from "design-system/button";
import data from "design-system/country-code-picker/country-code-data";
import { ChevronLeft, Close, Search } from "design-system/icon";
import { Input } from "design-system/input";
import { tw } from "design-system/tailwind";

import { LoginInputField } from "./login-input-field";

type PhoneNumberPickerProp = {
  handleSubmitPhoneNumber: any;
};

export const PhoneNumberPicker = (props: PhoneNumberPickerProp) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("US");

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

  return (
    <>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={tw.style("dark:bg-black")}>
          <Header
            title="Select country"
            close={() => setModalVisible(false)}
            onSearchSubmit={(value) => setSearch(value)}
          />
        </SafeAreaView>
        <CountryCodePicker
          data={filteredData}
          value={country}
          onChange={useCallback((value) => {
            setCountry(value);
            setModalVisible(false);
          }, [])}
        />
      </Modal>
      <LoginInputField
        key="login-phone-number-field"
        validationSchema={phoneNumberValidationSchema}
        label="Phone number"
        placeholder="Enter your phone number"
        keyboardType="numeric"
        signInButtonLabel="Send"
        leftElement={useMemo(() => {
          return (
            <Pressable
              onPress={() => {
                setSearch("");
                setModalVisible(true);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              tw="flex-row items-center justify-center"
            >
              <Text
                sx={{
                  // this hack is needed to make image align with text
                  marginTop: Platform.select({
                    ios: 2,
                    android: -4,
                    default: 0,
                  }),
                  marginRight: 1,
                }}
              >
                {selectedCountry?.emoji}
              </Text>
              <Text tw="font-semibold text-gray-600 dark:text-gray-400">
                {selectedCountry?.dial_code}{" "}
              </Text>
            </Pressable>
          );
        }, [selectedCountry])}
        onSubmit={useCallback(
          (v) => props.handleSubmitPhoneNumber(selectedCountry?.dial_code + v),
          [props.handleSubmitPhoneNumber, selectedCountry]
        )}
      />
    </>
  );
};

type Props = {
  title?: string;
  close?: () => void;
  onSearchSubmit: (search: string) => void;
};

export function Header({ title, close, onSearchSubmit }: Props) {
  const [showSearch, setShowSearch] = useState(true);
  const searchDebounceTimeout = useRef<any>(null);

  const handleSearch = (text: string) => {
    if (searchDebounceTimeout.current) {
      clearTimeout(searchDebounceTimeout.current);
    }
    searchDebounceTimeout.current = setTimeout(() => {
      onSearchSubmit(text);
    }, 40);
  };

  useEffect(() => {
    if (!showSearch) {
      onSearchSubmit("");
    }
  }, [showSearch]);

  return (
    <View tw="p-4 flex-row items-center justify-between dark:bg-black">
      <View tw="w-12 h-12 justify-center items-center">
        <Button
          onPress={close}
          variant="tertiary"
          tw="rounded-full h-12 w-12"
          iconOnly={true}
        >
          <ChevronLeft
            width={24}
            height={24}
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Button>
      </View>

      <Animated.View layout={FadeIn}>
        {showSearch ? (
          <View tw="w-[210px]">
            <Input placeholder="Search" autoFocus onChangeText={handleSearch} />
          </View>
        ) : (
          <Text variant="text-lg" tw="dark:text-white font-bold">
            {title}
          </Text>
        )}
      </Animated.View>
      <View tw="w-12 h-12 justify-center items-center">
        <Button
          onPress={() => setShowSearch(!showSearch)}
          variant="tertiary"
          tw="rounded-full h-12 w-12"
          iconOnly={true}
        >
          {showSearch ? (
            <Close
              width={24}
              height={24}
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
            />
          ) : (
            <Search
              width={24}
              height={24}
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
            />
          )}
        </Button>
      </View>
    </View>
  );
}
