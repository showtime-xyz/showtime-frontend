import { useState } from "react";

import { ArrowLeft } from "@showtime-xyz/universal.icon";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

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
          handlePrevStep={() => {
            modalContext?.snapToIndex(0);
            setStep("select-drop");
          }}
        />
      );
    case "title":
      return (
        <CreateDropStepTitle
          handleNextStep={() => setStep("song-uri")}
          handlePrevStep={() => setStep("media")}
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

const CreateDropStepMedia = (props: StepProps) => {
  return (
    <Layout onBackPress={props.handlePrevStep} title="Create">
      <Text tw="text-center text-xl">
        Upload an image or video for your paid unlockable.
      </Text>
      <View tw="mt-8 items-center">
        <MediaPicker onChange={() => {}} />
        <Text tw="pt-4 text-sm text-gray-800">
          This could be an alternative album cover, unreleased content, or a
          short video snippet promoting your upcoming release.
        </Text>
      </View>
    </Layout>
  );
};

const CreateDropStepTitle = (props: StepProps) => {
  return <Text>Set title</Text>;
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
    <View tw="flex-1 px-4 py-8">
      <View tw="mb-8 flex-row items-center">
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
