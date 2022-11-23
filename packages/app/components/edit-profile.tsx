import React, { useEffect, useMemo, useState } from "react";
import { Platform, useWindowDimensions, Keyboard } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import { Chip } from "@showtime-xyz/universal.chip";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Upload,
  CheckFilled,
  InformationCircle,
} from "@showtime-xyz/universal.icon";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { getLocalFileURI, Preview } from "app/components/preview";
import { USER_PROFILE_KEY } from "app/hooks/api-hooks";
import { useLinkOptions } from "app/hooks/use-link-options";
import { useMatchMutate } from "app/hooks/use-match-mutate";
import { useUser } from "app/hooks/use-user";
import { useValidateUsername } from "app/hooks/use-validate-username";
import { axios } from "app/lib/axios";
import { DropFileZone } from "app/lib/drop-file-zone";
import { yup } from "app/lib/yup";
import { createParam } from "app/navigation/use-param";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { getFileFormData, userHasIncompleteExternalLinks } from "app/utilities";

import { useFilePicker } from "design-system/file-picker";
import { breakpoints } from "design-system/theme";

import { MediaCropper } from "./media-cropper";
import { ProfileScialExplanation } from "./profile/profile-social-explanation";

const ScrollComponent =
  Platform.OS === "android" ? (BottomSheetScrollView as any) : ScrollView;

type Query = {
  redirectUri?: string;
  error?: string;
};

const { useParam } = createParam<Query>();

const editProfileValidationSchema = yup.object({
  username: yup
    .string()
    .typeError("Please enter a valid username")
    .min(2)
    .max(30)
    .matches(
      /([0-9a-zA-Z_]{2,30})+$/,
      "Invalid username. Can only contain letters, numbers, and underscores (_)."
    ),
  bio: yup
    .string()
    .max(300)
    .required("About me is a required field")
    .typeError("Please enter a valid about me"),
  name: yup
    .string()
    .max(40)
    .required("name is a required field")
    .typeError("Please enter a valid name"),
  profilePicture: yup.mixed().required("Please add a profile picture"),
});
const requiredFieldChips = [
  {
    value: "profilePicture",
    lable: "Profile Picture",
  },
  {
    value: "name",
    lable: "Name",
  },
  {
    value: "username",
    lable: "Username",
  },
  {
    value: "bio",
    lable: "About Me",
  },
];
export const EditProfile = () => {
  // hooks
  const { user } = useUser();
  const isDark = useIsDarkMode();
  const { mutate } = useSWRConfig();
  const matchMutate = useMatchMutate();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { isValid, validate } = useValidateUsername();
  const insets = useSafeAreaInsets();
  const socialLinks = useLinkOptions();
  const pickFile = useFilePicker();
  const [showScialExplanation, setShowScialExplanation] = useState(false);
  // edit media regin
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const [index, setIndex] = useState(() =>
    !user?.data?.profile.username ||
    !user?.data?.profile.bio ||
    !user?.data?.profile.img_url
      ? 0
      : userHasIncompleteExternalLinks(user?.data?.profile)
      ? 1
      : 0
  );

  const [redirectUri] = useParam("redirectUri");

  const [currentCropField, setCurrentCropField] = useState<
    null | "coverPicture" | "profilePicture"
  >(null);

  const [hasNotSubmittedExternalLink, setHasNotSubmittedExternalLink] =
    useState(index === 1);

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
      profilePicture: user?.data?.profile.img_url,
      coverPicture: user?.data?.profile.cover_url,
    };
  }, [socialLinks?.data?.data, user?.data?.profile]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<any>({
    resolver: yupResolver(editProfileValidationSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const handleSubmitForm = async (values: typeof defaultValues) => {
    if (!isValid) return;
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

    //@ts-ignore
    if (userHasIncompleteExternalLinks(newValues)) {
      setHasNotSubmittedExternalLink(true);
      setIndex(1);
    } else {
      setHasNotSubmittedExternalLink(false);

      try {
        if (
          values.coverPicture &&
          values.coverPicture !== defaultValues.coverPicture
        ) {
          const coverPictureFormData = await getFileFormData(
            values.coverPicture
          );
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
        console.error("edit profile failed ", e);
      }
    }
  };
  // cover down to twitter banner ratio: w:h=3:1
  const coverImageHeight = useMemo(
    () => (width < 768 ? width / 3 : 160),
    [width]
  );
  const extraScrollHeight = useMemo(
    () => insets.bottom + (Platform.OS === "ios" ? 120 : 200),
    [insets.bottom]
  );

  return (
    <>
      <BottomSheetModalProvider>
        <View tw={`w-full flex-1`}>
          <ScrollComponent extraScrollHeight={extraScrollHeight as any}>
            <Controller
              control={control}
              name="coverPicture"
              render={({ field: { onChange, value } }) => (
                <DropFileZone onChange={onChange}>
                  <Pressable
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
                  <DropFileZone onChange={onChange}>
                    <>
                      <Pressable
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
                  BIO
                </Text>
                <View tw="mt-4 flex-row">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Fieldset
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
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Fieldset
                        tw="ml-2 w-1/2 flex-1"
                        label="Username"
                        placeholder="Your username"
                        value={value}
                        textContentType="username"
                        errorText={
                          !isValid
                            ? "username has been taken, please choose another"
                            : errors.username?.message
                        }
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <Fieldset
                    label="About me"
                    placeholder="About me"
                    tw="mt-4"
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
              <View tw="mt-2 flex-row flex-wrap">
                {requiredFieldChips.map((item) => (
                  <Chip
                    icon={
                      <View
                        style={{
                          opacity:
                            !errors[item.value] &&
                            watch(item.value) &&
                            (item.value === "username" ? isValid : true)
                              ? 1
                              : 0.1,
                        }}
                      >
                        <CheckFilled
                          width={16}
                          height={16}
                          color={isDark ? colors.white : colors.gray[700]}
                        />
                      </View>
                    }
                    tw="my-2 w-1/2"
                    label={item.lable}
                    variant="text"
                    key={item.value}
                  />
                ))}
              </View>
              {/* Social */}
              <View tw="mt-6 mb-10">
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowScialExplanation(true);
                  }}
                  tw="flex-row items-center pb-4"
                >
                  <Text tw="mr-1 text-base font-bold text-gray-900 dark:text-gray-500">
                    SOCIAL
                  </Text>
                  <InformationCircle
                    height={18}
                    width={18}
                    color={isDark ? colors.gray[400] : colors.gray[600]}
                  />
                </Pressable>
                {/*  <View tw="mb-4 rounded-xl bg-gray-100 px-4 py-4 dark:bg-gray-800">
                  <View tw="flex-row items-center justify-between">
                    <View tw="flex-row items-center">
                      <Twitter width={20} height={20} color="#1DA1F2" />
                      <Text tw="ml-2 text-sm font-bold text-gray-700 dark:text-white">
                        Twitter
                      </Text>
                    </View>
                    <Text
                      onPress={() => console.log("Connect Twitter")}
                      tw="text-sm font-bold text-violet-500"
                    >
                      Connect
                    </Text>
                  </View>
                  <View tw="mt-4 flex-row items-center justify-between">
                    <View tw="flex-row items-center">
                      <Facebook width={20} height={20} color="#1877F2" />
                      <Text tw="ml-2 text-sm font-bold text-gray-700 dark:text-white">
                        Facebook
                      </Text>
                    </View>
                    <Text
                      onPress={() => console.log("Connect Facebook")}
                      tw="text-sm font-bold text-violet-500"
                    >
                      Connect
                    </Text>
                  </View>
                </View>
                <Chip
                  icon={
                    <View
                      style={{
                        opacity: hasNotSubmittedExternalLink ? 1 : 0.1,
                      }}
                    >
                      <CheckFilled
                        width={16}
                        height={16}
                        color={isDark ? colors.white : colors.gray[700]}
                      />
                    </View>
                  }
                  label="Connect Twitter or Facebook"
                  variant="text"
                /> */}
                {hasNotSubmittedExternalLink ? (
                  <>
                    <Text tw="text-sm font-semibold text-red-500">
                      Please add atleast one link from below
                    </Text>
                    <View tw="h-4" />
                  </>
                ) : null}
                <Controller
                  control={control}
                  name="website_url"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Fieldset
                      label="Website"
                      keyboardType="url"
                      textContentType="URL"
                      placeholder="Your url"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                />

                {socialLinks.data?.data
                  .filter(
                    (link) =>
                      link.prefix.includes("twitter") ||
                      link.prefix.includes("instagram")
                  )
                  .map((v) => {
                    return (
                      <Controller
                        control={control}
                        key={v.id}
                        name={`links[${v.id}]`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Fieldset
                            tw="mt-4"
                            label={v.name}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            autoCapitalize="none"
                            leftElement={
                              <Text
                                tw="text-base text-gray-600 dark:text-gray-400"
                                style={{
                                  marginTop: Platform.select({
                                    ios: 1,
                                    android: 8,
                                    default: 0,
                                  }),
                                  marginBottom: Platform.select({
                                    default: 4,
                                    android: 0,
                                    web: 0,
                                  }),
                                }}
                              >
                                {v.prefix}
                              </Text>
                            }
                          />
                        )}
                      />
                    );
                  })}
              </View>
            </View>
          </ScrollComponent>
          <View tw="my-2.5 mb-4 px-4">
            <Button
              disabled={isSubmitting}
              tw={isSubmitting ? "opacity-50" : ""}
              onPress={handleSubmit(handleSubmitForm)}
              size="regular"
            >
              {isSubmitting ? "Submitting..." : "Complete Profile"}
            </Button>
            <View tw="h-1" />
            <Text tw="text-center text-sm text-red-500">
              {errors.submitError?.message}
            </Text>
          </View>
        </View>
        <ModalSheet
          snapPoints={[240]}
          title="Profile Social"
          visible={showScialExplanation}
          close={() => setShowScialExplanation(false)}
          onClose={() => setShowScialExplanation(false)}
        >
          <ProfileScialExplanation />
        </ModalSheet>
      </BottomSheetModalProvider>
      <MediaCropper
        src={selectedImg}
        visible={!!selectedImg}
        onClose={() => setSelectedImg(null)}
        aspect={currentCropField === "coverPicture" ? 3 / 1 : 1}
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
