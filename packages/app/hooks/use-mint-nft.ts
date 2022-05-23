import { useContext } from "react";

import { ethers } from "ethers";
import * as FileSystem from "expo-file-system";
import { v4 as uuid } from "uuid";

import minterAbi from "app/abi/ShowtimeMT.json";
import { MintContext } from "app/context/mint-context";
import { useSignerAndProvider } from "app/hooks/use-signer-provider";
import { useWeb3 } from "app/hooks/use-web3";
import { track } from "app/lib/analytics";
import { getPinataToken, pinFileToIPFS, pinJSONToIPFS } from "app/lib/pinata";
import { dataURLtoFile } from "app/utilities";

import { useAlert } from "design-system/alert";

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
  transaction?: string;
  mediaIPFSHash?: string;
  nftIPFSHash?: string;
  isMagic?: boolean;
  file?: string | File;
  fileType?: string;
};

export const initialMintNFTState: MintNFTType = {
  status: "idle" as MintNFTStatus,
  mediaIPFSHash: undefined,
  nftIPFSHash: undefined,
  tokenId: undefined,
  transaction: undefined,
  isMagic: undefined,
  file: undefined,
  fileType: undefined,
};

export type ActionPayload = {
  mediaIPFSHash?: string;
  tokenId?: string;
  transaction?: string;
  nftIPFSHash?: string;
  isMagic?: boolean;
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
        isMagic: action.payload?.isMagic,
      };
    case "mintingSuccess":
      return {
        ...state,
        status: "mintingSuccess",
        tokenId: action.payload?.tokenId,
        transaction: action.payload?.transaction,
      };
    case "mintingError":
      return { ...state, status: "mintingError" };
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

const getFileMeta = async (file?: File | string) => {
  if (!file) {
    return;
  }

  if (typeof file === "string") {
    // Web Camera -  Data URI
    if (file.startsWith("data")) {
      const fileExtension = file.substring(
        file.indexOf(":") + 1,
        file.indexOf(";")
      );

      const contentWithoutMime = file.split(",")[1];
      const sizeInBytes = window.atob(contentWithoutMime).length;

      return {
        name: "unknown",
        type: fileExtension,
        size: sizeInBytes,
      };
    }

    // Native - File path
    else {
      const fileName = file.split("/").pop();
      const fileExtension = fileName?.split(".").pop();
      const fileInfo = await FileSystem.getInfoAsync(file);

      if (fileExtension && supportedImageExtensions.includes(fileExtension)) {
        return {
          name: fileName,
          type: "image/" + fileExtension,
          size: fileInfo.size,
        };
      } else if (
        fileExtension &&
        supportedVideoExtensions.includes(fileExtension)
      ) {
        return {
          name: fileName,
          type: "video/" + fileExtension,
          size: fileInfo.size,
        };
      }
    }
  }

  // Web File Picker - File Object
  else {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
    };
  }
};

export const useMintNFT = () => {
  const Alert = useAlert();
  const { state, dispatch } = useContext(MintContext);
  let { isMagicLogin } = useWeb3();
  const { getSignerAndProvider } = useSignerAndProvider();

  async function uploadMedia() {
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

      if (fileMetaData) {
        dispatch({
          type: "mediaUpload",
          payload: { file: state.file, fileType: fileMetaData.type },
        });

        const pinataToken = await getPinataToken();
        const formData = new FormData();

        if (typeof state.file === "string") {
          if (state.file?.startsWith("data")) {
            // Web Camera -  Data URI
            const file = dataURLtoFile(state.file, "unknown");

            formData.append("file", file);
          } else {
            // Native - File path string
            formData.append("file", {
              //@ts-ignore
              uri: state.file,
              name: fileMetaData.name,
              type: fileMetaData.type,
            });
          }
        } else if (state.file) {
          // Web File Picker - File Object
          formData.append("file", state.file);
        }

        formData.append(
          "pinataMetadata",
          JSON.stringify({
            name: uuid(),
          })
        );

        const mediaIPFSHash = await pinFileToIPFS({
          formData,
          token: pinataToken,
        }).then((res: any) => res.data.IpfsHash);

        dispatch({ type: "mediaUploadSuccess", payload: { mediaIPFSHash } });

        return mediaIPFSHash;
      }
    } catch (error) {
      console.error("media upload failed", error);
      dispatch({ type: "mediaUploadError" });
    }
  }

  async function uploadNFTJson(params: UseMintNFT) {
    let mediaIpfsHash = await uploadMedia();

    try {
      if (mediaIpfsHash) {
        dispatch({ type: "nftJSONUpload" });

        const pinataToken = await getPinataToken();
        const nftIPFSHash = await pinJSONToIPFS({
          content: {
            name: params.title,
            description: params.description,
            image: `ipfs://${mediaIpfsHash}`,
            ...(params.notSafeForWork
              ? { attributes: [{ value: "NSFW" }] }
              : {}),
          },
          token: pinataToken,
        }).then((res: any) => res.data.IpfsHash);

        dispatch({ type: "nftJSONUploadSuccess", payload: { nftIPFSHash } });
        return nftIPFSHash;
      }
    } catch (e) {
      console.error("NFT upload error ", e);
      dispatch({ type: "nftJSONUploadError" });
    }
  }

  async function mintNFT(params: UseMintNFT) {
    const nftJsonIpfsHash = await uploadNFTJson(params);

    const result = await getSignerAndProvider();
    if (result) {
      const { signer, signerAddress, provider } = result;

      try {
        dispatch({ type: "minting", payload: { isMagic: isMagicLogin } });

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
        });
      } catch (error) {
        console.error("Minting error ", error);
        dispatch({
          type: "mintingError",
        });
      }
    }
  }

  const setMedia = ({ file, fileType }: { file: any; fileType: any }) => {
    dispatch({ type: "setMedia", payload: { file, fileType } });
  };

  return { state, startMinting: mintNFT, setMedia };
};
