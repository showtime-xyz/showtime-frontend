import React, { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { Link as SmoothScroll } from "react-scroll";
import ModalReportItem from "./ModalReportItem";
import ReactPlayer from "react-player";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentButton from "./CommentButton";
//import CloseButton from "./CloseButton";
import AppContext from "../context/app-context";
import CreatorSummary from "./CreatorSummary";
import { removeTags, truncateWithEllipses } from "../lib/utilities";
import UserTimestampCard from "./UserTimestampCard";
import TokenHistoryCard from "./TokenHistoryCard";
import CommentsSection from "./CommentsSection";
import { getBidLink, getContractName } from "../lib/utilities";
import backend from "../lib/backend";
import UsersWhoLiked from "./UsersWhoLiked";
import MiniFollowButton from "./MiniFollowButton";
import UsersWhoOwn from "./UsersWhoOwn";

// how tall the media will be
const TOKEN_MEDIA_HEIGHT = 500;

const TokenDetailBody = ({
  item,
  muted,
  setEditModalOpen,
  ownershipDetails,
  isInModal,
  parentReportModalOpen, // for full page view only, not modal view
  parentSetReportModalOpen, // for full page view only, not modal view
}) => {
  const context = useContext(AppContext);
  const { isMobile, columns, gridWidth } = context;
  const getBackgroundColor = () => {
    if (
      item.token_background_color &&
      item.token_background_color.length === 6
    ) {
      return `#${item.token_background_color}`;
    } else {
      return "black";
    }
  };
  const getImageUrl = (img_url, token_aspect_ratio) => {
    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      if (token_aspect_ratio && token_aspect_ratio > 1) {
        img_url = img_url.split("=")[0] + "=h660";
      } else {
        img_url = img_url.split("=")[0] + "=w660";
      }
    }
    return img_url;
  };

  const getBiggerImageUrl = (img_url) => {
    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      img_url = img_url.split("=")[0] + "=h1328";
    }
    return img_url;
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Set dimensions of the media based on available space and original aspect ratio
  const targetRef = useRef();
  const modalRef = useRef();
  const [mediaHeight, setMediaHeight] = useState(null);
  const [mediaWidth, setMediaWidth] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [moreShown, setMoreShown] = useState(false);

  const max_description_length = context.isMobile ? 120 : 220;

  useEffect(() => {
    var aspectRatio = 1;

    // Try to use current image's aspect ratio
    if (item.imageRef && item.imageRef.current) {
      if (item.imageRef.current.clientHeight) {
        aspectRatio =
          item.imageRef.current.clientWidth /
          item.imageRef.current.clientHeight;
      }
    }
    // Set full height
    var mWidth = 0;

    if (isMobile) {
      mWidth = modalRef.current.clientWidth;
      setMediaWidth(mWidth);
      setMediaHeight(mWidth / aspectRatio);
    } else {
      setMediaHeight(TOKEN_MEDIA_HEIGHT);
      setMediaWidth(TOKEN_MEDIA_HEIGHT * aspectRatio);
    }
  }, [targetRef, item, context.windowSize, isMobile]);

  const [fullResLoaded, setFullResLoaded] = useState(false);
  const [usersWhoLiked, setUsersWhoLiked] = useState();

  const getUsersWhoLiked = async () => {
    const {
      data: {
        data: { likers },
      },
    } = await backend.get(`/v1/likes/${item.nft_id}`);
    setUsersWhoLiked(likers);
  };

  useEffect(() => {
    setFullResLoaded(false);
    setUsersWhoLiked(null);
    getUsersWhoLiked();
    setMoreShown(false);
  }, [item]);

  return (
    <>
      {typeof document !== "undefined" && parentReportModalOpen !== null ? (
        <>
          <ModalReportItem
            isOpen={reportModalOpen}
            setReportModalOpen={setReportModalOpen}
            nftId={item.nft_id}
          />
        </>
      ) : null}
      {lightboxOpen && (
        <Lightbox
          mainSrc={
            item.token_img_original_url
              ? item.token_img_original_url
              : item.token_img_url
          }
          //nextSrc={images[(photoIndex + 1) % images.length]}
          //prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          //enableZoom={false}
          /*
          onMovePrevRequest={() =>
            this.setState({
              photoIndex: (photoIndex + images.length - 1) % images.length,
            })
          }
          onMoveNextRequest={() =>
            this.setState({
              photoIndex: (photoIndex + 1) % images.length,
            })
          }*/
        />
      )}
      <div
        className="flex flex-col"
        ref={modalRef}
        style={{ position: "relative", marginTop: -1 }}
      >
        {columns === 1 ? (
          <div className="p-4 flex flex-row">
            <div className="flex-shrink">
              {item.contract_is_creator ? (
                <Link href="/c/[collection]" as={`/c/${item.collection_slug}`}>
                  <a className="flex flex-row items-center ">
                    <div>
                      <img
                        alt={item.collection_name}
                        src={
                          item.collection_img_url
                            ? item.collection_img_url
                            : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                        }
                        className="rounded-full "
                        style={{ height: 24, width: 24 }}
                      />
                    </div>
                    <div className="showtime-card-profile-link ml-2">
                      {truncateWithEllipses(item.collection_name, 30)}{" "}
                      Collection
                    </div>
                  </a>
                </Link>
              ) : item.creator_address ? (
                <div className="flex flex-row items-center">
                  <Link
                    href="/[profile]"
                    as={`/${item?.creator_username || item.creator_address}`}
                  >
                    <a className="flex flex-row items-center">
                      <div>
                        <img
                          alt={item.creator_name}
                          src={
                            item.creator_img_url
                              ? item.creator_img_url
                              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                          }
                          className="rounded-full "
                          style={{ height: 24, width: 24 }}
                        />
                      </div>
                      <div className="showtime-card-profile-link ml-2">
                        {truncateWithEllipses(item.creator_name, 22)}
                      </div>
                    </a>
                  </Link>
                  {context.myProfile?.profile_id !== item?.creator_id && (
                    <div className="ml-2">
                      <MiniFollowButton profileId={item?.creator_id} />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div>&nbsp;</div>
          </div>
        ) : null}
        <div
          className="flex items-center md:p-12"
          style={_.merge(
            { flexShrink: 0 },
            item.token_has_video
              ? {
                  backgroundColor: "black",
                }
              : {
                  backgroundColor: getBackgroundColor(),
                }
          )}
          ref={targetRef}
        >
          {item.token_has_video ? (
            <ReactPlayer
              url={item.token_animation_url}
              playing={true}
              loop
              controls
              muted={muted}
              height={mediaHeight}
              width={mediaWidth}
              style={{ margin: "auto" }}
              playsinline
            />
          ) : (
            <div
              style={{
                margin: "auto",
              }}
            >
              <div
                className="w-max p"
                style={{
                  position: "absolute",
                  top: isMobile ? 57 : 0,
                  right: 0,
                  margin: 10,
                  zIndex: 0,
                }}
              >
                {isMobile ||
                item.token_has_video ? null : item.token_img_url ? (
                  <button
                    style={{
                      borderRadius: 7,
                      padding: 12,
                    }}
                    type="button"
                    onClick={() => {
                      setLightboxOpen(true);
                      mixpanel.track("Original clicked");
                    }}
                    className="flex flex-row items-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
                  >
                    <div className="">
                      <FontAwesomeIcon icon={faExpand} width={18} height={18} />
                    </div>
                    <div className="ml-2" style={{ fontSize: 14 }}>
                      Original
                    </div>
                  </button>
                ) : null}
                <div></div>
              </div>
              <img
                src={getImageUrl(item.token_img_url, item.token_aspect_ratio)}
                alt={item.token_name}
                style={_.merge(
                  fullResLoaded === true ? { display: "none" } : null,
                  context.isMobile
                    ? {
                        width: mediaWidth,
                        height: item.token_aspect_ratio
                          ? mediaWidth / item.token_aspect_ratio
                          : null,
                      }
                    : {
                        height: TOKEN_MEDIA_HEIGHT,
                      }
                )}
              />

              <img
                src={
                  context.isMobile
                    ? getImageUrl(item.token_img_url)
                    : getBiggerImageUrl(item.token_img_url)
                }
                alt={item.token_name}
                style={_.merge(
                  fullResLoaded ? null : { display: "none" },
                  context.isMobile
                    ? {
                        width: mediaWidth,
                      }
                    : {
                        height: TOKEN_MEDIA_HEIGHT,
                      }
                )}
                onLoad={() => {
                  setTimeout(function () {
                    setFullResLoaded(true);
                  }, 100);
                }}
              />
            </div>
          )}
        </div>
        {/* Details wrapper */}
        <div
          className="p-2 md:p-8"
          style={{
            overflow: "auto",
            position: "relative",
            width: isInModal ? "100%" : gridWidth,
            margin: "auto",
          }}
        >
          {/* Title and description section */}
          <div className="flex flex-col md:flex-row pb-10 items-stretch w-full max-w-full">
            <div
              className="pb-0 text-left flex-1 p-4"
              style={{
                overflowWrap: "break-word",
                wordWrap: "break-word",
                ...(isMobile ? {} : { maxWidth: "50%" }),
              }}
            >
              <div className="text-2xl md:text-4xl">{item.token_name}</div>
              {/* Likes & Share */}
              {/*  */}
              <div className="flex items-center pt-2">
                <div className="mr-2 text-base px-4 py-2 rounded-full shadow-md">
                  <LikeButton item={item} />
                </div>
                <SmoothScroll
                  to="CommentsSectionScroll"
                  containerId={isInModal ? "ModalTokenDetailWrapper" : null}
                  smooth={true}
                  offset={isInModal ? 210 : -70}
                  duration={500}
                >
                  <div className="mr-2 text-base px-4 py-2 rounded-full shadow-md">
                    <CommentButton item={item} handleComment={() => {}} />
                  </div>
                </SmoothScroll>
                <div className="px-4 py-2 rounded-full shadow-md mr-2">
                  <ShareButton
                    url={
                      typeof window !== "undefined" &&
                      window.location.protocol +
                        "//" +
                        window.location.hostname +
                        (window.location.port
                          ? ":" + window.location.port
                          : "") +
                        `/t/${item.contract_address}/${item.token_id}`
                    }
                    type={"item"}
                  />
                </div>

                <a
                  href={getBidLink(item)}
                  title={`Buy on ${getContractName(item)}`}
                  target="_blank"
                  onClick={() => {
                    mixpanel.track("OpenSea link click");
                  }}
                >
                  <div className="text-base font-normal px-4 py-3 mr-2 rounded-full shadow-md hover:text-stpink">
                    {context.columns > 2
                      ? `Bid on ${getContractName(item)}`
                      : "Bid"}
                  </div>
                </a>
                <div className="flex-grow"></div>
              </div>
              {usersWhoLiked && (
                <UsersWhoLiked
                  users={usersWhoLiked}
                  closeModal={() =>
                    setEditModalOpen ? setEditModalOpen(false) : null
                  }
                />
              )}
            </div>
            <div
              className="flex-1 p-4 pb-0"
              style={isMobile ? {} : { maxWidth: "50%" }}
            >
              {item.token_description && (
                <>
                  <div className="md:text-lg py-2">Description</div>
                  <div
                    className={`${
                      context.isMobile ? null : "text-base"
                    } text-gray-500`}
                    style={
                      context.isMobile
                        ? {
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            fontSize: 14,
                          }
                        : {
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                          }
                    }
                  >
                    {moreShown ? (
                      <div style={{ whiteSpace: "pre-line" }}>
                        {removeTags(item.token_description)}
                      </div>
                    ) : (
                      <div>
                        {item.token_description?.length >
                        max_description_length ? (
                          <>
                            {truncateWithEllipses(
                              removeTags(item.token_description),
                              max_description_length
                            )}{" "}
                            <a
                              onClick={() => setMoreShown(true)}
                              className="text-gray-900 hover:text-gray-500 cursor-pointer"
                            >
                              {" "}
                              more
                            </a>
                          </>
                        ) : (
                          <div>{removeTags(item.token_description)}</div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* separator */}
          <hr />
          {/* Artist and Owned by Section */}
          {ownershipDetails ? (
            <div className="flex flex-col md:flex-row mt-4">
              {/* left column section */}
              <div className="flex-1 p-4 md:w-0">
                {/* artist section */}

                {item.contract_is_creator
                  ? item.contract_is_creator && (
                      <div>
                        <div className="md:text-lg py-4">Creator</div>
                        <CreatorSummary
                          //address={item.creator_address}
                          name={`${item.collection_name} Collection`}
                          //username={item.creator_username}
                          imageUrl={
                            item.collection_img_url
                              ? item.collection_img_url
                              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                          }
                          collectionSlug={item.collection_slug}
                          //bio={ownershipDetails.creator_bio}
                          closeModal={() => {
                            if (setEditModalOpen) {
                              setEditModalOpen(false);
                            }
                          }}
                          isCollection
                        />
                      </div>
                    )
                  : item.creator_address && (
                      <div>
                        <div className="md:text-lg py-4">Creator</div>
                        <CreatorSummary
                          address={item.creator_address}
                          name={item.creator_name}
                          username={item.creator_username}
                          imageUrl={item.creator_img_url}
                          bio={ownershipDetails.creator_bio}
                          closeModal={() => {
                            if (setEditModalOpen) {
                              setEditModalOpen(false);
                            }
                          }}
                          profileId={item.creator_id}
                        />
                      </div>
                    )}
                {/* Owned by Section */}
                {!isMobile && (
                  <div className="mt-8">
                    <div className="md:text-lg pt-4">Owned By</div>

                    {item.owner_address &&
                      (item.owner_count === null || item.owner_count === 1) && (
                        <div>
                          <UserTimestampCard
                            item={item}
                            timestamp={ownershipDetails.token_last_transferred}
                            closeModalCallback={() => {
                              setEditModalOpen(false);
                            }}
                          />
                        </div>
                      )}

                    {item.multiple_owners === 1 &&
                      ownershipDetails?.multiple_owners_list &&
                      ownershipDetails.multiple_owners_list.length > 0 && (
                        <div>
                          <UsersWhoOwn
                            users={ownershipDetails.multiple_owners_list}
                            closeModal={() =>
                              setEditModalOpen ? setEditModalOpen(false) : null
                            }
                          />
                        </div>
                      )}
                  </div>
                )}
                {/* History Section */}
                <div className="mt-8">
                  <div className="md:text-lg py-4">Owner History</div>
                  <TokenHistoryCard
                    nftId={item.nft_id}
                    closeModal={() => {
                      if (setEditModalOpen) {
                        setEditModalOpen(false);
                      }
                    }}
                  />
                </div>
              </div>

              {/* right column section */}
              <div className="flex-1 p-4 order-first md:order-last">
                {/* Owned by section ONLY ON MOBILE */}
                {isMobile && (
                  <div className="mb-8">
                    <div className="md:text-lg pt-4">Owned By</div>

                    {item.owner_address &&
                      (item.owner_count === null || item.owner_count === 1) && (
                        <div>
                          <UserTimestampCard
                            item={item}
                            timestamp={ownershipDetails.token_last_transferred}
                            closeModalCallback={() => {
                              setEditModalOpen(false);
                            }}
                          />
                        </div>
                      )}

                    {item.multiple_owners === 1 &&
                      ownershipDetails?.multiple_owners_list &&
                      ownershipDetails.multiple_owners_list.length > 0 && (
                        <div>
                          <UsersWhoOwn
                            users={ownershipDetails.multiple_owners_list}
                            closeModal={() =>
                              setEditModalOpen ? setEditModalOpen(false) : null
                            }
                          />
                        </div>
                      )}
                  </div>
                )}
                {/* Comments section */}
                <div className="flex">
                  <CommentsSection
                    item={item}
                    commentCount={item.comment_count}
                    closeModal={() => {
                      if (setEditModalOpen) {
                        setEditModalOpen(false);
                      }
                    }}
                    modalRef={modalRef}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center mt-8">
              <div className="loading-card-spinner" />
            </div>
          )}

          {/* OpenSea Link */}

          <div className="m-4 flex text-sm">
            <a
              href={`https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`}
              title="Buy on OpenSea"
              target="_blank"
              onClick={() => {
                mixpanel.track("OpenSea link click");
              }}
              className="mr-4 text-gray-500 hover:text-stpink"
            >
              <div>View on OpenSea</div>
            </a>
            <div className="mr-4">·</div>
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                parentSetReportModalOpen !== undefined
                  ? parentSetReportModalOpen(true)
                  : setReportModalOpen(true);
              }}
              className="text-gray-500 hover:text-stpink"
            >
              Report Item
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenDetailBody;
