import { Platform, Linking } from "react-native";

import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Clock, Close } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useModalScreenContext } from "@showtime-xyz/universal.modal-screen";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { PayoutSettings } from "app/components/settings/tabs/payouts";

import { CountryPicker } from "./country-picker";
import { useOnBoardCreator } from "./hooks/use-onboard-creator";
import { useOnboardingStatus } from "./hooks/use-onboarding-status";

const websiteUrl = `${
  __DEV__
    ? "http://localhost:3000"
    : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
}`;

export const PayoutsSetup = () => {
  const modalContext = useModalScreenContext();
  const onboardinStatus = useOnboardingStatus();

  const router = useRouter();
  const isDark = useIsDarkMode();

  if (onboardinStatus.status === "loading") {
    return (
      <Layout
        onBackPress={() => modalContext?.pop()}
        closeIcon
        title="Complete payout info"
      >
        <View tw="items-center p-4">
          <Spinner />
        </View>
      </Layout>
    );
  }

  if (onboardinStatus.status === "onboarded") {
    return (
      <Layout
        onBackPress={() => modalContext?.pop()}
        closeIcon
        title="You're approved"
      >
        <View tw="items-center p-4" style={{ rowGap: 24 }}>
          <Text tw="text-base text-gray-900 dark:text-gray-100">
            Your cash payout has been approved for creating Star Drops!
          </Text>
          <Button
            tw="w-full"
            size="regular"
            onPress={() => {
              router.push("/drop/free");
            }}
          >
            Create Star Drop
          </Button>
        </View>
      </Layout>
    );
  }

  if (onboardinStatus.status === "processing") {
    return (
      <Layout
        onBackPress={() => modalContext?.pop()}
        closeIcon
        title="Come back later"
      >
        <View tw="items-center p-4" style={{ rowGap: 24 }}>
          <Clock color={isDark ? "white" : "black"} width={54} height={54} />
          <Text tw="text-gray-900 dark:text-gray-100">
            Unable to purchase Star Drop at this time. We need more time to
            approve your payment.{" "}
            <Text tw="font-bold">
              You will be notified when you’re approved.{" "}
            </Text>
            Usually 1-2 hours. In the meanwhile if you want to change your
            stripe details. Press below
          </Text>
          <PayoutSettings
            refreshUrl={`${websiteUrl}/payouts/setup?stripeRefresh=true&platform=${Platform.OS}`}
            returnUrl={`${websiteUrl}/payouts/setup?stripeReturn=true&platform=${Platform.OS}`}
          />
          <Button
            tw="w-full"
            onPress={() => {
              modalContext?.pop();
            }}
          >
            Okay
          </Button>
        </View>
      </Layout>
    );
  }

  if (onboardinStatus.status === "not_onboarded") {
    return (
      <Layout
        onBackPress={() => router.pop()}
        closeIcon
        title="Payment processing details"
      >
        <BottomSheetModalProvider>
          <CompleteStripeFlow />
        </BottomSheetModalProvider>
      </Layout>
    );
  }

  return null;
};

const Layout = (props: {
  title: string;
  onBackPress: () => void;
  children: any;
  closeIcon?: boolean;
  topRightComponent?: React.ReactNode;
}) => {
  const isDark = useIsDarkMode();
  const insets = useSafeAreaInsets();
  return (
    <View tw="flex-1" style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
      <View tw="mx-4 my-8 flex-row items-center">
        <Pressable tw="absolute z-20" onPress={props.onBackPress}>
          {props.closeIcon ? (
            <Close color={isDark ? "white" : "black"} width={24} height={24} />
          ) : (
            <ArrowLeft
              color={isDark ? "white" : "black"}
              width={24}
              height={24}
            />
          )}
        </Pressable>
        <View tw="w-full flex-row items-center justify-center">
          <View>
            <Text tw="text-base font-bold text-black dark:text-white">
              {props.title}
            </Text>
          </View>
          <View tw="absolute right-0">{props.topRightComponent}</View>
        </View>
      </View>
      {props.children}
    </View>
  );
};

const businessType = [
  {
    label: "Individual",
    value: "individual",
  },
  {
    label: "Company",
    value: "company",
  },
];

const CompleteStripeFlow = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      businessType: "individual",
    } as any,
  });

  const selectedCountryCode = watch("countryCode");
  const onboardingCreator = useOnBoardCreator();

  const onSubmit = async (data: any) => {
    const res = await onboardingCreator.trigger({
      email: data.email,
      country_code: data.countryCode,
      refresh_url: `${websiteUrl}/payouts/setup?stripeRefresh=true&platform=${Platform.OS}`,
      return_url: `${websiteUrl}/payouts/setup?stripeReturn=true&platform=${Platform.OS}`,
      business_type: data.businessType,
    });
    if (Platform.OS === "web") {
      window.location.href = res.url;
    } else {
      Linking.openURL(res.url);
    }
  };

  return (
    <View tw="p-4" style={{ rowGap: 16 }}>
      <Text tw="text-gray-700 dark:text-gray-200">
        The following is required in order to take payments. You’ll be
        redirected to create an account with Stripe who will hold and payout
        your drop sales.
      </Text>
      <Controller
        control={control}
        {...register("email", {
          required: "Please enter an email",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Please enter a valid email",
          },
        })}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <Fieldset
              ref={ref}
              label="Email"
              placeholder="Enter an email"
              onBlur={onBlur}
              errorText={errors.email?.message}
              value={value}
              onChangeText={onChange}
            />
          );
        }}
      />

      <View tw="flex-row" style={{ columnGap: 16 }}>
        <CountryPicker
          handleCountrySelect={(code: string) => {
            setValue("countryCode", code);
          }}
          selectedCountryCode={selectedCountryCode}
        />

        <Controller
          control={control}
          name="businessType"
          rules={{
            required: {
              value: true,
              message: "Please select a business type",
            },
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            return (
              <Fieldset
                ref={ref}
                tw="flex-1"
                label="Business type"
                onBlur={onBlur}
                errorText={errors.countryCode?.message}
                selectOnly
                select={{
                  options: businessType,
                  placeholder: "Business type",
                  value: value,
                  onChange,
                  tw: "flex-1",
                }}
              />
            );
          }}
        />
      </View>
      <Button
        onPress={handleSubmit(onSubmit)}
        tw={onboardingCreator.isMutating ? `opacity-30` : ""}
        size="regular"
      >
        <View tw="flex-row items-center" style={{ columnGap: 8 }}>
          <Image source={require("./stripe-logo.png")} height={20} width={20} />
          <Text tw="font-semibold text-white dark:text-black">
            {onboardingCreator.isMutating
              ? "Please wait..."
              : "Setup cash payout"}
          </Text>
        </View>
      </Button>
    </View>
  );
};
