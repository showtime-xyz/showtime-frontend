import { useState, useReducer } from "react";
import { Platform } from "react-native";

import axios from "axios";
import { ethers } from "ethers";
import { providers } from "ethers";
import { Deferrable, resolveProperties } from "ethers/lib/utils";
import { v4 as uuid } from "uuid";

import { useAlert } from "@showtime-xyz/universal.alert";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { useSnackbar } from "@showtime-xyz/universal.snackbar";

import minterAbi from "app/abi/ShowtimeMT.json";
import { useBiconomy } from "app/hooks/use-biconomy";
import { track } from "app/lib/analytics";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { getFileMeta, getPinataToken } from "app/utilities";
import { isMobileWeb } from "app/utilities";

import { PROFILE_NFTS_QUERY_KEY } from "./api-hooks";
import { useMatchMutate } from "./use-match-mutate";
import { useUploadMediaToPinata } from "./use-upload-media-to-pinata";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

async function populateTransaction(
  provider: providers.Provider,
  deferrableTransaction: Deferrable<providers.TransactionRequest>
): Promise<providers.TransactionRequest> {
  const resolvedTransaction = await resolveProperties(deferrableTransaction);

  const to = resolvedTransaction.to
    ? await provider.resolveName(resolvedTransaction.to)
    : undefined;

  const transaction = {
    ...resolvedTransaction,
    ...(to && { to }),
  };

  const gasLimit =
    transaction.gasLimit ?? (await provider.estimateGas(transaction));

  return {
    ...transaction,
    //@ts-ignore
    txGas: gasLimit,
  };
}

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
  error?: string;
};

let initialMintNFTState: MintNFTType = {
  status: "idle" as MintNFTStatus,
  mediaIPFSHash: undefined,
  nftIPFSHash: undefined,
  tokenId: undefined,
  transaction: undefined,
  file: undefined,
  fileType: undefined,
  loading: false,
};

export const setInitialMedia = (media: { file: any; fileType?: string }) => {
  initialMintNFTState = {
    ...initialMintNFTState,
    file: media.file,
    fileType: media.fileType,
  };
};

export type ActionPayload = {
  mediaIPFSHash?: string;
  tokenId?: string;
  transaction?: string;
  nftIPFSHash?: string;
  file?: string | File;
  fileType?: string;
  error?: string;
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
        error: undefined,
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
      return {
        ...state,
        status: "mintingError",
        loading: false,
        error: action.payload?.error,
      };
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

type SignatureFunctionType = {
  params: UseMintNFT;
  nftJsonIpfsHash: string;
  contractCallData?: string;
  contract?: ethers.Contract;
  populatedTransaction?: ethers.providers.TransactionRequest;
  result: ReturnType<typeof useBiconomy>;
} | null;

export const supportedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
export const supportedVideoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

export const useMintNFT = () => {
  const Alert = useAlert();
  const [state, dispatch] = useReducer(mintNFTReducer, initialMintNFTState);

  const snackbar = useSnackbar();
  const insets = useSafeAreaInsets();
  const matchMutate = useMatchMutate();
  const [signMessageData, setSignMessageData] = useState({
    status: "idle",
    data: null as SignatureFunctionType,
  });

  const bottom = Platform.OS === "web" ? insets.bottom : insets.bottom + 64;

  const result = useBiconomy();
  const uploadMedia = useUploadMediaToPinata();

  async function uploadMediaFn(params: UseMintNFT) {
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

      Logger.log("Received file meta data ", fileMetaData);

      if (fileMetaData && state.file) {
        dispatch({
          type: "mediaUpload",
          payload: { file: state.file, fileType: fileMetaData.type },
        });
        const mediaIPFSHash = await uploadMedia({
          file: state.file,
          notSafeForWork: params.notSafeForWork,
        });
        dispatch({ type: "mediaUploadSuccess", payload: { mediaIPFSHash } });
        return mediaIPFSHash;
      }
    } catch (error) {
      Logger.error("media upload failed", error);
      dispatch({ type: "mediaUploadError" });
      throw error;
    }
  }

  async function uploadNFTJson(params: UseMintNFT) {
    try {
      const mediaIpfsHash = await uploadMediaFn(params);

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
        Logger.log("Uploaded nft json to ipfs ", nftIPFSHash);
        return nftIPFSHash;
      }
    } catch (e) {
      Logger.error("NFT upload error ", e);
      dispatch({ type: "nftJSONUploadError" });
      throw e;
    }
  }

  async function signTransaction(signData: SignatureFunctionType) {
    if (signData) {
      const {
        params,
        populatedTransaction,
        contract,
        nftJsonIpfsHash,
        result,
        contractCallData,
      } = signData;
      Logger.log("** minting: opening wallet for signing **");

      if (isMobileWeb()) {
        setSignMessageData({
          status: "sign_requested",
          data: { params, nftJsonIpfsHash, result },
        });
      }

      if (result) {
        const { signerAddress, provider } = result;

        dispatch({ type: "minting" });

        const transaction = await provider
          .send("eth_sendTransaction", [
            {
              ...populatedTransaction,
              data: contractCallData,
              from: signerAddress,
              to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
              signatureType: "EIP712_SIGN",
            },
          ])
          .catch((error: any) => {
            Logger.error("eth send transaction failure ", error);
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
              tokenId: contract?.interface
                .decodeFunctionResult("issueToken", result.logs[0].data)[0]
                .toString(),
              transaction: transaction,
            },
          });
          track("NFT Created");

          matchMutate((key) => key.includes(PROFILE_NFTS_QUERY_KEY));
        });
      }
    }
  }

  async function mintNFT(params: UseMintNFT) {
    try {
      const nftJsonIpfsHash = await uploadNFTJson(params);
      if (result) {
        const { signer, signerAddress, provider } = result;

        const contract = new ethers.Contract(
          //@ts-ignore
          process.env.NEXT_PUBLIC_MINTING_CONTRACT,
          minterAbi,
          signer
        );

        const { data: contractCallData } =
          await contract.populateTransaction.issueToken(
            signerAddress,
            params.editionCount,
            nftJsonIpfsHash,
            0,
            signerAddress,
            params.royaltiesPercentage * 100
          );

        const populatedTransaction = await populateTransaction(provider, {
          data: contractCallData,
          from: signerAddress,
          to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
        });

        if (isMobileWeb()) {
          setSignMessageData({
            status: "should_sign",
            data: {
              params,
              nftJsonIpfsHash,
              result,
              contract,
              contractCallData,
              populatedTransaction,
            },
          });
        } else {
          await signTransaction({
            params,
            nftJsonIpfsHash,
            result,
            contract,
            contractCallData,
            populatedTransaction,
          });
        }
      }
    } catch (error: any) {
      captureException(error);
      snackbar?.update({
        text: "Something went wrong. Please try again",
        bottom,
        iconStatus: "default",
        hideAfter: 4000,
      });
      Logger.error("Minting error ", error);
      dispatch({
        type: "mintingError",
        payload: {
          error: error?.message,
        },
      });
    }
  }

  Logger.log("minting state ", state);

  const setMedia = ({ file, fileType }: { file: any; fileType: any }) => {
    dispatch({ type: "setMedia", payload: { file, fileType } });
  };

  return {
    state,
    startMinting: mintNFT,
    setMedia,
    signTransaction,
    signMessageData,
    shouldShowSignMessage: signMessageData.status === "should_sign",
  };
};
