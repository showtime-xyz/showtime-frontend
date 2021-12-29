import { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import AppContext from "@/context/app-context";
import TokenDetailBody from "./TokenDetailBody";
import backend from "@/lib/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function Modal({
  item,
  isOpen,
  setEditModalOpen,
  goToNext,
  goToPrevious,
  hasNext,
  hasPrevious,
}) {
  const context = useContext(AppContext);
  const [isStacked, setIsStacked] = useState(false);
  const [ownershipDetails, setOwnershipDetails] = useState(null);
  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 1024) {
      setIsStacked(true);
    } else {
      setIsStacked(false);
    }
  }, [context.windowSize]);

  useEffect(() => {
    setOwnershipDetails(null);
    const getOwnershipDetails = async (nftId) => {
      const detailsData = await backend.get(`/v1/nft_detail/${nftId}`);
      const {
        data: { data: details },
      } = detailsData;
      setOwnershipDetails(details);
    };
    if (item && isOpen) {
      getOwnershipDetails(item.nft_id);
    }
    return () => setOwnershipDetails(null);
  }, [isOpen, item]);

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div
            className="fixed bg-black bg-opacity-70 inset-0 z-2 flex flex-row items-center"
            onClick={() => {
              mixpanel.track("Close NFT modal - backdrop click");
              setEditModalOpen(false);
            }}
          >
            <div
              className={`cursor-pointer flex items-center justify-center ${
                isStacked && context.isMobile
                  ? "z-2 -mr-12 p-2 pr-3 sm:pr-2 opacity-40 bg-black rounded-r-full mt-[400px] w-12 h-20"
                  : ""
              } ${
                hasPrevious
                  ? "visible flex-shrink md:p-4 lg:p-8 xl:p-12 text-gray-500 hover:text-gray-200"
                  : "invisible flex-shrink md:p-4 lg:p-8 xl:p-12 text-gray-500 hover:text-gray-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                mixpanel.track("Prior NFT - arrow button");
                goToPrevious();
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} className="!w-4 h-auto" />
            </div>
            <div
              className={`bg-white flex-grow my-8 overflow-hidden text-black w-full ${
                isStacked ? "h-full overflow-auto" : "h-[90%] rounded-lg"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => {
                  mixpanel.track("Close NFT modal - x button");
                  setEditModalOpen(false);
                }}
                className="absolute top-3 right-3 cursor-pointer z-[4] bg-black p-1.5 rounded-full w-9 h-9 opacity-50 hover:opacity-80 transition-all flex items-center justify-center"
              >
                <FontAwesomeIcon
                  className="w-8 h-8 text-white"
                  icon={faTimes}
                />
              </div>
              <div
                className="overflow-y-scroll h-full sm:rounded-lg"
                id="ModalTokenDetailWrapper"
              >
                <TokenDetailBody
                  item={item}
                  muted={false}
                  className="w-full"
                  setEditModalOpen={setEditModalOpen}
                  ownershipDetails={ownershipDetails}
                  isInModal
                />
              </div>
            </div>
            <div
              className={`cursor-pointer flex items-center justify-center ${
                isStacked && context.isMobile
                  ? "z-2 -ml-12 p-2 pl-3 sm:pl-2 opacity-40 bg-black rounded-l-full w-12 h-20 mt-[400px]"
                  : ""
              } ${
                hasNext
                  ? "visible flex-shrink md:p-4 lg:p-8 xl:p-12 text-gray-500 hover:text-gray-200"
                  : "invisible flex-shrink md:p-4 lg:p-8 xl:p-12 text-gray-500 hover:text-gray-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                mixpanel.track("Next NFT - arrow button");
                goToNext();
              }}
            >
              <FontAwesomeIcon icon={faAngleRight} className="!w-4 h-auto" />
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
