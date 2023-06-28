import { useState } from "react";
import { useWindowDimensions } from "react-native";

import { Controller } from "react-hook-form";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import { ErrorText, Fieldset } from "@showtime-xyz/universal.fieldset";
import { ArrowLeft, ChevronRight, Raffle } from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Switch } from "@showtime-xyz/universal.switch";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Preview } from "app/components/preview";
import { MAX_FILE_SIZE } from "app/hooks/use-drop-nft";
import { FilePickerResolveValue } from "app/lib/file-picker";

import { MediaPicker } from "./media-picker";
import { useMusicDropForm } from "./music-drop-form-utils";
import { SelectDropType } from "./select-drop-type";
import { StepProps } from "./types";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;

type CreateDropStep =
  | "media"
  | "title"
  | "song-uri"
  | "more-options"
  | "preview"
  | "select-drop";

export const CreateDropSteps = () => {
  const [step, setStep] = useState<CreateDropStep>("select-drop");
  const modalContext = useModalScreenContext();
  const {
    control,
    setValue,
    formState,
    setError,
    getValues,
    clearErrors,
    trigger,
  } = useMusicDropForm();
  const [formValues, setFormValues] = useState({
    title: "Tell me tell me Pre-Save",
    description:
      "Promote an unreleased or live song to Spotify and Apple Music by pasting URLs below",
    price: "",
    file: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png" as
      | string
      | File,
  });
  const Alert = useAlert();
  const title = getValues("title");
  const description = getValues("description");
  const file = getValues("file");

  const handleFileChange = (fileObj: FilePickerResolveValue) => {
    const { file, size } = fileObj;
    let extension;
    // On Native file is a string uri
    if (typeof file === "string") {
      extension = file.split(".").pop();
    }
    if (size && size > MAX_FILE_SIZE) {
      Alert.alert(
        "Oops, this file is too large (>30MB). Please upload a smaller file."
      );
      setError("file", {
        type: "custom",
        message: "Please retry!",
      });
      setValue("file", undefined);

      return;
    }
    if (
      extension === "mov" ||
      (typeof file === "object" && file.type === "video/quicktime")
    ) {
      setError("file", { type: "custom", message: "File type not supported" });
      setValue("file", undefined);
    } else {
      clearErrors("file");
      setValue("file", file);
    }
  };

  switch (step) {
    case "select-drop":
      return (
        <SelectDropTypeStep
          errors={formState.errors}
          trigger={trigger}
          control={control}
          handleNextStep={() => {
            modalContext?.snapToIndex(1);
            setStep("media");
          }}
          handlePrevStep={() => {
            modalContext?.snapToIndex(0);
            modalContext?.pop();
          }}
          title={title}
          description={description}
          file={file}
        />
      );
    case "media":
      return (
        <CreateDropStepMedia
          trigger={trigger}
          control={control}
          errors={formState.errors}
          handleNextStep={() => {
            setStep("title");
          }}
          handleFileChange={handleFileChange}
          handlePrevStep={() => {
            modalContext?.snapToIndex(0);
            setStep("select-drop");
          }}
          description={description}
          file={file}
          title={title}
        />
      );
    case "title":
      return (
        <CreateDropStepTitle
          control={control}
          errors={formState.errors}
          trigger={trigger}
          handleNextStep={() => setStep("song-uri")}
          handlePrevStep={() => setStep("media")}
          file={file}
          title={title}
          description={description}
        />
      );
    case "song-uri":
      return (
        <CreateDropStepSongURI
          control={control}
          errors={formState.errors}
          trigger={trigger}
          handleNextStep={() => setStep("preview")}
          handlePrevStep={() => setStep("title")}
          file={file}
          description={description}
          title={title}
          handleMoreOptions={() => setStep("more-options")}
        />
      );
    case "more-options":
      return (
        <CreateDropMoreOptions
          control={control}
          errors={formState.errors}
          trigger={trigger}
          handleNextStep={() => setStep("song-uri")}
          file={file}
          handlePrevStep={() => setStep("song-uri")}
          title={title}
          description={description}
        />
      );
    default:
      return null;
  }
};

const SelectDropTypeStep = (props: StepProps) => {
  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <SelectDropType handleNextStep={props.handleNextStep} />
    </Layout>
  );
};

const CreateDropStepMedia = (
  props: StepProps & {
    handleFileChange: (file: FilePickerResolveValue) => void;
  }
) => {
  const {
    control,
    errors,
    handleFileChange,
    handlePrevStep,
    trigger,
    handleNextStep,
  } = props;
  return (
    <Layout onBackPress={handlePrevStep} title="Create">
      <ScrollView tw="px-4">
        <Text tw="text-center text-xl">
          Upload an image or video for your paid unlockable.
        </Text>
        <View tw="mt-8 items-center">
          <Controller
            control={control}
            name="file"
            render={({ field: { value } }) => {
              return (
                <MediaPicker
                  onChange={handleFileChange}
                  value={value}
                  errorMessage={errors?.file?.message}
                />
              );
            }}
          />
          <Text tw="py-4 text-sm text-gray-700">
            This could be an alternative album cover, unreleased content, or a
            short video snippet promoting your upcoming release.
          </Text>
        </View>
      </ScrollView>
      <View tw="mt-4 px-4">
        <Button
          size="regular"
          tw="w-full self-center"
          onPress={async () => {
            const res = await trigger("file");
            if (res) {
              handleNextStep();
            }
          }}
        >
          Next
        </Button>
      </View>
    </Layout>
  );
};

const CreateDropStepTitle = (props: StepProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const { control, errors, handlePrevStep, handleNextStep, trigger } = props;
  const mediaDimension = Math.min(347, windowWidth - 32);

  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <ScrollView tw="px-4">
        <View tw="mt-8 items-center">
          <Preview
            file={props.file}
            width={mediaDimension}
            height={mediaDimension}
            style={{ borderRadius: 16 }}
          />
        </View>
        <View tw="mt-4">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Title"
                  placeholder="Give your drop a title"
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
        </View>
        <View tw="mt-4">
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Description"
                  tw="flex-1"
                  placeholder="Why should people collect this drop? Raffle Automatically selects a winner once your song is live."
                  multiline
                  textAlignVertical="top"
                  numberOfLines={3}
                  onBlur={onBlur}
                  errorText={errors.description?.message}
                  value={value}
                  onChangeText={onChange}
                />
              );
            }}
          />
          <View tw="absolute right-3 top-3 flex-row items-center">
            <Controller
              key="raffle"
              control={control}
              name="raffle"
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <Raffle color="black" width={18} height={18} />
                    <Text tw="mx-1 text-xs font-bold text-gray-800">
                      Raffle
                    </Text>
                    <Switch checked={value} onChange={onChange} size="small" />
                  </>
                );
              }}
            />
          </View>
        </View>
        <View>
          <Text tw="mt-4">
            Promote a collectible, raffle or allow-list to attract more
            collectors. You can edit up to 30 minutes after creating.
          </Text>
        </View>
      </ScrollView>
      <View tw="p-4">
        <Button
          size="regular"
          tw="mt-4 w-full self-center"
          onPress={async () => {
            const res = await trigger(["title", "description"]);
            if (res) {
              handleNextStep();
            }
          }}
        >
          Next
        </Button>
      </View>
    </Layout>
  );
};

const CreateDropStepSongURI = (
  props: StepProps & { handleMoreOptions: () => void }
) => {
  const { errors, control, handleNextStep, trigger } = props;
  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <ScrollView tw="px-4">
        <View tw="flex-row items-center">
          <Preview
            width={40}
            height={40}
            resizeMode="cover"
            style={{ borderRadius: 4 }}
            file={props.file}
          />
          <Text tw="ml-2 text-base font-semibold text-gray-600">
            {props.title}
          </Text>
        </View>
        <View tw="mt-8">
          <Text tw="text-sm font-semibold">Music Details</Text>
          <Text tw="pt-1 text-gray-600">{props.description}</Text>
          <View tw="mt-8 rounded-lg bg-gray-100 p-4">
            <Pressable
              tw="flex-row items-center justify-between"
              onPress={props.handleMoreOptions}
            >
              <Text tw="text-sm font-semibold">More options</Text>
              <ChevronRight color="black" width={24} height={24} />
            </Pressable>
            <View tw="items-start">
              <View tw="mt-2 flex-row flex-wrap" style={{ gap: 4 }}>
                <DataPill tw="bg-white" label="Open Edition" type="text" />
                <DataPill tw="bg-white" label="10% Royalties" type="text" />
                <DataPill tw="bg-white" label="Duration: 1 month" type="text" />
              </View>
            </View>
          </View>
        </View>

        <View tw="mt-8 flex-row">
          <Text tw="pb-2 text-sm text-gray-600 dark:text-gray-200">
            This drop will be owned by you
          </Text>
        </View>

        <View tw="mt-4 flex-1">
          <View tw="flex-1 flex-row">
            <Controller
              control={control}
              name="hasAcceptedTerms"
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    onPress={() => onChange(!value)}
                    tw="flex-1 flex-row items-center rounded-xl bg-gray-100 p-4 dark:bg-gray-900"
                  >
                    <Checkbox
                      onChange={(v) => onChange(v)}
                      checked={value}
                      aria-label="I agree to the terms and conditions"
                    />

                    <Text tw="px-4 text-gray-600 dark:text-gray-400">
                      I have the rights to publish this content, and understand
                      it will be minted on the Polygon network.
                    </Text>
                  </Pressable>
                </>
              )}
            />
          </View>
          {errors.hasAcceptedTerms?.message ? (
            <ErrorText>{errors.hasAcceptedTerms?.message}</ErrorText>
          ) : null}
        </View>

        <View tw="mt-4">
          <Button
            size="regular"
            onPress={async () => {
              const res = await trigger("hasAcceptedTerms");
              if (res) {
                handleNextStep();
              }
            }}
          >
            Create Drop
          </Button>
        </View>
      </ScrollView>
    </Layout>
  );
};

const CreateDropMoreOptions = (props: StepProps) => {
  const [isUnlimited, setIsUnlimited] = useState(false);
  const { control, errors, handleFileChange, handlePrevStep, handleNextStep } =
    props;
  const durationOptions = [
    { label: "1 day", value: SECONDS_IN_A_DAY },
    { label: "1 week", value: SECONDS_IN_A_WEEK },
    { label: "1 month", value: SECONDS_IN_A_MONTH },
  ];
  return (
    <Layout onBackPress={props.handlePrevStep} title="More options">
      <View tw="flex-1 flex-row">
        <Fieldset
          tw={isUnlimited ? "flex-1 opacity-40" : "flex-1 opacity-100"}
          label="Edition size"
          placeholder="Enter number"
          helperText="How many editions will be available to collect"
          disabled={isUnlimited}
        />

        <Pressable
          onPress={() => setIsUnlimited((isUnlimited) => !isUnlimited)}
          tw="absolute right-4 top-10 flex-row items-center"
          style={{ opacity: 1 }}
        >
          <Text tw="mr-2 text-base font-medium text-gray-600 dark:text-gray-400">
            Unlimited
          </Text>
          <Checkbox
            onChange={() => setIsUnlimited((isUnlimited) => !isUnlimited)}
            checked={isUnlimited}
            aria-label="unlimited editions for drop"
          />
        </Pressable>
      </View>
      <Fieldset
        tw="flex-1"
        label="Your royalties (%)"
        placeholder="Enter number"
        helperText="Earn royalties each time an edition is sold."
      />
      <Fieldset
        tw="w-full"
        label="Duration"
        helperText="How long the drop will be available to claim"
        selectOnly
        select={{
          options: durationOptions,
          placeholder: "Duration",
          onChange: () => {},
        }}
      />
      <Fieldset
        tw="flex-1"
        label={
          <View tw="mr-5 flex">
            <Text tw="font-semibold dark:text-white">
              Explicit visual (18+)
            </Text>
            <Text tw="max-w-[100%] pt-1 text-xs dark:text-white">
              Do not check if your song lyrics are explicit.
            </Text>
          </View>
        }
        switchOnly
        switchProps={{
          checked: false,
          onChange: () => {},
        }}
      />
      <Button
        size="regular"
        tw="w-full self-center"
        onPress={props.handlePrevStep}
      >
        Save
      </Button>
    </Layout>
  );
};

const Layout = (props: {
  title: string;
  onBackPress: () => void;
  children: any;
}) => {
  return (
    <View tw="flex-1">
      <View tw="mx-4 my-8 flex-row items-center">
        <Pressable tw="absolute" onPress={props.onBackPress}>
          <ArrowLeft color="black" width={24} height={24} />
        </Pressable>
        <View tw="mx-auto">
          <Text tw="text-lg">{props.title}</Text>
        </View>
      </View>
      {props.children}
    </View>
  );
};
