import { MINT_FORMATS, MINT_TYPES } from "@/lib/constants";
import HelpIcon from "./Icons/HelpIcon";
import XIcon from "./Icons/XIcon";
import ImageIcon from "./Icons/ImageIcon";
import VideoIcon from "./Icons/VideoIcon";
import AudioIcon from "./Icons/AudioIcon";
import TextIcon from "./Icons/TextIcon";
import FileIcon from "./Icons/FileIcon";
import CheckIcon from "./Icons/CheckIcon";
import OrbitIcon from "./Icons/OrbitIcon";
import Tippy from "@tippyjs/react";

const FILE_TOOLTIP = {
  image: "Image",
  video: "Video",
  model: "3D Model",
};

const IpfsUpload = ({
  ipfsHash,
  onChange = () => null,
  onCancel = () => null,
  fileDetails,
  isUploading,
}) => {
  return (
    <div className="flex items-center justify-between">
      {ipfsHash ? (
        <>
          <div className="space-x-1.5 flex items-center dark:text-gray-300">
            <MintIcon type={fileDetails.type} className="w-5 h-5" />
            <p className="text-xs font-semibold">
              {fileDetails.size < 1000000
                ? Math.floor(fileDetails.size / 1000) + "kb"
                : Math.floor(fileDetails.size / 1000000) + "mb"}{" "}
              <span className="text-gray-300 dark:text-gray-700">&bull;</span>{" "}
              {fileDetails?.ext}
            </p>
            <button
              onClick={onCancel}
              className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-full p-1.5 -my-1 focus-visible:ring"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckIcon className="w-3 h-3" />
            <span className="text-gray-900 dark:text-white text-xs font-medium">
              Uploaded to IPFS
            </span>
          </div>
        </>
      ) : isUploading ? (
        <div className="flex items-center space-x-4">
          <div className="inline-block border-2 w-5 h-5 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
          <p className="font-semibold text-sm text-gray-700 dark:text-white">
            Uploading to IPFS
          </p>
          <div className="h-5 w-px bg-gray-300 dark:bg-gray-800" />
          <button
            onClick={onCancel}
            className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-full p-2.5 focus-visible:ring"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <div>
              <p className="text-gray-900 dark:text-white text-sm font-semibold">
                Attachment
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-300">
                50mb max
              </p>
            </div>
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-4" />
            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
              {MINT_TYPES.map((type) => (
                <Tippy content={FILE_TOOLTIP[type]} key={type}>
                  <label
                    className="bg-gray-100 dark:bg-gray-900 rounded-full p-2.5 cursor-pointer focus:outline-none focus-visible:ring"
                    tabIndex="0"
                  >
                    <input
                      onChange={onChange}
                      type="file"
                      className="hidden"
                      multiple={false}
                      accept={MINT_FORMATS[type].join(",")}
                    />
                    <MintIcon type={type} className="w-5 h-5" />
                  </label>
                </Tippy>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
              Stored on{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                IPFS
              </span>
            </span>
            <a
              className="cursor-help dark:text-white"
              href="https://ipfs.io/"
              target="_blank"
              rel="noreferrer"
            >
              <HelpIcon className="w-4 h-4" />
            </a>
          </div>
        </>
      )}
    </div>
  );
};

const MintIcon = ({ type, ...props }) => {
  switch (type) {
    case "image":
      return <ImageIcon {...props} />;
    case "video":
      return <VideoIcon {...props} />;
    case "model":
      return <OrbitIcon {...props} />;
    case "audio":
      return <AudioIcon {...props} />;
    case "text":
      return <TextIcon {...props} />;

    default:
      return <FileIcon {...props} />;
  }
};

export default IpfsUpload;
