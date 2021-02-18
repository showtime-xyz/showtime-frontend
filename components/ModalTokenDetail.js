import { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import ClientOnlyPortal from "./ClientOnlyPortal";
import AppContext from "../context/app-context";
import CloseButton from "./CloseButton";
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
  columns,
  hasNext,
  hasPrevious,
  //originalImageDimensions,
}) {
  const context = useContext(AppContext);

  const [isStacked, setIsStacked] = useState(false);
  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 1024) {
      setIsStacked(true);
    } else {
      setIsStacked(false);
    }
  }, [context.windowSize]);

  return (
    <>
      {isOpen && (
        <ClientOnlyPortal selector="#modal">
          <div
            className="backdrop flex flex-row items-center"
            onClick={() => setEditModalOpen(false)}
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
                      borderTopRightRadius: 70,
                      borderBottomRightRadius: 70,
                      marginTop: 400,
                    }
                  : null
              )}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <FontAwesomeIcon
                icon={faAngleLeft}
                style={{ width: 30, height: 60 }}
              />
            </div>
            <div
              className="modal flex-grow my-8"
              style={
                isStacked
                  ? { color: "black", height: "100%", overflow: "auto" }
                  : {
                      color: "black",
                      height: "90%",
                      borderRadius: 7,
                      //, top: "5%",
                      //right: 8%;
                      //left: 8%;
                      //bottom: 5%;
                    }
              }
              onClick={(e) => e.stopPropagation()}
            >
              {columns === 1 ? (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    cursor: "pointer",
                    zIndex: 4,
                    backgroundColor: "black",
                    padding: 6,
                    borderRadius: 40,
                    opacity: 0.4,
                  }}
                  onClick={() => {
                    setEditModalOpen(false);
                  }}
                >
                  <FontAwesomeIcon
                    style={{
                      height: 24,
                      width: 24,
                      color: "#ccc",
                    }}
                    icon={faTimes}
                  />
                </div>
              ) : null}

              <TokenDetailBody
                item={item}
                muted={false}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
                showTooltip={showTooltip}
                className="w-full"
                setEditModalOpen={setEditModalOpen}
                isStacked={isStacked}
                columns={columns}
                //originalImageDimensions={originalImageDimensions}
              />
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
                      borderTopLeftRadius: 70,
                      borderBottomLeftRadius: 70,
                      marginTop: 400,
                    }
                  : null
              )}
              onClick={(e) => {
                e.stopPropagation();
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
