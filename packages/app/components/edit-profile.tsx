import { useEffect, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
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
import { SORT_FIELDS } from "app/utilities";

import { Accordion, Button, Fieldset, Image, Text, View } from "design-system";
import { ChevronUp, Edit, Upload } from "design-system/icon";
import { pickImage } from "design-system/image-picker/pick-image";
import { tw } from "design-system/tailwind";

const editProfileValidationSchema = yup.object({
  username: yup.string().min(2).nullable(),
  bio: yup.string().max(300).nullable(),
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
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { isValid, validate } = useValidateUsername();
  const socialLinks = useLinkOptions();

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
  }, [reset, defaultValues]);

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
        const formData = new FormData();
        formData.append("image", {
          //@ts-ignore
          uri: values.coverPicture,
          type: "image/jpg",
          name: "image.jpg",
        });

        await axios({
          url: "/v1/profile/photo/cover",
          method: "POST",
          headers: {
            "Content-Type": `multipart/form-data`,
          },
          data: formData,
        });
      }

      if (
        values.profilePicture &&
        values.profilePicture !== defaultValues.profilePicture
      ) {
        const formData = new FormData();

        formData.append("image", {
          //@ts-ignore
          uri: values.profilePicture,
          type: "image/jpg",
          name: "image.jpg",
        });

        await axios({
          url: "/v1/profile/photo",
          method: "POST",
          headers: {
            "Content-Type": `multipart/form-data`,
          },
          data: formData,
        });
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

  return (
    <View tw="w-full max-w-screen-xl flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        enabled={Platform.OS !== "android"}
        keyboardVerticalOffset={95}
      >
        <ScrollView contentContainerStyle={tw.style("pb-20")}>
          <Controller
            control={control}
            name="coverPicture"
            render={({ field: { onChange, value } }) => (
              <Pressable
                onPress={() => {
                  pickImage({
                    onPick: (e) => {
                      onChange(e.uri);
                    },
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  });
                }}
                style={tw.style("w-full h-30 flex-row absolute")}
              >
                <View tw="absolute z-10 w-full flex-row items-center justify-end p-2">
                  <Edit
                    height={20}
                    width={20}
                    //@ts-ignore
                    color={tw.style("bg-black dark:bg-white").backgroundColor}
                  />
                  <Text tw="ml-1 text-xs text-black dark:text-white">
                    Cover
                  </Text>
                </View>
                {value && <Image source={{ uri: value }} tw="flex-1" />}
              </Pressable>
            )}
          />

          <View tw="mt-20 px-4">
            <Controller
              control={control}
              name="profilePicture"
              render={({ field: { onChange, value } }) => (
                <Pressable
                  onPress={() => {
                    pickImage({
                      onPick: (e) => {
                        onChange(e.uri);
                      },
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    });
                  }}
                  style={tw.style(
                    "w-20 h-20 rounded-full overflow-hidden border-2"
                  )}
                >
                  {value && <Image source={{ uri: value }} tw="flex-1" />}
                  <View tw="absolute z-10 h-full w-full flex-1 items-center justify-center">
                    <Upload
                      height={20}
                      width={20}
                      //@ts-ignore
                      color={tw.style("bg-black dark:bg-white").backgroundColor}
                    />
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
                    helperText={!isValid ? "username not available" : undefined}
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

            <Accordion.Root>
              <Accordion.Item value="options">
                <Accordion.Trigger tw="px-0">
                  <Accordion.Label>Links</Accordion.Label>
                  <Accordion.Chevron>
                    <ChevronUp
                      //@ts-ignore
                      color={tw.style("dark:bg-white bg-black").backgroundColor}
                    />
                  </Accordion.Chevron>
                </Accordion.Trigger>
                <Accordion.Content>
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
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            <Accordion.Root>
              <Accordion.Item value="options">
                <Accordion.Trigger tw="px-0">
                  <Accordion.Label>Page Settings</Accordion.Label>
                  <Accordion.Chevron>
                    <ChevronUp
                      //@ts-ignore
                      color={tw.style("dark:bg-white bg-black").backgroundColor}
                    />
                  </Accordion.Chevron>
                </Accordion.Trigger>
                <Accordion.Content>
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
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View tw="absolute bottom-0 w-full px-10 pb-5">
        <Button
          disabled={isSubmitting}
          tw={isSubmitting ? "opacity-50" : ""}
          onPress={handleSubmit(handleSubmitForm)}
        >
          Done
        </Button>
        <Text tw="mt-1 text-center text-sm text-red-500">
          {errors.submitError?.message}
        </Text>
      </View>
    </View>
  );
};
