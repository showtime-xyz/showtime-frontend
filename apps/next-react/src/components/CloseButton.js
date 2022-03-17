import { XIcon } from "@heroicons/react/solid";
import mixpanel from "mixpanel-browser";

const CloseButton = ({ setEditModalOpen, isDetailModal, cleanupFunction }) => {
  return (
    <div
      className="absolute top-5 right-5 cursor-pointer z-[4]"
      onClick={() => {
        if (cleanupFunction) cleanupFunction();

        setEditModalOpen(false);

        if (isDetailModal) mixpanel.track("Close NFT modal - x button");
      }}
    >
      <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-700" />
    </div>
  );
};

export default CloseButton;
