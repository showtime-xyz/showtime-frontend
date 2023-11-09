import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@showtime-xyz/universal.button";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { AddPhoto } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useRedirectToCreatorTokensShare } from "app/hooks/use-redirect-to-creator-token-share-screen";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { DropFileZone } from "app/lib/drop-file-zone";
import { useFilePicker } from "app/lib/file-picker";

import { Preview } from "../preview";

export const ReviewCreatorToken = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid: formIsValid },
  } = useForm<{ profilePicture: string | File; name: string }>({
    mode: "all",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });
  const router = useRouter();
  const pickFile = useFilePicker();
  const isDark = useIsDarkMode();
  const { user } = useUser();
  const redirectToCreatorTokensShare = useRedirectToCreatorTokensShare();
  const handleSubmitForm = async () => {
    await axios({
      url: "/v1/creator-token/metadata/prepare",
      method: "POST",
    });
    if (user?.data.profile.username) {
      redirectToCreatorTokensShare({
        username: user?.data.profile.username,
        type: "launched",
      });
    }
  };
  const { top } = useSafeAreaInsets();

  return (
    <View tw="p-4" style={{ paddingTop: top + 20 }}>
      <Text tw="text-2xl font-bold">Review your Token</Text>
      <View tw="h-4" />
      <Text>
        Your Creator Token is a collectible, and your profile picture will be
        its image. You can update this later.
      </Text>
      <View tw="mt-4 items-center">
        <Controller
          control={control}
          name="profilePicture"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <DropFileZone onChange={({ file }) => onChange(file)}>
              <>
                <Pressable
                  aria-label="Pick Token photo"
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
                  }}
                  tw="h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200 bg-white  dark:border-gray-700 dark:bg-gray-700"
                >
                  {value ? (
                    <View>
                      <Preview
                        tw="h-full w-full"
                        file={value}
                        width={128}
                        height={128}
                        style={{ width: 128, height: 128 }}
                      />
                      {/* <View tw="absolute h-full w-full items-center justify-center">
                      <Text tw="text-white">Replace</Text>
                    </View> */}
                    </View>
                  ) : (
                    <>
                      <View tw="absolute z-10 h-full w-full flex-1 items-center justify-center">
                        <AddPhoto height={20} width={20} color={colors.white} />
                      </View>
                    </>
                  )}
                </Pressable>

                {error?.message ? <ErrorText>{error.message}</ErrorText> : null}
              </>
            </DropFileZone>
          )}
        />
      </View>
      <View tw="mt-4">
        <Controller
          control={control}
          name="name"
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { error },
          }) => (
            <Fieldset
              ref={ref}
              label="Name"
              placeholder="Your display name"
              value={value}
              textContentType="name"
              errorText={error?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardAppearance={isDark ? "dark" : "light"}
            />
          )}
        />
      </View>
      <View tw="mt-4">
        <Button
          disabled={isSubmitting || !formIsValid}
          tw={isSubmitting || !formIsValid ? "opacity-50" : ""}
          onPress={handleSubmit(handleSubmitForm)}
          size="regular"
        >
          {isSubmitting ? "Submitting..." : "Create your Token"}
        </Button>
      </View>
    </View>
  );
};
