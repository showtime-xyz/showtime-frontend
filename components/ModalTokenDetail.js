import { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";
import TokenDetailBody from "./TokenDetailBody";

export default function Modal({
  item,
  isOpen,
  setEditModalOpen,
  likeButton,
  shareButton,
  originalImageDimensions,
}) {
  const context = useContext(AppContext);

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop" onClick={() => setEditModalOpen(false)}>
            <div
              className="modal"
              style={{ color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton setEditModalOpen={setEditModalOpen} />

              <TokenDetailBody
                item={item}
                likeButton={likeButton}
                shareButton={shareButton}
                muted={false}
                originalImageDimensions={originalImageDimensions}
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
                position: absolute;
                top: 5%;
                right: 8%;
                left: 8%;
                bottom: 5%;
                padding: 1em;
                border-radius: 7px;
                //max-width: 400px;
                margin-left: auto;
                margin-right: auto;
              }
            `}</style>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
