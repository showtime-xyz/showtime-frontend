import { useMemo, useEffect } from "react";
import { Platform } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { useDropEditDetails } from "app/hooks/use-drop-edit-details";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { yup } from "app/lib/yup";
import { createParam } from "app/navigation/use-param";

const dropValidationSchema = yup.object({
  spotifyUrl: yup.string().optional().nullable(),
  appleMusicUrl: yup.string().optional().nullable(),
});
type Query = {
  contractAddress: string;
  chainName: string;
  tokenId: string;
};

const { useParam } = createParam<Query>();
export const DropEditDetails = () => {
  const isDark = useIsDarkMode();
  const [contractAddress] = useParam("contractAddress");
  const [tokenId] = useParam("tokenId");
  const [chainName] = useParam("chainName");
  const { data, mutate, mutateNFT } = useNFTDetailByTokenId({
    contractAddress,
    tokenId,
    chainName,
  });

  const { editDropDetails } = useDropEditDetails();

  const defaultValues = useMemo(() => {
    return {
      name: data?.data?.item.token_name || "",
      description: data?.data?.item.token_description || "",
    };
  }, [data?.data?.item.token_description, data?.data?.item.token_name]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<any>({
    resolver: yupResolver(dropValidationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues,
  });

  const router = useRouter();

  useEffect(() => {
    resetForm(defaultValues);
  }, [resetForm, defaultValues]);

  const onSubmit = async (values: typeof defaultValues) => {
    const res = await editDropDetails(contractAddress, values);

    if (res) {
      const data = await mutate();
      const nft = data?.data.item;
      if (!nft) return;
      if (
        Platform.OS === "web" &&
        router.pathname === "/profile/[username]/[dropSlug]"
      ) {
        const username = nft.creator_username;
        const dropSlug = nft.slug;
        router.replace(
          {
            pathname: "/profile/[username]/[dropSlug]",
            query: {
              ...router.query,
              username: username,
              dropSlug,
            },
          },
          getNFTSlug(nft),
          { shallow: true }
        );
        mutateNFT();
      } else {
        mutateNFT();
        router.pop();
      }
    }
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetScrollView>
        <View tw="w-full px-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  label="Title"
                  placeholder="Sweet"
                  onBlur={onBlur}
                  errorText={errors.name?.message}
                  value={value}
                  onChangeText={onChange}
                  numberOfLines={2}
                  multiline
                />
              );
            }}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value, ref } }) => {
              return (
                <Fieldset
                  ref={ref}
                  tw="mt-4"
                  label="Description"
                  placeholder="Why should people collect this drop?"
                  multiline
                  textAlignVertical="top"
                  onBlur={onBlur}
                  errorText={errors.description?.message}
                  value={value}
                  numberOfLines={3}
                  onChangeText={onChange}
                />
              );
            }}
          />
          <Button tw="mt-4" onPress={handleSubmit(onSubmit)} disabled={false}>
            {"Submit"}
          </Button>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModalProvider>
  );
};
