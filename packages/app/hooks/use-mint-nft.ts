import { useEffect, useContext, useRef } from "react";
import { Alert } from "react-native";

import axios from "axios";
import { ethers } from "ethers";
import * as FileSystem from "expo-file-system";
import { v4 as uuid } from "uuid";

import minterAbi from "app/abi/ShowtimeMT.json";
import { MintContext } from "app/context/mint-context";
import { axios as showtimeAPIAxios } from "app/lib/axios";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy } from "app/utilities";

import { useWeb3 } from "./use-web3";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // in bytes

export type MintNFTStatus =
  | "idle"
  | "mediaUpload"
  | "setMedia"
  | "mediaUploadError"
  | "mediaUploadSuccess"
  | "nftJSONUpload"
  | "nftJSONUploadSuccess"
  | "nftJSONUploadError"
  | "minting"
  | "mintingError"
  | "mintingSuccess"
  | "transactionCompleted";

export type MintNFTType = {
  status: MintNFTStatus;
  tokenId?: string;
  transaction?: string;
  mediaIPFSHash?: string;
  nftIPFSHash?: string;
  isMagic?: boolean;
  filePath?: string;
  fileType?: string;
  fileObject?: File;
};

export const initialMintNFTState: MintNFTType = {
  status: "idle" as MintNFTStatus,
  mediaIPFSHash: undefined,
  nftIPFSHash: undefined,
  tokenId: undefined,
  transaction: undefined,
  isMagic: undefined,
  filePath: undefined,
  fileType: undefined,
};

export type ActionPayload = {
  mediaIPFSHash?: string;
  tokenId?: string;
  transaction?: string;
  nftIPFSHash?: string;
  isMagic?: boolean;
  filePath?: string;
  fileType?: string;
  // web-only
  fileObject?: File;
};

export const mintNFTReducer = (
  state: MintNFTType,
  action: { type: MintNFTStatus; payload?: ActionPayload }
): MintNFTType => {
  switch (action.type) {
    case "setMedia": {
      return {
        ...state,
        filePath: action.payload?.filePath,
        fileType: action.payload?.fileType,
        fileObject: action.payload?.fileObject,
      };
    }
    case "mediaUpload":
      return {
        ...state,
        status: "mediaUpload",
        mediaIPFSHash: undefined,
        tokenId: undefined,
        transaction: undefined,
        filePath: action.payload?.filePath,
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
  filePath: string;
  title: string;
  description: string;
  notSafeForWork: boolean;
  editionCount: number;
  royaltiesPercentage: number;
};

export const supportedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
export const supportedVideoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

const getFileNameAndType = (filePath: string) => {
  const fileName = filePath.split("/").pop();
  const fileExtension = fileName?.split(".").pop();
  if (fileExtension && supportedImageExtensions.includes(fileExtension)) {
    return {
      name: fileName,
      type: "image/" + fileExtension,
    };
  } else if (
    fileExtension &&
    supportedVideoExtensions.includes(fileExtension)
  ) {
    return {
      name: fileName,
      type: "video/" + fileExtension,
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
  const { state, dispatch } = useContext(MintContext);
  const biconomyRef = useRef<any>();
  const { web3 } = useWeb3();

  const isMagic = !!web3;
  const connector = useWalletConnect();

  const mintNftParams = useRef<any>(null);

  useEffect(() => {
    if (mintNftParams.current && connector.connected) {
      console.log("connected to wallet, resuming mint request");
      mintNFT(mintNftParams.current);
    }
  }, [connector.connected]);

  async function uploadMedia(params: UseMintNFT) {
    // Media Upload
    try {
      const fileMetaData = getFileNameAndType(params.filePath);
      const fileInfo = await FileSystem.getInfoAsync(params.filePath);
      if (typeof fileInfo.size === "number" && fileInfo.size > MAX_FILE_SIZE) {
        // TODO: improve alert
        Alert.alert("File too big! Please use a file smaller than 50MB.");
        return;
      }

      console.log("Received file meta data ", fileMetaData);

      if (fileMetaData) {
        dispatch({
          type: "mediaUpload",
          payload: { filePath: params.filePath, fileType: fileMetaData.type },
        });

        const pinataToken = await getPinataToken();
        const formData = new FormData();

        formData.append("file", {
          //@ts-ignore
          uri: params.filePath,
          name: fileMetaData.name,
          type: fileMetaData.type,
        });

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
    if (state.mediaIPFSHash) {
      mediaIpfsHash = state.mediaIPFSHash;
    } else {
      mediaIpfsHash = await uploadMedia(params);
    }
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

    if (state.nftIPFSHash) {
      nftJsonIpfsHash = state.nftIPFSHash;
    } else {
      nftJsonIpfsHash = await uploadNFTJson(params);
    }

    let userAddress;
    try {
      const isMagic = !!web3;
      if (isMagic) {
        const signer = web3.getSigner();
        const addr = await signer.getAddress();
        userAddress = addr;
        params.royaltiesPercentage = 0;
      } else {
        if (connector.connected) {
          [userAddress] = connector.accounts.filter((addr) =>
            addr.startsWith("0x")
          );
        } else {
          await connector.connect();
          console.log("Not connected to wallet, sending connect request");
          mintNftParams.current = params;
          return;
        }
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

  const setMedia = ({
    filePath,
    fileObject,
  }: {
    filePath?: string;
    fileObject?: File;
  }) => {
    dispatch({ type: "setMedia", payload: { filePath, fileObject } });
  };

  return { state, startMinting: mintNFT, setMedia };
};
