import { useMemo, useEffect, useState } from "react";
import { Platform } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { useAlert } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useCreatorCollectionDetail } from "app/hooks/use-creator-collection-detail";
import { useDropEditDetails } from "app/hooks/use-drop-edit-details";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { useUpdatePresaveReleaseDate } from "app/hooks/use-update-presave-release-date";
import { yup } from "app/lib/yup";
import { createParam } from "app/navigation/use-param";
import { formatAPIErrorMessage } from "app/utilities";

import { DateTimePicker } from "design-system/date-time-picker";

const dropValidationSchema = yup.object({
  spotifyUrl: yup.string().optional().nullable(),
  appleMusicUrl: yup.string().optional().nullable(),
});
type Query = {
  contractAddress: string;
  chainName: string;
  tokenId: string;
};

const { useParam } = createParam<Query>();
export const DropEditDetails = () => {
  const [contractAddress] = useParam("contractAddress");
  const [tokenId] = useParam("tokenId");
  const [chainName] = useParam("chainName");
  const { data, mutate, mutateNFT } = useNFTDetailByTokenId({
    contractAddress,
    tokenId,
    chainName,
  });
  const mutatePresaveReleaseDate = useUpdatePresaveReleaseDate(contractAddress);
  const { data: edition } = useCreatorCollectionDetail(contractAddress);

  const { editDropDetails } = useDropEditDetails();
  const [isLive, setIsLive] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const Alert = useAlert();

  const defaultValues = useMemo(() => {
    return {
      name: data?.data?.item.token_name || "",
      description: data?.data?.item.token_description || "",
      releaseDate: edition?.presave_release_date
        ? new Date(edition?.presave_release_date)
        : undefined,
    };
  }, [
    data?.data?.item.token_description,
    data?.data?.item.token_name,
    edition,
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
    mutatePresaveReleaseDate
      .trigger({
        releaseDate: isLive ? new Date() : values.releaseDate,
        spotifyUrl: edition?.spotify_track_url,
        appleMusicUrl: edition?.apple_music_track_url,
      })
      .catch((error) => {
        const errorMessage = formatAPIErrorMessage(error);
        Alert.alert("Could not update release date", errorMessage);
      });

    const res = await editDropDetails(contractAddress, values);

    if (res) {
      const data = await mutate();
      const nft = data?.data.item;
      if (!nft) return;
      if (
        Platform.OS === "web" &&
        router.pathname === "/profile/[username]/[dropSlug]"
      ) {
        const username = nft.creator_username;
        const dropSlug = nft.slug;
        router.replace(
          {
            pathname: "/profile/[username]/[dropSlug]",
            query: {
              ...router.query,
              username: username,
              dropSlug,
            },
          },
          getNFTSlug(nft),
          { shallow: true }
        );
        mutateNFT();
      } else {
        mutateNFT();
        router.pop();
      }
    }
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetScrollView>
        <View tw="w-full px-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Title"
                  placeholder="Sweet"
                  onBlur={onBlur}
                  errorText={errors.name?.message}
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

          <View tw="mt-4">
            <Controller
              key="releaseDate"
              control={control}
              name="releaseDate"
              render={({ field: { onChange, value } }) => {
                let dateValue =
                  typeof value === "string"
                    ? new Date(value)
                    : value ?? new Date();

                return (
                  <View
                    tw="mb-4 rounded-xl bg-gray-100 px-4 py-4 dark:bg-gray-900"
                    style={{
                      opacity: isLive ? 0.3 : 1,
                    }}
                  >
                    {Platform.OS !== "web" ? (
                      <Pressable
                        onPress={() => {
                          setShowDatePicker(!showDatePicker);
                        }}
                      >
                        <Text tw="font-bold text-gray-900 dark:text-white">
                          Release Date
                        </Text>
                        <Text tw="pt-4 text-base text-gray-900 dark:text-white">
                          {(dateValue as Date).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </Text>
                      </Pressable>
                    ) : (
                      <Text tw="font-bold text-gray-900 dark:text-white">
                        Release Date
                      </Text>
                    )}

                    <View tw="t-0 l-0 flex-row pt-2">
                      <DateTimePicker
                        disabled={isLive}
                        onChange={(v) => {
                          onChange(v);
                          setShowDatePicker(false);
                        }}
                        value={dateValue}
                        type="datetime"
                        open={showDatePicker}
                      />
                    </View>
                    {errors.releaseDate?.message ? (
                      <ErrorText>{errors.releaseDate?.message}</ErrorText>
                    ) : null}
                  </View>
                );
              }}
            />
            <View tw="absolute right-3 top-[42%] flex-row items-center">
              <Checkbox
                checked={isLive}
                onChange={() => {
                  setIsLive(!isLive);
                }}
                aria-label="Live Now"
              />
              <Text
                tw="ml-2 font-bold text-black dark:text-white"
                onPress={() => {
                  setIsLive(!isLive);
                }}
              >
                Live Now
              </Text>
            </View>
          </View>
          <Button tw="mt-4" onPress={handleSubmit(onSubmit)} disabled={false}>
            {"Submit"}
          </Button>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModalProvider>
  );
};
