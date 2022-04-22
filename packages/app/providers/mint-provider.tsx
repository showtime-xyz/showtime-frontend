import { ReactNode, useEffect, useReducer } from "react";

import { MintContext } from "app/context/mint-context";
import { mintNFTReducer, initialMintNFTState } from "app/hooks/use-mint-nft";

import { useSnackbar } from "design-system/snackbar";

import { useSafeAreaInsets } from "../lib/safe-area";

type MintProviderProps = {
  children: ReactNode;
};

export function MintProvider({ children }: MintProviderProps) {
  const snackbar = useSnackbar();
  const [state, dispatch] = useReducer(mintNFTReducer, initialMintNFTState);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (
      state.status === "mediaUpload" ||
      state.status === "nftJSONUpload" ||
      state.status === "minting" ||
      state.status === "transactionCompleted"
    ) {
      /**
       * TODO: replaced `Creating...` text, waiting for copywriting.
       * https://linear.app/showtime/issue/SHOW2-651#comment-0e19621c
       * */
      snackbar?.show({
        text: "Creating...",
        iconStatus: "waiting",
        bottom: insets.bottom + 64,
      });
    }

    if (state.status === "mintingSuccess") {
      snackbar?.show({
        text: "Created 🎉 Your NFT will appear in a minute!",
        iconStatus: "done",
        bottom: insets.bottom + 64,
        hideAfter: 4000,
        // Todo: navigate to NFT's detail, display placeholder
        // action: {
        //   text: "View",
        //   onPress: () => {
        //     snackbar?.hide();
        //   },
        //   element: (
        //     <View tw="flex-row items-center justify-center">
        //       <Text
        //         tw="text-white dark:text-gray-900 font-bold"
        //         variant="text-xs"
        //         numberOfLines={1}
        //       >
        //         View
        //       </Text>
        //       <ArrowRight
        //         width={14}
        //         height={14}
        //         color={isDark ? colors.gray[900] : colors.white}
        //       />
        //     </View>
        //   ),
        // },
      });
    }
  }, [state]);

  return (
    <MintContext.Provider value={{ state, dispatch }}>
      {children}
    </MintContext.Provider>
  );
}
