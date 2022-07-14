import { useContext, useState } from "react";
import { Platform } from "react-native";

import axios from "axios";
import { ethers } from "ethers";
import { v4 as uuid } from "uuid";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import minterAbi from "app/abi/ShowtimeMT.json";
import { MintContext } from "app/context/mint-context";
import { useBiconomy } from "app/hooks/use-biconomy";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { track } from "app/lib/analytics";
import { axios as showtimeAPIAxios } from "app/lib/axios";
import { getFileMeta } from "app/utilities";
import { isMobileWeb } from "app/utilities";

import { PROFILE_NFTS_QUERY_KEY } from "./api-hooks";
import { useMatchMutate } from "./use-match-mutate";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

export type MintNFTStatus =
  | "idle"
  | "mediaUpload"
  | "mediaUploadError"
  | "mediaUploadSuccess"
  | "nftJSONUpload"
  | "nftJSONUploadSuccess"
  | "nftJSONUploadError"
  | "minting"
  | "mintingError"
  | "mintingSuccess"
  | "transactionInitiated";

export type MintActionType = MintNFTStatus | "reset" | "setMedia";

export type MintNFTType = {
  status: MintNFTStatus;
  tokenId?: string;
  loading?: boolean;
  transaction?: string;
  mediaIPFSHash?: string;
  nftIPFSHash?: string;
  file?: string | File;
  fileType?: string;
};

export const initialMintNFTState: MintNFTType = {
  status: "idle" as MintNFTStatus,
  mediaIPFSHash: undefined,
  nftIPFSHash: undefined,
  tokenId: undefined,
  transaction: undefined,
  file: undefined,
  fileType: undefined,
  loading: false,
};

export type ActionPayload = {
  mediaIPFSHash?: string;
  tokenId?: string;
  transaction?: string;
  nftIPFSHash?: string;
  file?: string | File;
  fileType?: string;
};

export const mintNFTReducer = (
  state: MintNFTType,
  action: {
    type: MintActionType;
    payload?: ActionPayload;
  }
): MintNFTType => {
  switch (action.type) {
    case "reset": {
      return {
        ...initialMintNFTState,
      };
    }
    case "setMedia": {
      return {
        ...initialMintNFTState,
        file: action.payload?.file,
        fileType: action.payload?.fileType,
      };
    }
    case "mediaUpload":
      return {
        ...state,
        status: "mediaUpload",
        mediaIPFSHash: undefined,
        tokenId: undefined,
        transaction: undefined,
        file: action.payload?.file,
        fileType: action.payload?.fileType,
        loading: true,
      };
    case "mediaUploadSuccess":
      return {
        ...state,
        status: "mediaUploadSuccess",
        mediaIPFSHash: action.payload?.mediaIPFSHash,
      };
    case "mediaUploadError":
      return {
        ...state,
        status: "mediaUploadError",
      };
    case "nftJSONUpload":
      return {
        ...state,
        nftIPFSHash: undefined,
        status: "nftJSONUpload",
      };
    case "nftJSONUploadSuccess":
      return {
        ...state,
        status: "nftJSONUploadSuccess",
        nftIPFSHash: action.payload?.nftIPFSHash,
      };
    case "transactionInitiated":
      return {
        ...state,
        status: "transactionInitiated",
        transaction: action.payload?.transaction,
      };
    case "nftJSONUploadError":
      return {
        ...state,
        status: "nftJSONUploadError",
      };
    case "minting":
      return {
        ...state,
        status: "minting",
        tokenId: undefined,
        transaction: undefined,
      };
    case "mintingSuccess":
      return {
        ...state,
        status: "mintingSuccess",
        tokenId: action.payload?.tokenId,
        transaction: action.payload?.transaction,
        loading: false,
      };
    case "mintingError":
      return { ...state, status: "mintingError", loading: false };
    default:
      return state;
  }
};

export type UseMintNFT = {
  title: string;
  description: string;
  notSafeForWork: boolean;
  editionCount: number;
  royaltiesPercentage: number;
};

export const supportedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
export const supportedVideoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

const getPinataToken = () => {
  return showtimeAPIAxios({
    url: "/v1/pinata/key",
    method: "POST",
    data: {},
  }).then((res) => res.token);
};

export const useMintNFT = () => {
  const Alert = useAlert();
  const { state, dispatch } = useContext(MintContext);
  const snackbar = useSnackbar();
  const { userAddress } = useCurrentUserAddress();
  const router = useRouter();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const matchMutate = useMatchMutate();
  const [signMessageData, setSignMessageData] = useState({
    status: "idle",
    data: null,
  });
  const shouldShowSignMessage =
    (signMessageData.status === "should_sign" || state.status === "minting") &&
    isMobileWeb()
      ? true
      : false;

  const bottom = Platform.OS === "web" ? insets.bottom : insets.bottom + 64;

  const result = useBiconomy();

  async function uploadMedia() {
    // Media Upload
    try {
      const fileMetaData = await getFileMeta(state.file);

      if (!fileMetaData) return;

      if (
        typeof fileMetaData.size === "number" &&
        fileMetaData.size > MAX_FILE_SIZE
      ) {
        Alert.alert(
          `This file is too big. Please use a file smaller than 50 MB.`
        );
        return;
      }

      console.log("Received file meta data ", fileMetaData);

      if (fileMetaData) {
        dispatch({
          type: "mediaUpload",
          payload: { file: state.file, fileType: fileMetaData.type },
        });

        const pinataToken = await getPinataToken();
        const formData = new FormData();

        if (typeof state.file === "string") {
          // Web Camera -  Data URI
          if (state.file?.startsWith("data")) {
            const file = dataURLtoFile(state.file, "unknown");

            formData.append("file", file);
          }
          // Native - File path string
          else {
            formData.append("file", {
              //@ts-ignore
              uri: state.file,
              name: fileMetaData.name,
              type: fileMetaData.type,
            });
          }
        }

        // Web File Picker - File Object
        else if (state.file) {
          formData.append("file", state.file);
        }

        formData.append(
          "pinataMetadata",
          JSON.stringify({
            name: uuid(),
          })
        );

        const mediaIPFSHash = await axios
          .post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
              Authorization: `Bearer ${pinataToken}`,
              "Content-Type": `multipart/form-data`,
            },
          })
          .then((res: any) => res.data.IpfsHash);
        console.log("Uploaded file to ipfs ", mediaIPFSHash);
        dispatch({ type: "mediaUploadSuccess", payload: { mediaIPFSHash } });
        return mediaIPFSHash;
      }
    } catch (error) {
      console.error("media upload failed", error);
      dispatch({ type: "mediaUploadError" });
      throw error;
    }
  }

  async function uploadNFTJson(params: UseMintNFT) {
    try {
      let mediaIpfsHash = await uploadMedia();

      if (mediaIpfsHash) {
        dispatch({ type: "nftJSONUpload" });
        const pinataToken = await getPinataToken();
        const nftIPFSHash = await axios
          .post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            {
              pinataMetadata: { name: uuid() },
              pinataContent: {
                name: params.title,
                description: params.description,
                image: `ipfs://${mediaIpfsHash}`,
                ...(params.notSafeForWork
                  ? { attributes: [{ value: "NSFW" }] }
                  : {}),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${pinataToken}`,
              },
            }
          )
          .then((res: any) => res.data.IpfsHash);
        dispatch({ type: "nftJSONUploadSuccess", payload: { nftIPFSHash } });
        console.log("Uploaded nft json to ipfs ", nftIPFSHash);
        return nftIPFSHash;
      }
    } catch (e) {
      console.error("NFT upload error ", e);
      dispatch({ type: "nftJSONUploadError" });
      throw e;
    }
  }

  // @ts-ignore
  async function signTransaction({ params, nftJsonIpfsHash, result }) {
    console.log("** minting: opening wallet for signing **");

    if (isMobileWeb()) {
      setSignMessageData({
        status: "sign_requested",
        data: { params, nftJsonIpfsHash, result },
      });
    }

    if (result) {
      const { signer, signerAddress, provider } = result;

      const contract = new ethers.Contract(
        //@ts-ignore
        process.env.NEXT_PUBLIC_MINTING_CONTRACT,
        minterAbi,
        signer
      );

      const { data } = await contract.populateTransaction.issueToken(
        signerAddress,
        params.editionCount,
        nftJsonIpfsHash,
        0,
        signerAddress,
        params.royaltiesPercentage * 100
      );

      dispatch({ type: "minting" });

      const transaction = await provider
        .send("eth_sendTransaction", [
          {
            data,
            from: signerAddress,
            to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
            signatureType: "EIP712_SIGN",
          },
        ])
        .catch((error: any) => {
          console.error("eth send transaction failure ", error);
          throw error;
        });

      dispatch({
        type: "transactionInitiated",
        payload: {
          transaction,
        },
      });

      provider.once(transaction, (result: any) => {
        dispatch({
          type: "mintingSuccess",
          payload: {
            tokenId: contract.interface
              .decodeFunctionResult("issueToken", result.logs[0].data)[0]
              .toString(),
            transaction: transaction,
          },
        });
        track("NFT Created");

        matchMutate((key) => key.includes(PROFILE_NFTS_QUERY_KEY));

        snackbar?.update({
          text: "Created! Your NFT will appear in a minute!",
          iconStatus: "done",
          bottom,
          hideAfter: 5000,
          action: {
            text: "View",
            onPress: () => {
              snackbar.hide();
              router.push(
                Platform.OS === "web"
                  ? `/@${user?.data?.profile?.username ?? userAddress}`
                  : `/profile`
              );
            },
          },
        });
      });
    }
  }

  async function mintNFT(params: UseMintNFT) {
    snackbar?.show({
      text: "Creating… This may take a few minutes.",
      iconStatus: "waiting",
      bottom,
      disableGestureToClose: true,
    });

    try {
      const nftJsonIpfsHash = await uploadNFTJson(params);

      if (isMobileWeb()) {
        setSignMessageData({
          status: "should_sign",
          data: { params, nftJsonIpfsHash, result },
        });
      } else {
        signTransaction({ params, nftJsonIpfsHash, result });
      }
    } catch (error) {
      snackbar?.update({
        text: "Something went wrong. Please try again",
        bottom,
        iconStatus: "default",
        hideAfter: 4000,
      });
      console.error("Minting error ", error);
      dispatch({
        type: "mintingError",
      });
    }
  }

  console.log("minting state ", state);

  const setMedia = ({ file, fileType }: { file: any; fileType: any }) => {
    dispatch({ type: "setMedia", payload: { file, fileType } });
  };

  return {
    state,
    startMinting: mintNFT,
    setMedia,
    signTransaction,
    signMessageData,
    shouldShowSignMessage,
  };
};

function dataURLtoFile(dataurl: string, filename: string) {
  let arr = dataurl.split(","),
    //@ts-ignore
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
