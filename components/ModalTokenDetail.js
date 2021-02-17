import { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import AppContext from "../context/app-context";
//import CloseButton from "./CloseButton";
import TokenDetailBody from "./TokenDetailBody";
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
  showTooltip,
  goToNext,
  goToPrevious,
  //originalImageDimensions,
}) {
  const context = useContext(AppContext);

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div
            className="backdrop flex flex-row items-center"
            onClick={() => setEditModalOpen(false)}
          >
            <div
              className="flex-shrink p-12 modal-arrow"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} style={{ width: 30 }} />
            </div>
            <div
              className="modal flex-grow my-8"
              style={{
                color: "black",
                height: "90%",
                //, top: "5%",
                //right: 8%;
                //left: 8%;
                //bottom: 5%;
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/*<CloseButton setEditModalOpen={setEditModalOpen} />*/}

              <TokenDetailBody
                item={item}
                muted={false}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
                showTooltip={showTooltip}
                className="w-full"
                setEditModalOpen={setEditModalOpen}
                //originalImageDimensions={originalImageDimensions}
              />
            </div>
            <div
              className="flex-shrink p-12 modal-arrow"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <FontAwesomeIcon icon={faAngleRight} style={{ width: 30 }} />
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

                border-radius: 7px;
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
