import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, useWindowDimensions } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

import { USER_PROFILE_KEY } from "app/hooks/api-hooks";
import { useLinkOptions } from "app/hooks/use-link-options";
import { useUser } from "app/hooks/use-user";
import { useValidateUsername } from "app/hooks/use-validate-username";
import { axios } from "app/lib/axios";
import { yup } from "app/lib/yup";
import { useRouter } from "app/navigation/use-router";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { getFileFormData, SORT_FIELDS } from "app/utilities";

import {
  Button,
  Fieldset,
  Image,
  SelectedTabIndicator,
  TabItem,
  Tabs,
  Text,
  View,
} from "design-system";
import { Avatar } from "design-system/avatar";
import { useFilePicker } from "design-system/file-picker";
import { Upload } from "design-system/icon";
import { getLocalFileURI, Preview } from "design-system/preview";
import { tw } from "design-system/tailwind";
import { colors } from "design-system/tailwind/colors";

import { TAB_LIST_HEIGHT } from "../lib/constants";
import { useSafeAreaInsets } from "../lib/safe-area";

const editProfileValidationSchema = yup.object({
  username: yup.string().min(2).nullable(),
  bio: yup.string().max(300).nullable(),
});
const tabs = ["Profile", "Links", "Page Settings"];

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
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const { isValid, validate } = useValidateUsername();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const socialLinks = useLinkOptions();
  const pickFile = useFilePicker();

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
  } = useForm<any>({
    resolver: yupResolver(editProfileValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const handleSubmitForm = async (values: typeof defaultValues) => {
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

      // TODO: optimise to make fewer API calls!
      mutate(MY_INFO_ENDPOINT);
      mutate(USER_PROFILE_KEY + user?.data.profile.wallet_addresses[0]);

      router.pop();
    } catch (e) {
      setError("submitError", { message: "Something went wrong" });
      console.error("edit profile failed ", e);
    }
  };
  // cover down to twitter banner ratio: w:h=3:1
  const coverImageHeight = useMemo(
    () => (width < 768 ? width / 3 : 160),
    [width]
  );
  return (
    <BottomSheetModalProvider>
      <View tw={`w-full flex-1 pb-${insets.bottom}px`}>
        <Tabs.Root
          onIndexChange={setSelected}
          tabListHeight={TAB_LIST_HEIGHT}
          initialIndex={0}
          lazy
        >
          <Tabs.List
            style={tw.style(
              `h-[${TAB_LIST_HEIGHT}px] ios:w-screen android:w-screen`
            )}
          >
            {tabs.map((name, index) => (
              <Tabs.Trigger key={name}>
                <TabItem name={name} selected={selected === index} />
              </Tabs.Trigger>
            ))}
            <SelectedTabIndicator />
          </Tabs.List>
          <Tabs.Pager
            tw="web:max-h-60vh"
            style={{
              overflow: (Platform.OS === "web" ? "auto" : "visible") as any,
            }}
          >
            <Tabs.ScrollView style={tw.style("flex-1")}>
              <Controller
                control={control}
                name="coverPicture"
                render={({ field: { onChange, value } }) => (
                  <Pressable
                    onPress={async () => {
                      const file = await pickFile({ mediaTypes: "image" });
                      onChange(file.file);
                    }}
                    style={tw.style(
                      `w-full h-[${coverImageHeight}px] flex-row `
                    )}
                  >
                    <View tw="absolute z-10 h-full w-full flex-row items-center justify-center bg-black/10 p-2 dark:bg-black/60">
                      <View tw="rounded-full bg-gray-800/70 p-2">
                        <Upload height={20} width={20} color={colors.white} />
                      </View>
                    </View>
                    {value && (
                      <Preview
                        file={value}
                        tw={`h-[${coverImageHeight}px] md:w-120 web:object-cover w-screen`}
                        resizeMethod="resize"
                        resizeMode="cover"
                      />
                    )}
                  </Pressable>
                )}
              />

              <View tw={`-mt-12 px-4`}>
                <Controller
                  control={control}
                  name="profilePicture"
                  render={({ field: { onChange, value } }) => (
                    <Pressable
                      onPress={async () => {
                        const file = await pickFile({ mediaTypes: "image" });
                        onChange(file.file);
                      }}
                      style={tw.style(
                        "w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-900 bg-white dark:bg-gray-800"
                      )}
                    >
                      {value && (
                        <Preview
                          file={value}
                          tw={"h-[94px] w-[94px] rounded-full"}
                        />
                      )}
                      <View tw="absolute z-10 h-full w-full flex-1 items-center justify-center bg-black/10 dark:bg-black/60">
                        <View tw="rounded-full bg-gray-800/70 p-2">
                          <Upload height={20} width={20} color={colors.white} />
                        </View>
                      </View>
                    </Pressable>
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
                      value={value}
                      errorText={errors.bio?.message}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </Tabs.ScrollView>
            <Tabs.ScrollView
              style={tw.style("px-4 mt-4")}
              useKeyboardAvoidingView
              keyboardVerticalOffset={
                insets.bottom + (Platform.OS === "ios" ? 120 : 200)
              }
            >
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

              {socialLinks.data?.data.map((v) => {
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
                        leftElement={
                          <Text tw="text-gray-600 dark:text-gray-400">
                            {v.prefix}
                          </Text>
                        }
                      />
                    )}
                  />
                );
              })}
            </Tabs.ScrollView>
            <Tabs.ScrollView style={tw.style("px-4 mt-4")}>
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
            </Tabs.ScrollView>
          </Tabs.Pager>
        </Tabs.Root>

        <View tw={`mt-2.5 px-4`}>
          <Button
            disabled={isSubmitting}
            tw={isSubmitting ? "opacity-50" : ""}
            onPress={handleSubmit(handleSubmitForm)}
            size="regular"
          >
            Done
          </Button>
          <Text tw="mt-1 text-center text-sm text-red-500">
            {errors.submitError?.message}
          </Text>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};
