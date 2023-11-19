import { useContext, useMemo, useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { AnimatePresence } from "moti";
import { Controller, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import { ErrorText } from "@showtime-xyz/universal.fieldset";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { getLocalFileURI, Preview } from "app/components/preview";
import { USER_PROFILE_KEY } from "app/hooks/api-hooks";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { axios } from "app/lib/axios";
import { DropFileZone } from "app/lib/drop-file-zone";
import { useFilePicker } from "app/lib/file-picker";
import { Logger } from "app/lib/logger";
import { yup } from "app/lib/yup";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { getFileFormData } from "app/utilities";

import { AddPhoto } from "design-system/icon";
import { Spinner } from "design-system/spinner";

import { MediaCropper } from "../media-cropper";
import { OnboardingStepContext } from "./onboarding-context";
import { OnboardingStep } from "./onboarding-types";

const profilePictureSchema = yup.object({
  profilePicture: yup.mixed().required("Please select a profile picture"),
});

export const SelectPicture = () => {
  const { user, setStep } = useContext(OnboardingStepContext);
  const pickFile = useFilePicker();
  const { mutate } = useSWRConfig();
  const matchMutate = useMatchMutate();

  const [currentCropField, setCurrentCropField] = useState<
    null | "profilePicture"
  >(null);
  const [selectedImg, setSelectedImg] = useState<string | File | null>(null);

  const defaultValues = useMemo(() => {
    return {
      profilePicture: user?.data?.profile.img_url as File | string | undefined,
    };
  }, [user?.data?.profile]);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm<{ profilePicture: string | File }>({
    resolver: yupResolver(profilePictureSchema),
    mode: "all",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const onFormSubmit = async (values: typeof defaultValues) => {
    if ((!selectedImg && !isValid) || isSubmitting || !isValid) return;

    if (
      values.profilePicture &&
      values.profilePicture !== defaultValues.profilePicture
    ) {
      const formData = new FormData();

      const profilePictureFormData = await getFileFormData(
        values.profilePicture
      );

      if (profilePictureFormData) {
        formData.append("image", profilePictureFormData);

        try {
          await axios({
            url: "/v1/profile/photo",
            method: "POST",
            headers: {
              "Content-Type": `multipart/form-data`,
            },
            data: formData,
          });

          setStep(OnboardingStep.Social);

          // TODO: optimise to make fewer API calls!
          mutate(MY_INFO_ENDPOINT);
          matchMutate(
            (key) => typeof key === "string" && key.includes(USER_PROFILE_KEY)
          );
        } catch (e) {
          setError("profilePicture", {
            message: "Failed to upload profile picture. Please try again",
          });
          Logger.error("Failed to upload profile picture.", e);
        }
      }
    } else {
      setStep(OnboardingStep.Social);
    }
  };

  return (
    <>
      <MotiView
        from={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={() => {
          "worklet";
          return {
            opacity: 0,
            scale: 0.9,
          };
        }}
        exitTransition={{
          type: "timing",
          duration: 600,
        }}
        style={{ flex: 1 }}
      >
        <View tw="flex-1 px-4 text-center">
          <View tw="items-center">
            <View tw="h-4" />
            <Text tw="text-xl font-bold text-gray-900 dark:text-gray-100">
              Now choose a profile picture
            </Text>
          </View>
          <View tw="mt-8 items-center">
            <Controller
              control={control}
              name="profilePicture"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DropFileZone onChange={({ file }) => onChange(file)}>
                  <>
                    <Pressable
                      aria-label="Pick profile photo"
                      testID="profile_photo_picker"
                      onPress={async () => {
                        const file = await pickFile({
                          mediaTypes: "image",
                          option: {
                            allowsEditing: true,
                            aspect: [1, 1],
                            presentationStyle:
                              ImagePicker.UIImagePickerPresentationStyle
                                .FULL_SCREEN,
                          },
                        });

                        onChange(file.file);
                        setSelectedImg(getLocalFileURI(file.file));
                        setCurrentCropField("profilePicture");
                      }}
                      tw="mx-4 h-32 w-32 overflow-hidden rounded-full border-4 border-gray-300 bg-white  dark:border-gray-700 dark:bg-gray-700"
                    >
                      <LinearGradient
                        key="linear-gradient"
                        style={{ width: 128, height: 128 }}
                        colors={["#9E0303", "#770179"]}
                        locations={[0.12, 0.91]}
                        start={{
                          x: 0.11824342029278412,
                          y: -0.07808566519105353,
                        }}
                        end={{ x: 0.8817565797072159, y: 1.0780856651910535 }}
                      />
                      <AnimatePresence mode="wait">
                        {value ? (
                          <MotiView
                            key={value.toString()}
                            animate={{ opacity: 1 }}
                            from={{ opacity: 0 }}
                            delay={200}
                            transition={{
                              type: "timing",
                              duration: 600,
                            }}
                            exit={() => {
                              "worklet";
                              return {
                                opacity: 0,
                              };
                            }}
                            exitTransition={{
                              type: "timing",
                              duration: 400,
                            }}
                            style={{ position: "absolute" }}
                          >
                            <Preview
                              tw="h-full w-full"
                              file={value}
                              width={128}
                              height={128}
                              style={{ width: 128, height: 128 }}
                            />
                          </MotiView>
                        ) : (
                          <>
                            <View tw="absolute z-10 h-full w-full flex-1 items-center justify-center">
                              <AddPhoto
                                height={20}
                                width={20}
                                color={colors.white}
                              />
                            </View>
                          </>
                        )}
                      </AnimatePresence>
                    </Pressable>

                    {error?.message ? (
                      <ErrorText>{error.message}</ErrorText>
                    ) : null}
                  </>
                </DropFileZone>
              )}
            />
          </View>
          <View tw="mt-8 flex flex-grow-0">
            <Button
              tw={[
                "flex",
                !isValid || isSubmitting ? "opacity-50" : "opacity-100",
              ]}
              size="regular"
              disabled={!isValid || isSubmitting}
              onPress={handleSubmit(onFormSubmit)}
            >
              Next
              {isSubmitting ? (
                <View tw="absolute right-4 scale-75 justify-center">
                  <Spinner size="small" color="darkgrey" />
                </View>
              ) : (
                <></>
              )}
            </Button>
            {!isSubmitting && !selectedImg && !user?.data?.profile.img_url ? (
              <Button
                size="regular"
                variant="text"
                onPress={() => setStep(OnboardingStep.Social)}
                disabled={isSubmitting}
                tw={isSubmitting ? "opacity-0" : "opacity-100"}
              >
                Skip
              </Button>
            ) : null}
          </View>
        </View>
      </MotiView>
      <MediaCropper
        src={selectedImg}
        visible={!!selectedImg}
        onClose={() => setSelectedImg(null)}
        aspect={1}
        onApply={async (e) => {
          if (!currentCropField) return;
          const timestamp = new Date().valueOf();
          const imgFile = new File([e], timestamp.toString(), {
            lastModified: timestamp,
            type: e.type,
          });

          setValue(currentCropField, imgFile);
          setSelectedImg(null);
        }}
      />
    </>
  );
};
