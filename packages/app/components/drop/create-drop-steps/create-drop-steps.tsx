import { useState } from "react";
import { useWindowDimensions } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { ArrowLeft, Raffle } from "@showtime-xyz/universal.icon";
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
    title: "",
    description: "",
    price: "",
    file: undefined,
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
        <CreateDropMoreOptions
          handleNextStep={() => setStep("preview")}
          handlePrevStep={() => setStep("title")}
        />
      );
    case "more-options":
      return (
        <CreateDropStepSongURI
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
  return <Text>URI</Text>;
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
