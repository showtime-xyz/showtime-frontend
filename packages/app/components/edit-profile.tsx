import { useEffect, useMemo } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSWRConfig } from "swr";

import { useLinkOptions } from "app/hooks/use-link-options";
import { useUser } from "app/hooks/use-user";
import { useValidateUsername } from "app/hooks/use-validate-username";
import { axios } from "app/lib/axios";
import { yup } from "app/lib/yup";
import { useRouter } from "app/navigation/use-router";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";
import { SORT_FIELDS } from "app/utilities";

import { Accordion, Button, Fieldset, Text, View } from "design-system";
import { Avatar } from "design-system/avatar";
import { ChevronUp } from "design-system/icon";
import { tw } from "design-system/tailwind";

const editProfileValidationSchema = yup.object({
  username: yup.string().min(3),
  bio: yup.string().max(300),
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
      await axios({
        url: "/v1/editname",
        method: "POST",
        data: newValues,
      });

      mutate(MY_INFO_ENDPOINT);

      router.replace(`/profile/${user?.data.profile.wallet_addresses[0]}`);
    } catch (e) {
      setError("submitError", { message: "Something went wrong" });
      console.error("edit profile failed ", e);
    }
  };

  return (
    <View tw="flex-1 pb-20">
      <KeyboardAwareScrollView>
        <View tw="p-4">
          <Avatar url={user?.data?.profile?.img_url} size={50} />
        </View>
        <View>
          <View tw="flex-row mt-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Fieldset
                  tw="flex-1 mr-4"
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
              <Accordion.Trigger>
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
                          placeholder={v.name}
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
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
              <Accordion.Trigger>
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
      </KeyboardAwareScrollView>
      <View tw="absolute bottom-0 w-full py-10">
        <Button
          disabled={isSubmitting}
          tw={isSubmitting ? "opacity-50" : ""}
          onPress={handleSubmit(handleSubmitForm)}
        >
          Done
        </Button>
        <Text tw="mt-1 text-red-500 text-sm text-center">
          {errors.submitError?.message}
        </Text>
      </View>
    </View>
  );
};
