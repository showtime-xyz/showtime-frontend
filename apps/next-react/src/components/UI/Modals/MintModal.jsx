import { Dialog, Transition } from "@headlessui/react";
import Checkbox from "../Inputs/Checkbox";
import Switch from "../Inputs/Switch";
import ChevronRight from "@/components/Icons/ChevronRight";
import Button from "../Buttons/Button";
import { useState, Fragment } from "react";
import ChevronLeft from "@/components/Icons/ChevronLeft";
import PercentageIcon from "@/components/Icons/PercentageIcon";
import TextareaAutosize from "react-autosize-textarea";
import IpfsUpload from "@/components/IpfsUpload";
import { useMemo } from "react";
import axios from "@/lib/axios";
import { v4 as uuid } from "uuid";
import { ethers } from "ethers";
import { getBiconomy } from "@/lib/biconomy";
import getWeb3Modal from "@/lib/web3Modal";
import minterAbi from "@/data/ShowtimeMT.json";
import PolygonIcon from "@/components/Icons/PolygonIcon";
import Link from "next/link";
import TwitterIcon from "@/components/Icons/Social/TwitterIcon";
import { useRef } from "react";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useTheme } from "next-themes";
import useProfile from "@/hooks/useProfile";
import { ExclamationIcon } from "@heroicons/react/outline";
import XIcon from "@/components/Icons/XIcon";
import { buildFormData } from "@/lib/utilities";
import * as Sentry from "@sentry/nextjs";
import ListModal from "./ListModal";

const MAX_FILE_SIZE = 1024 * 1024 * 50; // 50MB

const MODAL_PAGES = {
  GENERAL: "general",
  OPTIONS: "options",
  LOADING: "loading",
  MINTING: "minting",
  SUCCESS: "success",
  CHANGE_WALLET: "change_wallet",
  NO_WALLET: "no_wallet",
};

const MintModal = ({ open, onClose }) => {
  const { myProfile } = useProfile();
  const { resolvedTheme } = useTheme();
  const isWeb3ModalActive = useRef(false);
  const confettiCanvas = useRef(null);
  const [modalPage, setModalPage] = useState(MODAL_PAGES.GENERAL);

  useEffect(() => {
    if (!myProfile) return;

    if (
      myProfile.wallet_addresses_excluding_email_v2?.filter(({ address }) =>
        address.startsWith("0x")
      )?.length > 0
    )
      return;

    setModalPage(MODAL_PAGES.NO_WALLET);
  }, [myProfile]);

  const shotConfetti = () => {
    if (!confettiCanvas.current) return;

    const confettiSource = confetti.create(confettiCanvas.current, {
      resize: true,
      disableForReducedMotion: true,
    });
    const end = Date.now() + 1 * 1000;
    const colors = ["#4DEAFF", "#894DFF", "#E14DFF"];

    const frame = () => {
      confettiSource({
        particleCount: 3,
        angle: 120,
        spread: 55,
        colors: colors,
        shapes: ["circle"],
      });
      confettiSource({
        particleCount: 3,
        angle: 60,
        spread: 55,
        colors: colors,
        shapes: ["circle"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ipfsHash, setIpfsHash] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sourcePreview, setSourcePreview] = useState({
    type: null,
    size: null,
    ext: null,
    src: null,
  });
  const [editionCount, setEditionCount] = useState(1);
  const [royaltiesPercentage, setRoyaltiesPercentage] = useState(10);
  const [notSafeForWork, setNotSafeForWork] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [tokenID, setTokenID] = useState("");
  const [listModalOpen, setListModalOpen] = useState(false);

  useEffect(() => {
    if (
      sourcePreview.type !== "model" ||
      window.customElements.get("model-viewer")
    )
      return;
    import("@google/model-viewer");
  }, [sourcePreview.type]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIpfsHash("");
    setSourcePreview({ type: null, size: null, ext: null, src: null });
    setEditionCount(1);
    setRoyaltiesPercentage(10);
    setNotSafeForWork(false);
    setHasAcceptedTerms(false);
    setTransactionHash("");
    setTokenID("");
    setModalPage(MODAL_PAGES.GENERAL);
  };

  const saveDraft = () =>
    axios.post("/api/mint/draft", {
      title,
      description,
      number_of_copies: editionCount,
      nsfw: notSafeForWork,
      royalties: royaltiesPercentage,
      ipfs_hash: ipfsHash,
      agreed_to_terms: hasAcceptedTerms,
      mime_type: sourcePreview.src
        ? `${sourcePreview.type}/${sourcePreview.ext}`
        : null,
      file_size: sourcePreview.size,
    });
  const markDraftMinted = () =>
    axios.post("/api/mint/draft", {
      title,
      description,
      number_of_copies: editionCount,
      nsfw: notSafeForWork,
      royalties: royaltiesPercentage,
      ipfs_hash: ipfsHash,
      agreed_to_terms: hasAcceptedTerms,
      mime_type: sourcePreview.src
        ? `${sourcePreview.type}/${sourcePreview.ext}`
        : null,
      file_size: sourcePreview.size,
      minted: true,
    });

  const loadDraft = async () => {
    try {
      const draft = await axios.get("/api/mint/draft").then(({ data }) => data);

      setTitle(draft.title || "");
      setDescription(draft.description || "");
      setHasAcceptedTerms(draft.agreed_to_terms || false);
      setNotSafeForWork(draft.nsfw || false);
      setEditionCount(
        draft.number_of_copies != null ? parseInt(draft.number_of_copies) : 1
      );
      setRoyaltiesPercentage(
        draft.royalties != null ? parseInt(draft.royalties) : 10
      );
      setIpfsHash(draft.ipfs_hash || null);
      if (draft.ipfs_hash)
        setSourcePreview({
          type: draft.mime_type.split("/")[0],
          size: draft.file_size,
          ext: draft.mime_type.split("/")[1],
          src: `https://gateway.pinata.cloud/ipfs/${draft.ipfs_hash}`,
        });
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    loadDraft();
  }, []);

  const trueOnClose = () => {
    if (isWeb3ModalActive.current || modalPage === MODAL_PAGES.LOADING) return;

    if ([MODAL_PAGES.SUCCESS, MODAL_PAGES.MINTING].includes(modalPage))
      resetForm();
    else
      saveDraft().finally(() => {
        if (modalPage === MODAL_PAGES.GENERAL) return;

        resetForm();
        loadDraft();
      });

    onClose();
  };

  const openListModal = () => {
    onClose();
    setListModalOpen(true);
  };

  const cancelUpload = () => {
    setIsUploading(false);
    setIpfsHash("");
    setSourcePreview({ type: null, size: null, ext: null, src: null });
  };

  const onFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE)
      return alert("File too big! Please use a file smaller than 50MB.");

    const type =
      file.type.split("/")[0] ||
      (file.name.endsWith(".glb") || file.name.endsWith(".gltf")
        ? "model"
        : "");

    setIsUploading(true);
    setSourcePreview({
      type,
      size: file.size,
      ext: file.type.split("/")[1] || file.name.split(".").pop(),
      src: URL.createObjectURL(file),
    });

    const { token: pinataToken } = await axios
      .post("/api/pinata/generate-key")
      .then((res) => res.data);

    const formData = buildFormData({ file, pinataMetadata: { name: uuid() } });

    const { IpfsHash } = await axios
      .post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          Authorization: `Bearer ${pinataToken}`,
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      })
      .then((res) => res.data);

    setIpfsHash(IpfsHash);
    setIsUploading(false);
  };

  const isValid = useMemo(() => {
    if (!title || !hasAcceptedTerms || !editionCount || !ipfsHash) return false;
    if (
      editionCount < 1 ||
      editionCount > 10000 ||
      royaltiesPercentage > 69 ||
      royaltiesPercentage < 0
    )
      return false;

    return true;
  }, [title, hasAcceptedTerms, editionCount, royaltiesPercentage, ipfsHash]);

  const mintToken = async () => {
    setModalPage(MODAL_PAGES.LOADING);

    const { token: pinataToken } = await axios
      .post("/api/pinata/generate-key")
      .then((res) => res.data);

    const { IpfsHash: contentHash } = await axios
      .post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          pinataMetadata: { name: uuid() },
          pinataContent: {
            name: title,
            description,
            image: `ipfs://${ipfsHash}`,
            ...(notSafeForWork ? { attributes: [{ value: "NSFW" }] } : {}),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${pinataToken}`,
          },
        }
      )
      .then((res) => res.data);

    const web3Modal = getWeb3Modal({ theme: resolvedTheme });
    isWeb3ModalActive.current = true;
    const { biconomy, web3 } = await getBiconomy(
      web3Modal,
      () => (isWeb3ModalActive.current = false)
    ).catch((error) => {
      if (error !== "Modal closed by user") throw error;

      isWeb3ModalActive.current = false;
      throw setModalPage(MODAL_PAGES.GENERAL);
    });
    const signerAddress = await web3.getSigner().getAddress();

    if (
      !myProfile?.wallet_addresses_v2
        ?.map(({ address }) => address.toLowerCase())
        ?.includes(signerAddress.toLowerCase())
    ) {
      return setModalPage(MODAL_PAGES.CHANGE_WALLET);
    }

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MINTING_CONTRACT,
      minterAbi,
      biconomy.getSignerByAddress(signerAddress)
    );

    const { data } = await contract.populateTransaction.issueToken(
      signerAddress,
      editionCount,
      contentHash,
      0,
      signerAddress,
      royaltiesPercentage * 100
    );

    const provider = biconomy.getEthersProvider();

    const transaction = await provider
      .send("eth_sendTransaction", [
        {
          data,
          from: signerAddress,
          to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
          signatureType: "EIP712_SIGN",
        },
      ])
      .catch((error) => {
        if (error.code === 4001) throw setModalPage(MODAL_PAGES.GENERAL);

        if (
          JSON.parse(
            error?.body || error?.error?.body || "{}"
          )?.error?.message?.includes("caller is not minter")
        ) {
          alert("Your address is not approved for minting.");
          throw setModalPage(MODAL_PAGES.GENERAL);
        }

        throw error;
      });

    markDraftMinted();
    setTransactionHash(transaction);

    provider.once(transaction, (result) => {
      setTokenID(
        contract.interface
          .decodeFunctionResult("issueToken", result.logs[0].data)[0]
          .toNumber()
      );
      setModalPage(MODAL_PAGES.SUCCESS);
    });

    setModalPage(MODAL_PAGES.MINTING);
  };

  const renderedPage = ((type) => {
    switch (type) {
      case MODAL_PAGES.GENERAL:
        return (
          <CreatePage
            {...{
              title,
              setTitle,
              description,
              setDescription,
              ipfsHash,
              isUploading,
              onFileUpload,
              cancelUpload,
              sourcePreview,
              editionCount,
              royaltiesPercentage,
              setModalPage,
              hasAcceptedTerms,
              setHasAcceptedTerms,
              isValid,
              mintToken,
            }}
          />
        );
      case MODAL_PAGES.OPTIONS:
        return (
          <OptionsPage
            {...{
              editionCount,
              setEditionCount,
              royaltiesPercentage,
              setRoyaltiesPercentage,
              notSafeForWork,
              setNotSafeForWork,
            }}
          />
        );
      case MODAL_PAGES.LOADING:
        return <LoadingPage />;
      case MODAL_PAGES.MINTING:
        return <MintingPage transactionHash={transactionHash} />;
      case MODAL_PAGES.SUCCESS:
        return (
          <SuccessPage
            transactionHash={transactionHash}
            tokenID={tokenID}
            shotConfetti={shotConfetti}
            listToken={openListModal}
          />
        );
      case MODAL_PAGES.CHANGE_WALLET:
        return <WalletErrorPage mintToken={mintToken} />;
      case MODAL_PAGES.NO_WALLET:
        return <NoWalletPage />;
    }
  })(modalPage);

  return (
    <>
      <ListModal
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        token={{
          token_id: tokenID,
          mime_type: `${sourcePreview.type}/${sourcePreview.ext}`,
          source_url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
          token_name: title,
          token_description: description,
          creator_name: myProfile?.name,
          creator_img_url: myProfile?.img_url,
          creator_verified: myProfile?.verified ? 1 : 0,
          _owned_count: editionCount,
        }}
      />
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          static
          className={`xs:inset-0 modal-mobile-position fixed overflow-y-auto z-1 ${
            sourcePreview.src ? "pt-[96px] md:pt-0" : ""
          }`}
          open={open}
          onClose={trueOnClose}
        >
          <div className="bg-white dark:bg-black z-20 modal-mobile-gap" />
          <canvas
            ref={confettiCanvas}
            className="absolute inset-0 w-screen h-screen z-[11] pointer-events-none"
          />
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-95 transition-opacity z-10" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block align-middle h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-flex flex-col md:flex-row items-stretch align-bottom rounded-t-3xl md:rounded-b-3xl text-left overflow-hidden transform transition-all sm:align-middle bg-black dark:bg-gray-900 relative z-20 md:max-h-[85vh]">
                {sourcePreview.src && (
                  <div className="p-10 flex items-center justify-center">
                    {sourcePreview.type == "model" ? (
                      <model-viewer
                        src={sourcePreview.src}
                        autoplay
                        camera-controls
                        auto-rotate
                        ar
                        ar-modes="scene-viewer quick-look"
                        interaction-prompt="none"
                      />
                    ) : sourcePreview.type === "video" ? (
                      <video
                        src={sourcePreview.src}
                        className="md:max-w-sm w-auto h-auto max-h-full"
                        autoPlay
                        loop
                        muted
                      />
                    ) : (
                      <img
                        src={sourcePreview.src}
                        className="md:max-w-sm w-auto h-auto max-h-full"
                      />
                    )}
                  </div>
                )}
                <div className="bg-white dark:bg-black shadow-xl rounded-t-3xl md:rounded-b-3xl sm:max-w-lg sm:w-full flex flex-col">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
                    {modalPage === MODAL_PAGES.OPTIONS ? (
                      <>
                        <button
                          onClick={() => setModalPage(MODAL_PAGES.GENERAL)}
                          className="rounded-xl bg-gray-100 dark:bg-gray-800 px-5 py-4 group"
                        >
                          <ChevronLeft className="w-auto h-3 transform group-hover:-translate-x-0.5 transition" />
                        </button>
                        <h2 className="text-gray-900 dark:text-white text-xl font-bold">
                          Options
                        </h2>
                      </>
                    ) : (
                      <h2 className="text-gray-900 dark:text-white text-xl font-bold">
                        Create NFT
                      </h2>
                    )}
                    <button
                      onClick={trueOnClose}
                      className="p-3 -my-3 hover:bg-gray-100 disabled:hidden rounded-xl transition"
                      disabled={modalPage === MODAL_PAGES.LOADING}
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                  {renderedPage}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const NoWalletPage = () => (
  <div>
    <div className="p-4 border-b border-gray-100 dark:border-gray-900">
      <p className="font-medium text-gray-900 dark:text-white">
        You’ll need to add an Ethereum wallet before creating an NFT on
        Showtime.
      </p>
    </div>
    <div className="p-4">
      <Link href="/wallet">
        <Button
          as="a"
          className="w-full flex items-center justify-center cursor-pointer"
          style="primary"
        >
          Connect a Wallet
        </Button>
      </Link>
    </div>
  </div>
);

const CreatePage = ({
  title,
  setTitle,
  description,
  setDescription,
  ipfsHash,
  isUploading,
  onFileUpload,
  cancelUpload,
  sourcePreview,
  editionCount,
  royaltiesPercentage,
  setModalPage,
  hasAcceptedTerms,
  setHasAcceptedTerms,
  isValid,
  mintToken,
}) => {
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-gray-100 dark:border-gray-900 space-y-4">
          <fieldset>
            <div className="mt-1 rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="title" className="sr-only">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="px-4 py-3 relative block w-full rounded-none rounded-t-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 focus:z-10 border border-b-0 border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring"
                  placeholder="Title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="description" className="sr-only">
                  Description
                </label>
                <TextareaAutosize
                  rows={2}
                  maxRows={6}
                  name="description"
                  id="description"
                  className="px-4 py-3 text-sm relative block w-full rounded-none rounded-b-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 focus:z-10 border border-gray-300 dark:border-gray-700 resize-none focus:outline-none focus-visible:ring"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>
          </fieldset>
          <IpfsUpload
            ipfsHash={ipfsHash}
            onChange={onFileUpload}
            onCancel={cancelUpload}
            fileDetails={sourcePreview}
            isUploading={isUploading}
          />
        </div>
        <button
          onClick={() => setModalPage(MODAL_PAGES.OPTIONS)}
          className="p-4 border-b border-gray-100 dark:border-gray-900 w-full text-left focus-visible:ring group"
        >
          <div className="flex items-center justify-between space-x-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Options
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {editionCount == 1 ? "Unique" : editionCount.toLocaleString()}{" "}
                Edition
                {editionCount == 1 ? "" : "s"} / {royaltiesPercentage}%
                Royalties
              </p>
            </div>
            <ChevronRight className="w-auto h-4 transform -translate-x-1 group-hover:translate-x-0 transition" />
          </div>
        </button>
        <div className="p-4 border-b border-gray-100 dark:border-gray-900">
          <Checkbox value={hasAcceptedTerms} onChange={setHasAcceptedTerms}>
            I have the rights to publish this artwork, and understand it will be
            minted on the{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              Polygon
            </span>{" "}
            network.
          </Checkbox>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-end">
          <Button style="primary" disabled={!isValid} onClick={mintToken}>
            Create
          </Button>
        </div>
      </div>
    </>
  );
};

const OptionsPage = ({
  editionCount,
  setEditionCount,
  royaltiesPercentage,
  setRoyaltiesPercentage,
  notSafeForWork,
  setNotSafeForWork,
}) => {
  return (
    <div className="md:min-w-[30rem]">
      <div className="p-4 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="font-semibold text-gray-900 dark:text-white">
              Number of Editions
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              1 by default
            </p>
          </div>
          <input
            type="number"
            min="1"
            max="10000"
            className="px-4 py-3 max-w-[80px] w-full relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring text-right appearance-none no-spinners"
            style={{ "-moz-appearance": "textfield" }}
            value={editionCount}
            onChange={(event) =>
              event.target.value > 10000
                ? setEditionCount(10000)
                : event.target.value < 1
                ? setEditionCount(1)
                : setEditionCount(parseInt(event.target.value))
            }
          />
        </div>
      </div>
      <div className="p-4 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="font-semibold text-gray-900 dark:text-white">
              Creator Royalties
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-xs">
              How much you'll earn each time this NFT is resold.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="69"
              step="1"
              className="px-4 max-w-[60px] w-full py-3 relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring no-spinners font-medium text-right"
              style={{ "-moz-appearance": "textfield" }}
              value={royaltiesPercentage}
              onChange={(event) =>
                event.target.value > 69
                  ? setRoyaltiesPercentage(69)
                  : event.target.value < 0 || event.target.value.trim() == ""
                  ? setRoyaltiesPercentage(0)
                  : setRoyaltiesPercentage(parseInt(event.target.value))
              }
            />
            <PercentageIcon className="w-4 h-4 text-gray-700 dark:text-gray-500" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              Explicit Content
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              18+
            </p>
          </div>
          <Switch value={notSafeForWork} onChange={setNotSafeForWork} />
        </div>
      </div>
    </div>
  );
};

const LoadingPage = () => {
  return (
    <div
      tabIndex="0"
      className="focus:outline-none p-12 space-y-8 flex-1 flex flex-col items-center justify-center"
    >
      <div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
      <div className="space-y-1">
        <p className="font-medium text-gray-900 dark:text-white text-center">
          We're preparing your NFT
        </p>
        <p className="font-medium text-gray-900 dark:text-white text-center max-w-xs">
          We'll ask you to confirm with your preferred wallet shortly
        </p>
      </div>
    </div>
  );
};

const MintingPage = ({ transactionHash }) => {
  return (
    <div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
      <div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
      <div className="space-y-1">
        <p className="font-medium text-gray-900 dark:text-white text-center">
          Your NFT is being minted on the Polygon network.
        </p>
        <p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">
          Feel free to navigate away from this screen
        </p>
      </div>
      <Button
        style="tertiary"
        as="a"
        href={`https://${
          process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai." : ""
        }polygonscan.com/tx/${transactionHash}`}
        target="_blank"
        className="space-x-2"
      >
        <PolygonIcon className="w-4 h-4" />
        <span className="text-sm font-medium">View on PolygonScan</span>
      </Button>
    </div>
  );
};

const SuccessPage = ({ transactionHash, tokenID, shotConfetti, listToken }) => {
  const tokenURL = `/t/${
    process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai" : "polygon"
  }/${process.env.NEXT_PUBLIC_MINTING_CONTRACT}/${tokenID}`;

  useEffect(() => {
    shotConfetti();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visitTokenPage = (event) => {
    event.preventDefault();

    window.location = tokenURL;
  };

  return (
    <div className="p-12 space-y-10 flex-1 flex flex-col items-center justify-center">
      <p className="font-medium text-5xl">🎉</p>
      <p className="font-medium text-gray-900 dark:text-white text-center !mt-6">
        Your NFT has been successfully minted!
      </p>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
        <Button style="primary" onClick={listToken} className="!mt-6">
          List for sale
        </Button>
        <Button
          style="primary"
          as="a"
          href={tokenURL}
          onClick={visitTokenPage}
          className="!mt-6"
        >
          View on Showtime &rarr;
        </Button>
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
        <a
          className="flex items-center bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-200 px-4 py-2 rounded-full space-x-2"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            `https://tryshowtime.com/t/${
              process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai"
                ? "mumbai"
                : "polygon"
            }/${process.env.NEXT_PUBLIC_MINTING_CONTRACT}/${tokenID}`
          )}&text=${encodeURIComponent(
            "🌟 Just minted an awesome new NFT on @tryShowtime!!\n"
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon className="w-4 h-auto" />
          <span className="text-sm font-medium">Share on Twitter</span>
        </a>
        <Button
          style="tertiary"
          as="a"
          href={`https://${
            process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai." : ""
          }polygonscan.com/tx/${transactionHash}`}
          target="_blank"
          className="space-x-2"
        >
          <PolygonIcon className="w-4 h-4" />
          <span className="text-sm font-medium">PolygonScan</span>
        </Button>
      </div>
    </div>
  );
};

const WalletErrorPage = ({ mintToken }) => {
  return (
    <div
      tabIndex="0"
      className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none"
    >
      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
        <ExclamationIcon
          className="h-6 w-6 text-yellow-600 dark:text-yellow-300"
          aria-hidden="true"
        />
      </div>
      <p className="font-medium text-gray-900 dark:text-white text-center">
        The wallet you selected isn't linked to your profile.
      </p>
      <p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">
        You can link it from the{" "}
        <Link href="/wallet">
          <a className="font-semibold focus:outline-none focus-visible:underline">
            wallets page
          </a>
        </Link>
        , or you can{" "}
        <button
          onClick={mintToken}
          className="font-semibold focus:outline-none focus-visible:underline"
        >
          try again with a different wallet
        </button>
        .
      </p>
    </div>
  );
};

export default MintModal;
