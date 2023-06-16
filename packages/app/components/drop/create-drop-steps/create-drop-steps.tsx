import { useState } from "react";
import { useWindowDimensions } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { DataPill } from "@showtime-xyz/universal.data-pill";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
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
import { SelectDropType } from "./select-drop-type";
import { StepProps } from "./types";

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
  const [formValues, setFormValues] = useState({
    title: "Tell me tell me Pre-Save",
    description:
      "Promote an unreleased or live song to Spotify and Apple Music by pasting URLs below",
    price: "",
    file: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png",
  });
  const Alert = useAlert();

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
      return;
    }
    if (
      extension === "mov" ||
      (typeof file === "object" && file.type === "video/quicktime")
    ) {
    } else {
      setFormValues({
        ...formValues,
        file,
      });
    }
  };

  switch (step) {
    case "select-drop":
      return (
        <SelectDropTypeStep
          handleNextStep={() => {
            modalContext?.snapToIndex(1);
            setStep("media");
          }}
          handlePrevStep={() => {
            modalContext?.snapToIndex(0);
            modalContext?.pop();
          }}
        />
      );
    case "media":
      return (
        <CreateDropStepMedia
          handleNextStep={() => {
            setStep("title");
          }}
          handleFileChange={handleFileChange}
          handlePrevStep={() => {
            modalContext?.snapToIndex(0);
            setStep("select-drop");
          }}
          file={formValues.file}
        />
      );
    case "title":
      return (
        <CreateDropStepTitle
          handleNextStep={() => setStep("song-uri")}
          handlePrevStep={() => setStep("media")}
          file={formValues.file}
        />
      );
    case "song-uri":
      return (
        <CreateDropStepSongURI
          handleNextStep={() => setStep("preview")}
          handlePrevStep={() => setStep("title")}
          file={formValues.file}
          description={formValues.description}
          title={formValues.title}
        />
      );
    case "more-options":
      return (
        <CreateDropMoreOptions
          handleNextStep={() => setStep("song-uri")}
          handlePrevStep={() => setStep("song-uri")}
        />
      );
    default:
      return null;
  }
};

const SelectDropTypeStep = (props: StepProps) => {
  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <SelectDropType
        handleNextStep={props.handleNextStep}
        handlePrevStep={props.handlePrevStep}
      />
    </Layout>
  );
};

const CreateDropStepMedia = (
  props: StepProps & {
    file?: File | string;
    handleFileChange: (file: FilePickerResolveValue) => void;
  }
) => {
  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <Text tw="text-center text-xl">
        Upload an image or video for your paid unlockable.
      </Text>
      <View tw="mt-8 items-center">
        <MediaPicker onChange={props.handleFileChange} value={props.file} />
        <Text tw="pt-4 text-sm text-gray-800">
          This could be an alternative album cover, unreleased content, or a
          short video snippet promoting your upcoming release.
        </Text>
      </View>
      <Button
        size="regular"
        tw="mt-8 w-full self-center"
        onPress={props.handleNextStep}
      >
        Next
      </Button>
    </Layout>
  );
};

const CreateDropStepTitle = (
  props: StepProps & {
    file?: File | string;
  }
) => {
  const { width: windowWidth } = useWindowDimensions();

  const mediaDimension = Math.min(347, windowWidth - 32);

  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <View tw="mt-8 items-center">
        <Preview
          file={props.file}
          width={mediaDimension}
          height={mediaDimension}
          style={{ borderRadius: 16 }}
        />
      </View>
      <View tw="mt-4">
        <Fieldset
          label="Title"
          placeholder="Give your drop a title"
          numberOfLines={2}
          multiline
        />
      </View>
      <View tw="mt-4">
        <Fieldset
          label="Description"
          tw="flex-1"
          placeholder="Why should people collect this drop? Raffle Automatically selects a winner once your song is live."
          multiline
          textAlignVertical="top"
          numberOfLines={3}
        />
        <View tw="absolute right-3 top-3 flex-row items-center">
          <Raffle color="black" width={18} height={18} />
          <Text tw="mx-1 text-xs font-bold text-gray-800">Raffle</Text>
          <Switch checked size="small" />
        </View>
      </View>
      <View>
        <Text tw="mt-4">
          Promote a collectible, raffle or allow-list to attract more
          collectors. You can edit up to 30 minutes after creating.
        </Text>
      </View>
      <Button
        size="regular"
        tw="mt-4 w-full self-center"
        onPress={props.handleNextStep}
      >
        Next
      </Button>
    </Layout>
  );
};

const CreateDropStepSongURI = (props: StepProps) => {
  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <View tw="flex-row items-center">
        <Preview
          width={40}
          height={40}
          resizeMode="cover"
          style={{ borderRadius: 4 }}
          file={props.file}
        />
        <Text tw="ml-1 text-base font-semibold text-gray-600">
          {props.title}
        </Text>
      </View>
      <View tw="mt-8">
        <Text tw="text-sm font-semibold">Music Details</Text>
        <Text tw="pt-1 text-gray-600">{props.description}</Text>
        <View tw="mt-8 rounded-lg bg-gray-100 p-4">
          <View tw="flex-row items-center justify-between">
            <Text tw="text-sm font-semibold">More options</Text>
            <ChevronRight color="black" width={24} height={24} />
          </View>
          <View tw="items-start">
            <View tw="mt-2 flex-row flex-wrap" style={{ gap: 4 }}>
              <DataPill tw="bg-white" label="Open Edition" type="text" />
              <DataPill tw="bg-white" label="10% Royalties" type="text" />
              <DataPill tw="bg-white" label="Duration: 1 month" type="text" />
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const CreateDropMoreOptions = (props: StepProps) => {
  return <Text>More options</Text>;
};

const Layout = (props: {
  title: string;
  onBackPress: () => void;
  children: any;
}) => {
  return (
    <View tw="flex-1 py-8">
      <View tw="mx-4 mb-8 flex-row items-center">
        <Pressable tw="absolute" onPress={props.onBackPress}>
          <ArrowLeft color="black" width={24} height={24} />
        </Pressable>
        <View tw="mx-auto">
          <Text tw="text-lg">{props.title}</Text>
        </View>
      </View>
      <ScrollView tw="px-4">{props.children}</ScrollView>
    </View>
  );
};
