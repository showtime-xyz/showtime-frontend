import { useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { yup } from "app/lib/yup";

const SECONDS_IN_A_DAY = 24 * 60 * 60;

const defaultValues = {
  royalty: 10,
  duration: 7 * SECONDS_IN_A_DAY,
  notSafeForWork: false,
  editionSize: 15,
  raffle: false,
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
  const [isUnlimited, setIsUnlimited] = useState(true);

  const dropValidationSchema = useMemo(
    () =>
      yup.lazy(() => {
        const baseSchema = yup.object({
          file: yup.mixed().required("Media is required"),
          paidNFTUnlockableLink: yup.string().required("Required"),
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
          notSafeForWork: yup.boolean().default(defaultValues.notSafeForWork),
          googleMapsUrl: yup.string().url(),
          radius: yup.number().min(0.01).max(10),
        });

        return baseSchema;
      }),
    []
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
    defaultValues,
    isUnlimited,
    setIsUnlimited,
  };
};
