import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Platform,
  useWindowDimensions,
  ScrollView as RNScrollView,
  View as RNView,
} from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Upload, Twitter } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { getLocalFileURI, Preview } from "app/components/preview";
import { USER_PROFILE_KEY } from "app/hooks/api-hooks";
import { useAddMagicSocialAccount } from "app/hooks/use-add-magic-social-account";
import { useLinkOptions } from "app/hooks/use-link-options";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useUser } from "app/hooks/use-user";
import { useValidateUsername } from "app/hooks/use-validate-username";
import { axios } from "app/lib/axios";
import { DropFileZone } from "app/lib/drop-file-zone";
import { useFilePicker } from "app/lib/file-picker";
import { yup } from "app/lib/yup";
import { createParam } from "app/navigation/use-param";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { getFileFormData } from "app/utilities";

import { Check, InstagramColorful } from "design-system/icon";
import { breakpoints } from "design-system/theme";

import { MediaCropper } from "./media-cropper";

type Query = {
  redirectUri?: string;
  error?: string;
};

const { useParam } = createParam<Query>();

const URL_REGEXP =
  /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i;

const editProfileValidationSchema = yup.object({
  username: yup
    .string()
    .required()
    .label("Username")
    .typeError("Please enter a valid username")
    .min(2)
    .max(30)
    .matches(
      /^([0-9a-zA-Z_]{2,30})$/g,
      "Invalid username. Use only letters, numbers, and underscores (_)."
    ),
  bio: yup
    .string()
    .notRequired()
    .nullable()
    .label("About me")
    .when({
      is: (value?: string) => value?.length,
      then: (rule) => rule.min(1).max(300),
    })
    .typeError("Please enter a valid about me"),
  name: yup
    .string()
    .notRequired()
    .nullable()
    .label("Name")
    .when({
      is: (value?: string) => value?.length,
      then: (rule) => rule.min(2).max(300),
    })
    .typeError("Please enter a valid name"),
  website_url: yup
    .string()
    .label("Website")
    .notRequired()
    .nullable()
    .max(1000)
    .when({
      is: (value?: string) => value?.length,
      then: (rule) =>
        rule.min(3).matches(URL_REGEXP, "Please enter a valid URL"),
    }),
});

export const EditProfile = () => {
  // hooks
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const matchMutate = useMatchMutate();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { isValid, validate } = useValidateUsername();
  const socialLinks = useLinkOptions();
  const pickFile = useFilePicker();
  const [cropViewHeight, setCropViewHeight] = useState(400);
  const scrollViewRef = useRef<RNScrollView>(null);
  const socialRef = useRef<RNView>(null);
  // edit media regin
  const [selectedImg, setSelectedImg] = useState<string | File | null>(null);

  const [redirectUri] = useParam("redirectUri");

  const [currentCropField, setCurrentCropField] = useState<
    null | "coverPicture" | "profilePicture"
  >(null);

  const defaultValues = useMemo(() => {
    const links: any = {};
    if (socialLinks?.data?.data && user?.data?.profile?.links) {
      socialLinks.data.data.forEach((s) => {
        const foundLink = user.data.profile.links.find(
          (l) => l.type_id === s.id
        );

        if (foundLink) {
          links[s.id] = foundLink.user_input;
        }
      });
    }

    return {
      name: user?.data?.profile.name,
      username: user?.data?.profile.username,
      bio: user?.data?.profile.bio,
      links,
      website_url: user?.data?.profile.website_url,
      default_created_sort_id: user?.data?.profile.default_created_sort_id,
      default_list_id: user?.data?.profile.default_list_id,
      default_owned_sort_id: user?.data?.profile.default_owned_sort_id,
      profilePicture: user?.data?.profile.img_url as File | string | undefined,
      coverPicture: user?.data?.profile.cover_url,
      submitError: "",
    };
  }, [socialLinks?.data?.data, user?.data?.profile]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid: formIsValid },
    reset,
    setValue,
  } = useForm<typeof defaultValues>({
    resolver: yupResolver(editProfileValidationSchema),
    mode: "all",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const handleSubmitForm = async (values: typeof defaultValues) => {
    if (!isValid || !formIsValid) return;
    const links = Object.keys(values.links)
      .filter((key) => values.links[key]?.trim())
      .map((key) => {
        const typeIdInt = parseInt(key);
        return {
          type_id: isNaN(typeIdInt) ? key : typeIdInt,
          user_input: values.links[key] ? values.links[key].trim() : null,
        };
      });

    const newValues = {
      name: values.name?.trim() || null,
      username: values.username?.trim() || null,
      bio: values.bio?.trim() || null,
      links,
      website_url: values.website_url?.trim() || null,
      default_created_sort_id: values.default_created_sort_id,
      default_list_id: values.default_list_id,
      default_owned_sort_id: values.default_owned_sort_id,
    };

    // check if user added a cover picture and upload it
    try {
      if (
        values.coverPicture &&
        values.coverPicture !== defaultValues.coverPicture
      ) {
        const coverPictureFormData = await getFileFormData(values.coverPicture);
        const formData = new FormData();
        if (coverPictureFormData) {
          formData.append("image", coverPictureFormData);

          await axios({
            url: "/v1/profile/photo/cover",
            method: "POST",
            headers: {
              "Content-Type": `multipart/form-data`,
            },
            data: formData,
          });
        }
      }

      // check if user added a profile picture and upload it
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

          await axios({
            url: "/v1/profile/photo",
            method: "POST",
            headers: {
              "Content-Type": `multipart/form-data`,
            },
            data: formData,
          });
        }
      }

      // update profile fields
      await axios({
        url: "/v1/editname",
        method: "POST",
        data: newValues,
      });

      if (redirectUri) {
        router.replace(redirectUri);
      } else {
        router.pop();
      }

      // TODO: optimise to make fewer API calls!
      mutate(MY_INFO_ENDPOINT);
      matchMutate(
        (key) => typeof key === "string" && key.includes(USER_PROFILE_KEY)
      );
    } catch (e) {
      setError("submitError", { message: "Something went wrong" });
      console.error("Edit profile failed ", e);
    }
  };
  // cover down to twitter banner ratio: w:h=3:1
  const coverImageHeight = useMemo(
    () => (width < 768 ? width / 3 : 160),
    [width]
  );

  return (
    <>
      <BottomSheetModalProvider>
        <View tw="w-full flex-1">
          <BottomSheetScrollView
            onLayout={({
              nativeEvent: {
                layout: { height },
              },
            }) => {
              setCropViewHeight(height);
            }}
            ref={scrollViewRef}
          >
            <Controller
              control={control}
              name="coverPicture"
              render={({ field: { onChange, value } }) => (
                <DropFileZone onChange={({ file }) => onChange(file)}>
                  <Pressable
                    accessibilityLabel="Pick profile photo"
                    testID="profile_photo_picker"
                    onPress={async () => {
                      const file = await pickFile({
                        mediaTypes: "image",
                        option: Platform.select({
                          // aspect option only support android.
                          android: { allowsEditing: true, aspect: [3, 1] },
                          default: {},
                        }),
                      });
                      const uri = getLocalFileURI(file.file);

                      onChange(file.file);
                      setSelectedImg(uri);
                      setCurrentCropField("coverPicture");
                    }}
                    style={{
                      height: coverImageHeight,
                    }}
                    tw="mx-4 flex-row overflow-hidden rounded-2xl dark:border-gray-900 dark:bg-gray-800"
                  >
                    <View tw="absolute z-10 h-full w-full flex-row items-center justify-center bg-black/10 p-2 dark:bg-black/60">
                      <View tw="rounded-full bg-gray-800/70 p-1">
                        <Upload height={20} width={20} color={colors.white} />
                      </View>
                    </View>
                    {value && (
                      <Preview
                        file={value}
                        style={{ height: coverImageHeight }}
                        tw="web:object-cover"
                        resizeMode="cover"
                        width={isMdWidth ? 480 : width}
                        height={isMdWidth ? 480 : width}
                      />
                    )}
                  </Pressable>
                </DropFileZone>
              )}
            />

            <View tw="-mt-12 px-4">
              <Controller
                control={control}
                name="profilePicture"
                render={({ field: { onChange, value } }) => (
                  <DropFileZone onChange={({ file }) => onChange(file)}>
                    <>
                      <Pressable
                        accessibilityLabel="Pick profile photo"
                        testID="profile_photo_picker"
                        onPress={async () => {
                          const file = await pickFile({
                            mediaTypes: "image",
                            option: { allowsEditing: true, aspect: [1, 1] },
                          });

                          onChange(file.file);
                          setSelectedImg(getLocalFileURI(file.file));
                          setCurrentCropField("profilePicture");
                        }}
                        tw="mx-4 h-16 w-16 overflow-hidden rounded-full border-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-700"
                      >
                        {value && (
                          <Preview
                            file={value}
                            tw="rounded-full"
                            width={64}
                            height={64}
                          />
                        )}
                        <View tw="absolute z-10 h-full w-full flex-1 items-center justify-center bg-black/10 dark:bg-black/60">
                          <View tw="rounded-full bg-gray-800/70 p-1">
                            <Upload
                              height={20}
                              width={20}
                              color={colors.white}
                            />
                          </View>
                        </View>
                      </Pressable>

                      {errors.profilePicture?.message ? (
                        <ErrorText>{errors.profilePicture.message}</ErrorText>
                      ) : null}
                    </>
                  </DropFileZone>
                )}
              />
              <View tw="pt-6">
                <Text tw="text-base font-bold text-gray-900 dark:text-gray-500">
                  About me
                </Text>
                <View tw="mt-4 flex-row">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Fieldset
                        ref={ref}
                        tw="mr-2 w-1/2 flex-1"
                        label="Name"
                        placeholder="Your display name"
                        value={value}
                        textContentType="name"
                        errorText={errors.name?.message}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    rules={{
                      onChange: (v) => {
                        validate(v.target.value);
                      },
                    }}
                    name="username"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Fieldset
                        ref={ref}
                        tw="ml-2 w-1/2 flex-1"
                        label="Username"
                        placeholder="Your username"
                        value={value}
                        textContentType="username"
                        errorText={
                          !isValid
                            ? "Username has been taken"
                            : errors.username?.message
                        }
                        autoCorrect={false}
                        autoCapitalize="none"
                        autoComplete="off"
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Fieldset
                    ref={ref}
                    label="Bio"
                    placeholder="Tell us about yourself"
                    tw="mt-4"
                    testID="about_me"
                    multiline
                    value={value}
                    textAlignVertical="top"
                    numberOfLines={3}
                    errorText={errors.bio?.message}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="website_url"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Fieldset
                    ref={ref}
                    tw="mt-4"
                    label="Website"
                    keyboardType="url"
                    textContentType="URL"
                    placeholder="Your URL"
                    testID="website_url"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    errorText={errors.website_url?.message}
                  />
                )}
              />

              {/* Social */}
              <View tw="mt-6 mb-10" ref={socialRef}>
                <View tw="mb-4 rounded-xl bg-gray-100 px-4 py-4 dark:bg-gray-800">
                  <View tw="flex-row items-center justify-between">
                    <View tw="flex-row items-center">
                      <Twitter width={20} height={20} color="#1DA1F2" />
                      <Text tw="ml-2 text-sm font-bold text-gray-700 dark:text-white">
                        Twitter
                      </Text>
                    </View>
                    <ConnectButton
                      type="twitter"
                      isConnected={
                        user?.data?.profile?.social_login_connections?.twitter
                      }
                      handle={
                        user?.data?.profile?.social_login_handles?.twitter
                      }
                    />
                  </View>
                  <View tw="mt-4 flex-row items-center justify-between">
                    <View tw="flex-row items-center">
                      <InstagramColorful width={20} height={20} />
                      <Text tw="ml-2 text-sm font-bold text-gray-700 dark:text-white">
                        Instagram
                      </Text>
                    </View>
                    <ConnectButton
                      type="instagram"
                      isConnected={
                        user?.data?.profile?.social_login_connections?.instagram
                      }
                      handle={
                        user?.data?.profile?.social_login_handles?.instagram
                      }
                    />
                  </View>
                </View>
              </View>
              {/* End Social */}
            </View>
          </BottomSheetScrollView>
          <View tw="my-2.5 mb-4 px-4">
            <Button
              disabled={isSubmitting}
              tw={isSubmitting || !formIsValid || !isValid ? "opacity-50" : ""}
              onPress={handleSubmit(handleSubmitForm)}
              size="regular"
            >
              {isSubmitting ? "Submitting..." : "Save"}
            </Button>
            <View tw="h-1" />
            <Text tw="text-center text-sm text-red-500">
              {errors.submitError?.message}
            </Text>
          </View>
        </View>
      </BottomSheetModalProvider>
      <MediaCropper
        src={selectedImg}
        visible={!!selectedImg}
        onClose={() => setSelectedImg(null)}
        aspect={currentCropField === "coverPicture" ? 3 / 1 : 1}
        title={`Crop your ${
          currentCropField === "coverPicture" ? "cover" : "profile"
        } picture`}
        cropViewHeight={cropViewHeight - 60}
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

const ConnectButton = ({
  type,
  isConnected,
  handle,
}: {
  type: "apple" | "google" | "instagram" | "twitter";
  isConnected?: boolean;
  handle?: string | null;
}) => {
  const isDark = useIsDarkMode();
  const { trigger, isMutating } = useAddMagicSocialAccount();
  return (
    <PressableHover
      onPress={async () => {
        try {
          await trigger({
            type,
          });
        } catch {
          // do nothing
        }
      }}
      disabled={isConnected || isMutating}
      tw={"items-center justify-center"}
    >
      <View
        tw={`min-h-4 flex flex-row items-center justify-center rounded-2xl border py-2 px-4 ${
          !isConnected
            ? isDark
              ? "border-white"
              : "border-black"
            : "border-transparent bg-[#22C55E]"
        }`}
      >
        {isConnected && (
          <View tw="mr-1.5 scale-[2]">
            <Check color="white" height={10} width={10} tw="m-0 p-0" />
          </View>
        )}
        <View tw="flex-row items-center justify-start">
          <Text
            tw={`text-center text-xs font-medium
            ${
              isConnected
                ? "text-white dark:text-white"
                : "text-black dark:text-white"
            }`}
          >
            {isMutating
              ? "Loading..."
              : isConnected
              ? `@${handle}` ?? "Connected"
              : "Connect"}
          </Text>
        </View>
      </View>
    </PressableHover>
  );
};
