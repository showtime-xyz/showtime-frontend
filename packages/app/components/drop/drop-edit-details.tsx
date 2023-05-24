import { useState, useMemo, useEffect } from "react";
import { Platform } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { ErrorText } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InformationCircle } from "@showtime-xyz/universal.icon";
import { Label } from "@showtime-xyz/universal.label";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { Screen } from "app/components/screen";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useUpdatePresaveReleaseDate } from "app/hooks/use-update-presave-release-date";
import { yup } from "app/lib/yup";
import { createParam } from "app/navigation/use-param";

import { DateTimePicker } from "design-system/date-time-picker";

import { CopySpotifyLinkTutorial } from "./copy-spotify-link-tutorial";

const dropValidationSchema = yup.object({
  spotifyUrl: yup.string().optional().nullable(),
  appleMusicUrl: yup.string().optional().nullable(),
});
type Query = {
  contractAddress: string;
};

const { useParam } = createParam<Query>();
export const DropEditDetails = () => {
  const isDark = useIsDarkMode();
  const [contractAddress] = useParam("contractAddress");
  const { data } = useCreatorCollectionDetail(contractAddress);
  console.log(data);

  const defaultValues = useMemo(() => {
    return {
      title: data?.creator_airdrop_edition.name || "",
      description: data?.creator_airdrop_edition.description || "",
    };
  }, [
    data?.creator_airdrop_edition.description,
    data?.creator_airdrop_edition.name,
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues,
  });

  const router = useRouter();

  useEffect(() => {
    resetForm(defaultValues);
  }, [resetForm, defaultValues]);

  const onSubmit = async (values: typeof defaultValues) => {
    console.log(values);

    router.pop();
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetScrollView>
        <View tw="w-full px-4">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Title"
                  placeholder="Sweet"
                  onBlur={onBlur}
                  errorText={errors.title?.message}
                  value={value}
                  onChangeText={onChange}
                  numberOfLines={2}
                  multiline
                />
              );
            }}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  tw="mt-4"
                  label="Description"
                  placeholder="Why should people collect this drop?"
                  multiline
                  textAlignVertical="top"
                  onBlur={onBlur}
                  errorText={errors.description?.message}
                  value={value}
                  numberOfLines={3}
                  onChangeText={onChange}
                />
              );
            }}
          />
          <Button tw="mt-4" onPress={handleSubmit(onSubmit)} disabled={false}>
            {"Submit"}
          </Button>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModalProvider>
  );
};
