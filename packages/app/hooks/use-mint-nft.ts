import { useContext, useEffect, useRef } from "react";
import { Platform } from "react-native";

import axios from "axios";
import { ethers } from "ethers";
import * as FileSystem from "expo-file-system";
import { v4 as uuid } from "uuid";

import minterAbi from "app/abi/ShowtimeMT.json";
import { MintContext } from "app/context/mint-context";
import { axios as showtimeAPIAxios } from "app/lib/axios";
import { useWalletConnect } from "app/lib/walletconnect";
//@ts-ignore
import getWeb3Modal from "app/lib/web3-modal";
import { getBiconomy } from "app/utilities";

import { useAlert } from "design-system/alert";

import { useWeb3 } from "./use-web3";

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
  | "transactionCompleted";

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
    case "transactionCompleted":
      return {
        ...state,
        status: "transactionCompleted",
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
  const biconomyRef = useRef<any>();
  let { web3 } = useWeb3();

  const isMagic = !!web3;
  const connector = useWalletConnect();

  const mintNftParams = useRef<any>(null);

  useEffect(() => {
    if (mintNftParams.current && connector.connected) {
      console.log("connected to wallet, resuming mint request");
      mintNFT(mintNftParams.current);
    }
  }, [connector.connected]);

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
    }
  }

  async function uploadNFTJson(params: UseMintNFT) {
    let mediaIpfsHash;
    // if (state.mediaIPFSHash) {
    // mediaIpfsHash = state.mediaIPFSHash;
    // } else {
    mediaIpfsHash = await uploadMedia();
    // }
    try {
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
    }
  }

  async function mintNFT(params: UseMintNFT) {
    mintNftParams.current = null;
    let nftJsonIpfsHash;

    // if (state.nftIPFSHash) {
    // nftJsonIpfsHash = state.nftIPFSHash;
    // } else {
    nftJsonIpfsHash = await uploadNFTJson(params);
    // }

    let userAddress;
    try {
      if (web3) {
        const signer = web3.getSigner();
        const addr = await signer.getAddress();
        userAddress = addr;
        params.royaltiesPercentage = 0;
      } else if (Platform.OS === "web") {
        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        const web3Modal = await getWeb3Modal();
        web3 = new Web3Provider(await web3Modal.connect());
        const addr = await web3.getSigner().getAddress();
        userAddress = addr;
      } else if (connector.connected) {
        [userAddress] = connector.accounts.filter((addr) =>
          addr.startsWith("0x")
        );
      } else {
        await connector.connect();
        console.log("Not connected to wallet, sending connect request");
        mintNftParams.current = params;
        return;
      }

      console.log("user address for minting ", userAddress);

      if (!userAddress) {
        Alert.alert("Sorry! seems like you are not connected to the wallet");
        return;
      }

      dispatch({ type: "minting", payload: { isMagic } });

      biconomyRef.current = await (await getBiconomy(connector, web3)).biconomy;

      const contract = new ethers.Contract(
        //@ts-ignore
        process.env.NEXT_PUBLIC_MINTING_CONTRACT,
        minterAbi,
        biconomyRef.current.getSignerByAddress(userAddress)
      );

      const { data } = await contract.populateTransaction.issueToken(
        userAddress,
        params.editionCount,
        nftJsonIpfsHash,
        0,
        userAddress,
        params.royaltiesPercentage * 100
      );

      const provider = biconomyRef.current.getEthersProvider();
      console.log("** minting: opening wallet for signing **");

      const transaction = await provider
        .send("eth_sendTransaction", [
          {
            data,
            from: userAddress,
            to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
            signatureType: "EIP712_SIGN",
          },
        ])
        .catch((error: any) => {
          console.error("eth send transaction failure ", error);
          throw error;
        });

      dispatch({
        type: "transactionCompleted",
        payload: {
          transaction,
        },
      });

      provider.once(transaction, (result: any) => {
        // console.log(
        //   "token id! ",
        //   contract.interface
        //     .decodeFunctionResult("issueToken", result.logs[0].data)[0]
        //     .toNumber()
        // );
        dispatch({
          type: "mintingSuccess",
          payload: {
            tokenId: contract.interface
              .decodeFunctionResult("issueToken", result.logs[0].data)[0]
              .toString(),
            transaction: transaction,
          },
        });
      });
    } catch (error) {
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

  return { state, startMinting: mintNFT, setMedia };
};

function dataURLtoFile(dataurl: string, filename: string) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
