import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import type { KeyboardAwareScrollViewProps } from "react-native-keyboard-aware-scroll-view";
import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { Upload } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import {
  SceneRendererProps,
  TabView,
  Route,
  ScollableAutoWidthTabBar,
} from "@showtime-xyz/universal.tab-view";
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
import { SORT_FIELDS } from "app/lib/constants";
import { yup } from "app/lib/yup";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { getFileFormData, userHasIncompleteExternalLinks } from "app/utilities";

import { useFilePicker } from "design-system/file-picker";
import { breakpoints } from "design-system/theme";

import { MediaCropper } from "./media-cropper";

const EDIT_PROFILE_ROUTES = [
  {
    title: "Profile",
    key: "Profile",
    index: 0,
  },
  {
    title: "Links",
    key: "Links",
    index: 1,
  },
  {
    title: "Page Settings",
    key: "Settings",
    index: 2,
  },
];
type SceneViewProps = KeyboardAwareScrollViewProps & {
  focused?: boolean;
};

const SceneView = ({ focused, style, ...props }: SceneViewProps) => {
  return (
    <ScrollView
      style={[style, { display: focused ? "flex" : "none" }]}
      asKeyboardAwareScrollView
      {...props}
    />
  );
};
const editProfileValidationSchema = yup.object({
  username: yup
    .string()
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
  name: yup.string().max(40).nullable(),
  profilePicture: yup.mixed().required("Please add a profile picture"),
});

const nftList = [
  { label: "Created", value: 1 },
  { label: "Owned", value: 2 },
  { label: "Liked", value: 3 },
];

const sortingOptionsList = [
  //@ts-ignore
  ...Object.keys(SORT_FIELDS).map((key) => SORT_FIELDS[key]),
];

export const EditProfile = () => {
  // hooks
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const matchMutate = useMatchMutate();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { isValid, validate } = useValidateUsername();
  const insets = useSafeAreaInsets();
  const socialLinks = useLinkOptions();
  const pickFile = useFilePicker();
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
  } = useForm<any>({
    resolver: yupResolver(editProfileValidationSchema),
    mode: "onBlur",
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

        router.pop();

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

  const renderScene = useCallback(
    ({
      route: { key, index: routeIndex },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      const focused = index === routeIndex || Platform.OS !== "web";
      switch (key) {
        case "Profile":
          return (
            <SceneView focused={focused}>
              <Controller
                control={control}
                name="coverPicture"
                render={({ field: { onChange, value } }) => (
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

                      setSelectedImg(uri);
                      setCurrentCropField("coverPicture");
                      onChange(file.file);
                    }}
                    style={{
                      height: coverImageHeight,
                    }}
                    tw="w-full flex-row"
                  >
                    <View tw="absolute z-10 h-full w-full flex-row items-center justify-center bg-black/10 p-2 dark:bg-black/60">
                      <View tw="rounded-full bg-gray-800/70 p-2">
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
                )}
              />

              <View tw="-mt-12 px-4">
                <Controller
                  control={control}
                  name="profilePicture"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Pressable
                        onPress={async () => {
                          const file = await pickFile({
                            mediaTypes: "image",
                            option: { allowsEditing: true, aspect: [1, 1] },
                          });

                          setSelectedImg(getLocalFileURI(file.file));
                          setCurrentCropField("profilePicture");
                          onChange(file.file);
                        }}
                        tw="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-300 bg-white dark:border-gray-900 dark:bg-gray-800"
                      >
                        {value && (
                          <Preview
                            file={value}
                            tw="rounded-full"
                            width={94}
                            height={94}
                          />
                        )}
                        <View tw="absolute z-10 h-full w-full flex-1 items-center justify-center bg-black/10 dark:bg-black/60">
                          <View tw="rounded-full bg-gray-800/70 p-2">
                            <Upload
                              height={20}
                              width={20}
                              color={colors.white}
                            />
                          </View>
                        </View>
                      </Pressable>
                      <View tw="ml-4 flex-row items-center pt-2">
                        <Text tw="font-bold text-gray-900 dark:text-white">
                          Profile picture
                        </Text>
                        <Text tw="ml-1 text-red-500">*</Text>
                      </View>
                      {errors.profilePicture?.message ? (
                        <ErrorText>{errors.profilePicture.message}</ErrorText>
                      ) : null}
                    </>
                  )}
                />

                <View tw="mt-4 flex-row">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Fieldset
                        tw="mr-4 flex-1"
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
                        tw="flex-1"
                        required
                        label="Username"
                        placeholder="Enter your username"
                        value={value}
                        textContentType="username"
                        errorText={errors.username?.message}
                        onBlur={onBlur}
                        helperText={
                          !isValid ? "username not available" : undefined
                        }
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                <Controller
                  control={control}
                  name="bio"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Fieldset
                      label="About me"
                      placeholder="About me"
                      tw="mt-4"
                      required
                      multiline
                      value={value}
                      numberOfLines={3}
                      errorText={errors.bio?.message}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </SceneView>
          );
        case "Links":
          return (
            <SceneView
              extraScrollHeight={extraScrollHeight}
              focused={focused}
              style={{ padding: 16, marginTop: 16 }}
            >
              {hasNotSubmittedExternalLink ? (
                <>
                  <Text tw="text-sm font-semibold text-gray-900 dark:text-white">
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
            </SceneView>
          );
        case "Settings":
          return (
            <SceneView style={{ padding: 16, marginTop: 16 }} focused={focused}>
              <View tw="z-2">
                <Controller
                  control={control}
                  name="default_list_id"
                  render={({ field: { onChange, value } }) => (
                    <Fieldset
                      label="Default NFT List"
                      selectOnly
                      select={{
                        options: nftList,
                        placeholder: "Select",
                        value: value,
                        onChange: onChange,
                      }}
                    />
                  )}
                />
              </View>
              <View tw="z-1">
                <Controller
                  control={control}
                  name="default_created_sort_id"
                  render={({ field: { onChange, value } }) => (
                    <Fieldset
                      label="Sort Created By"
                      selectOnly
                      tw="mt-4"
                      select={{
                        options: sortingOptionsList,
                        placeholder: "Select",
                        value: value,
                        onChange: onChange,
                      }}
                    />
                  )}
                />
              </View>
              <Controller
                control={control}
                name="default_owned_sort_id"
                render={({ field: { onChange, value } }) => (
                  <Fieldset
                    label="Sort Owned By"
                    selectOnly
                    tw="mt-4"
                    select={{
                      options: sortingOptionsList,
                      placeholder: "Select",
                      value: value,
                      onChange: onChange,
                    }}
                  />
                )}
              />
            </SceneView>
          );

        default:
          return null;
      }
    },
    [
      control,
      coverImageHeight,
      errors.bio?.message,
      errors.name?.message,
      errors.profilePicture?.message,
      errors.username?.message,
      extraScrollHeight,
      hasNotSubmittedExternalLink,
      index,
      isMdWidth,
      isValid,
      pickFile,
      socialLinks.data?.data,
      validate,
      width,
    ]
  );

  return (
    <>
      <BottomSheetModalProvider>
        <View tw={`w-full flex-1`}>
          <TabView
            navigationState={{ index, routes: EDIT_PROFILE_ROUTES }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={(props) => <ScollableAutoWidthTabBar {...props} />}
            initialLayout={{
              width: width,
            }}
          />

          <View tw="my-2.5 mb-4 px-4">
            <Button
              disabled={isSubmitting}
              tw={isSubmitting ? "opacity-50" : ""}
              onPress={handleSubmit(handleSubmitForm)}
            >
              {isSubmitting ? "Submitting..." : "Done"}
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
