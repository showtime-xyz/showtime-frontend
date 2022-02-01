import { Modal, Pressable, SafeAreaView } from "react-native";
import { CountryCodePicker, View, Text } from "design-system";
import { useMemo, useState } from "react";
import { yup } from "../../lib/yup";
import { LoginInputField } from "./login-input-field";
import { Button } from "design-system/button";
import { ChevronLeft, Search } from "design-system/icon";
import { tw } from "design-system/tailwind";
import data from "design-system/country-code-picker/country-code-data";

type PhoneNumberPickerProp = {
  handleSubmitPhoneNumber: any;
};

export const PhoneNumberPicker = (props: PhoneNumberPickerProp) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [country, setCountry] = useState("US");

  const selectedCountry = useMemo(() => {
    return data.find((item) => item.code === country);
  }, [country]);

  const phoneNumberValidationSchema = useMemo(
    () =>
      yup
        .object({
          data: yup
            .string()
            .phone("US", false, "Please enter a valid phone number.")
            .required("Please enter a valid phone number."),
        })
        .required(),
    []
  );

  return (
    <>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        animationType="slide"
      >
        <SafeAreaView>
          <Header
            title="Choose your country"
            close={() => setModalVisible(false)}
          />
          <View tw="bg-white dark:bg-gray-900">
            <CountryCodePicker
              data={data}
              value={country}
              onChange={setCountry}
            />
          </View>
        </SafeAreaView>
      </Modal>
      <LoginInputField
        key="login-phone-number-field"
        validationSchema={phoneNumberValidationSchema}
        label="Phone number"
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        signInButtonLabel="Send"
        leftElement={
          <Pressable
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text tw="pt-[6px]">
              {selectedCountry?.emoji} {selectedCountry?.dial_code}{" "}
            </Text>
          </Pressable>
        }
        onSubmit={props.handleSubmitPhoneNumber}
      />
    </>
  );
};

type Props = {
  title?: string;
  close?: () => void;
};

export function Header({ title, close }: Props) {
  return (
    <View tw="p-4 flex-row items-center justify-between">
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
      <Text variant="text-lg" tw="dark:text-white font-bold">
        {title}
      </Text>
      <View tw="w-12 h-12 justify-center items-center">
        <Button
          onPress={close}
          variant="tertiary"
          tw="rounded-full h-12 w-12"
          iconOnly={true}
        >
          <Search
            width={24}
            height={24}
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Button>
      </View>
    </View>
  );
}
