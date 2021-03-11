import { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import AppContext from "../context/app-context";
import TokenDetailBody from "./TokenDetailBody";
import backend from "../lib/backend";
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
  handleLike,
  handleUnlike,
  goToNext,
  goToPrevious,
  columns,
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
            className="backdrop flex flex-row items-center"
            onClick={() => {
              mixpanel.track("Close NFT modal - backdrop click");
              setEditModalOpen(false);
            }}
          >
            <div
              className={
                hasPrevious
                  ? "visible flex-shrink md:p-4 lg:p-8 xl:p-12 modal-arrow"
                  : "invisible flex-shrink md:p-4 lg:p-8 xl:p-12 modal-arrow"
              }
              style={_.merge(
                { cursor: "pointer" },
                isStacked && columns === 1
                  ? {
                      marginRight: -48,
                      zIndex: 2,
                      padding: 8,
                      opacity: 0.4,
                      backgroundColor: "black",
                      borderTopRightRadius: 38,
                      borderBottomRightRadius: 38,
                      marginTop: 400,
                      width: 46,
                      height: 76,
                    }
                  : null
              )}
              onClick={(e) => {
                e.stopPropagation();
                mixpanel.track("Prior NFT - arrow button");
                goToPrevious();
              }}
            >
              <FontAwesomeIcon
                icon={faAngleLeft}
                style={{ width: 30, height: 60 }}
              />
            </div>
            <div
              className="modal flex-grow my-8 overflow-hidden"
              style={
                isStacked
                  ? { color: "black", height: "100%", overflow: "auto" }
                  : {
                      color: "black",
                      height: "90%",
                      borderRadius: 15,
                      //, top: "5%",
                      //right: 8%;
                      //left: 8%;
                      //bottom: 5%;
                    }
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  cursor: "pointer",
                  zIndex: 4,
                  backgroundColor: "black",
                  padding: 6,
                  borderRadius: 18,
                  width: 36,
                  height: 36,
                }}
                onClick={() => {
                  mixpanel.track("Close NFT modal - x button");
                  setEditModalOpen(false);
                }}
                className="opacity-50 hover:opacity-80"
              >
                <FontAwesomeIcon
                  style={{
                    height: 24,
                    width: 24,
                    color: "#fff",
                  }}
                  icon={faTimes}
                />
              </div>
              <div
                className="overflow-y-scroll h-full"
                style={context.isMobile ? {} : { borderRadius: 10 }}
              >
                <TokenDetailBody
                  item={item}
                  muted={false}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
                  className="w-full"
                  setEditModalOpen={setEditModalOpen}
                  ownershipDetails={ownershipDetails}
                  isInModal
                />
              </div>
            </div>
            <div
              className={
                hasNext
                  ? "visible flex-shrink md:p-4 lg:p-8 xl:p-12 modal-arrow"
                  : "invisible flex-shrink md:p-4 lg:p-8 xl:p-12 modal-arrow"
              }
              style={_.merge(
                { cursor: "pointer" },
                isStacked && columns === 1
                  ? {
                      marginLeft: -48,
                      zIndex: 2,
                      padding: 8,
                      opacity: 0.4,
                      backgroundColor: "black",
                      borderTopLeftRadius: 38,
                      borderBottomLeftRadius: 38,
                      width: 46,
                      height: 76,
                      marginTop: 400,
                    }
                  : null
              )}
              onClick={(e) => {
                e.stopPropagation();
                mixpanel.track("Next NFT - arrow button");
                goToNext();
              }}
            >
              <FontAwesomeIcon
                icon={faAngleRight}
                style={{ width: 30, height: 60 }}
              />
            </div>
            <style jsx>{`
              :global(body) {
                overflow: hidden;
              }
              .backdrop {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.7);
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
              }
              .modal {
                background-color: white;
                //position: absolute;
                //top: 5%;
                //right: 8%;
                //left: 8%;
                //bottom: 5%;

                //border-radius: 7px;
                //max-width: 400px;
                //margin-left: auto;
                //margin-right: auto;
              }
              .modal-arrow {
                color: #888;
              }
              .modal-arrow:hover {
                color: #ccc;
              }
            `}</style>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
