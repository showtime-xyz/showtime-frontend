import { useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { yup } from "app/lib/yup";

const SECONDS_IN_A_DAY = 24 * 60 * 60;
const SECONDS_IN_A_MONTH = 30 * SECONDS_IN_A_DAY;

const defaultValues = {
  royalty: 10,
  duration: SECONDS_IN_A_MONTH,
  hasAcceptedTerms: false,
  notSafeForWork: false,
  raffle: false,
  days: 7,
  price: 8,
};

export const getDefaultDate = () => {
  const now = new Date();
  const day = now.getDay();
  // Local time 12:00AM the upcoming Friday is ideal.
  const minus = 5 - day;

  if (day <= 4) {
    const thisWeek = new Date(
      new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0
      )
    );
    const thisWeekFriday = thisWeek.setDate(thisWeek.getDate() + minus);
    return new Date(thisWeekFriday);
  }
  // If not, fallback to 12:00AM local time the next week
  const nextweek = new Date(
    new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0
    )
  );
  const nextFriday = nextweek.setDate(nextweek.getDate() + minus + 7);
  return new Date(nextFriday);
};

export const useStarDropForm = () => {
  const [isSaveDrop, setIsSaveDrop] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(true);

  const dropValidationSchema = useMemo(
    () =>
      yup.lazy(() => {
        const baseSchema = yup
          .object({
            file: yup.mixed().required("Media is required"),
            title: yup
              .string()
              .label("Title")
              .required("Title is a required field")
              .max(55),
            description: yup
              .string()
              .max(280)
              .required("Description is a required field"),
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
            ...(isSaveDrop
              ? {}
              : {
                  releaseDate: yup
                    .date()
                    .nullable()
                    .min(
                      getDefaultDate(),
                      "The date you entered is invalid. Please enter a date that is at least 24 hours from now and after the next occurrence of 12:00 AM (midnight)"
                    ),
                }),
            spotifyUrl: yup
              .string()
              .test(
                "no-playlist",
                "Please only enter Track URI. You can fill this later.",
                (value) => {
                  if (!value) return true;
                  return !/(playlist)/i.test(value);
                }
              )
              .required("Spotify URI is required"),
            appleMusicTrackUrl: yup.string(),
          })
          .test({
            name: "apple-music-or-spotify",
            message: "Please enter either an Apple Music or Spotify URL.",
            test: (value) => {
              if (!isSaveDrop) return true;
              return Boolean(value.spotifyUrl || value.appleMusicTrackUrl);
            },
          });

        return baseSchema;
      }),
    [isSaveDrop]
  );

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema as any),
    mode: "onChange",
    shouldFocusError: true,
    reValidateMode: "onChange",
  });

  return {
    control,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
    watch,
    setValue,
    getValues,
    setIsSaveDrop,
    defaultValues,
    isSaveDrop,
    isUnlimited,
    setIsUnlimited,
  };
};
