import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Platform } from "react-native";

import Animated, { FadeIn } from "react-native-reanimated";

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
  const isDark = useIsDarkMode();
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

  const leftElement = useMemo(() => {
    if (Platform.OS === "web") return null;

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
        Platform.OS === "web"
          ? `+${phoneNumber}`
          : `${selectedCountry?.dial_code}${phoneNumber}`
      ),
    [props, selectedCountry]
  );

  return (
    <>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={{ backgroundColor: isDark ? "#000" : undefined }}>
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
        keyboardType="phone-pad"
        signInButtonLabel="Send"
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
};

export function Header({ title, close, onSearchSubmit }: Props) {
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
      tw="w-full flex-row items-center px-4 py-2 dark:bg-black"
    >
      <View tw="h-12 w-12 items-center justify-center">
        <Button
          onPress={close}
          variant="tertiary"
          tw="h-12 w-12 rounded-full"
          iconOnly={true}
        >
          <ChevronLeft
            width={24}
            height={24}
            color={isDark ? "#FFF" : "#000"}
          />
        </Button>
      </View>

      <Animated.View layout={FadeIn} style={{ flex: 1, marginVertical: 8 }}>
        {showSearch ? (
          <Input placeholder="Search" autoFocus onChangeText={handleSearch} />
        ) : (
          <Text tw="font-space-bold px-4 text-lg font-bold dark:text-white">
            {title}
          </Text>
        )}
      </Animated.View>
      <View tw="h-12 w-12 items-center justify-center">
        <Button
          onPress={() => setShowSearch(!showSearch)}
          variant="tertiary"
          tw="h-12 w-12 rounded-full"
          iconOnly={true}
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
