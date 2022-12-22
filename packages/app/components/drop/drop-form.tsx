import React, { useRef, useState } from "react";
import {
  Platform,
  ScrollView as RNScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { UseDropNFT, useDropNFT } from "app/hooks/use-drop-nft";
import { useModalScreenViewStyle } from "app/hooks/use-modal-screen-view-style";
import { usePersistForm } from "app/hooks/use-persist-form";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { useWeb3 } from "app/hooks/use-web3";
import { useFilePicker } from "app/lib/file-picker";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useRudder } from "app/lib/rudderstack";
import { yup } from "app/lib/yup";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;

const defaultValues = {
  royalty: 10,
  editionSize: 100,
  duration: SECONDS_IN_A_WEEK,
  password: "",
  googleMapsUrl: "",
  radius: 1, // In kilometers
  hasAcceptedTerms: false,
  notSafeForWork: false,
};

const durationOptions = [
  { label: "1 day", value: SECONDS_IN_A_DAY },
  { label: "1 week", value: SECONDS_IN_A_WEEK },
  { label: "1 month", value: SECONDS_IN_A_MONTH },
];

const dropValidationSchema = yup.object({
  file: yup.mixed().required("Media is required"),
  title: yup.string().required(),
  description: yup.string().max(280).required(),
  editionSize: yup
    .number()
    .required()
    .typeError("Please enter a valid number")
    .min(1)
    .max(100000)
    .default(defaultValues.editionSize),
  royalty: yup
    .number()
    .required()
    .typeError("Please enter a valid number")
    .max(69)
    .default(defaultValues.royalty),
  hasAcceptedTerms: yup
    .boolean()
    .default(defaultValues.hasAcceptedTerms)
    .required()
    .isTrue("You must accept the terms and conditions."),
  notSafeForWork: yup.boolean().default(defaultValues.notSafeForWork),
  googleMapsUrl: yup.string().url(),
  radius: yup.number().min(0.01).max(10),
});

// const { useParam } = createParam<{ transactionId: string }>()
const DROP_FORM_DATA_KEY = "drop_form_local_data";
export const DropForm = () => {
  const isDark = useIsDarkMode();
  const { rudder } = useRudder();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset: resetForm,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: defaultValues,
  });

  const gatingType = watch("gatingType");
  const bottomBarHeight = useBottomTabBarHeight();
  // const [transactionId, setTransactionId] = useParam('transactionId')
  const spotifyTextInputRef = React.useRef<TextInput | null>(null);

  const { state, dropNFT, onReconnectWallet, reset } = useDropNFT();
  const user = useUser();

  const headerHeight = useHeaderHeight();
  const redirectToCreateDrop = useRedirectToCreateDrop();
  const { isMagic } = useWeb3();
  const scrollViewRef = useRef<RNScrollView>(null);
  const windowWidth = useWindowDimensions().width;

  const [accordionValue, setAccordionValue] = useState("");
  const { clearStorage } = usePersistForm(DROP_FORM_DATA_KEY, {
    watch,
    setValue,
    /**
     * Todo: use Context to draft file data, because use localStoge max size generally <= 5mb, so exclude `file` field first
     */
    exclude: Platform.select({
      web: ["file"],
      default: [],
    }),
  });

  const onSubmit = (values: UseDropNFT) => {
    dropNFT(values, clearStorage);
  };

  // useEffect(() => {
  //   if (transactionId) {
  //     pollTransaction(transactionId)
  //   }
  // }, [transactionId])

  // useEffect(() => {
  //   if (state.transactionId) {
  //     setTransactionId(transactionId)
  //   }
  // }, [state.transactionId])

  const pickFile = useFilePicker();
  const share = useShare();
  const router = useRouter();
  const modalScreenViewStyle = useModalScreenViewStyle({ mode: "margin" });

  // if (state.transactionHash) {
  //   return <View>
  //     <Text>Loading</Text>
  //   </View>
  // }

  const selectedDuration = watch("duration");

  const selectedDurationLabel = React.useMemo(
    () => durationOptions.find((d) => d.value === selectedDuration)?.label,
    [selectedDuration]
  );

  return (
    <View tw="p-4">
      {/* <View tw="flex-row">
        <View tw="flex-1">
          <CreateCard
            title="Post"
            description="Share photos and videos every day for you community to add to their
        collection."
            ctaLabel="Create Post"
            onPress={() => {}}
          />
        </View>
        <View tw="w-4" />
        <View tw="flex-1">
          <CreateCard
            title="Music drop"
            description="Promote your latest music: give your fans a free collectible for saving your song to their library."
            ctaLabel="Create Music Drop"
            onPress={() => {}}
          />
        </View>
      </View> */}
      <View tw="h-4" />
      <View tw="lg:flex-row">
        <View tw="flex-1">
          <CreateCard
            title="Music drop"
            description="Promote your latest music: give your fans a free collectible for saving your song to their library."
            ctaLabel="Create Music Drop"
            onPress={() => {}}
          />
        </View>
        <View tw="h-4 w-4" />
        <View tw="flex-1">
          <CreateCard
            title="Event drop"
            description="Connect with fans who show up to your events. This drop lets people mark themselves at your event location."
            ctaLabel="Create Event Drop"
            onPress={() => {}}
          />
        </View>
        <View tw="h-4 w-4" />
        <View tw="flex-1">
          <CreateCard
            title="VIP drop"
            description="A collectible for your biggest fans of your choice. Don't give up your VIP password so easily!"
            ctaLabel="Create VIP Drop"
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
};

const CreateCard = ({
  title,
  description,
  ctaLabel,
  onPress,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  onPress: () => void;
}) => {
  return (
    <View tw="min-h-[216px] justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
      <Text tw="text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </Text>
      <Text tw="text-base text-gray-900 dark:text-gray-100">{description}</Text>
      <Button onPress={onPress}>{ctaLabel}</Button>
    </View>
  );
};
