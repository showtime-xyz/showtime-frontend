import { useState, useRef, useEffect, useContext } from "react";
import {
  DEFAULT_PROFILE_PIC,
  CONTRACTS,
  SHOWTIME_CONTRACTS,
} from "@/lib/constants";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { Link as SmoothScroll } from "react-scroll";
import ModalReportItem from "./ModalReportItem";
import ReactPlayer from "react-player";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import CommentButton from "./CommentButton";
import AppContext from "@/context/app-context";
import CreatorSummary from "./CreatorSummary";
import {
  getContractImage,
  removeTags,
  truncateWithEllipses,
} from "@/lib/utilities";
import UserTimestampCard from "./UserTimestampCard";
import TokenHistoryCard from "./TokenHistoryCard";
import CommentsSection from "./CommentsSection";
import { getBidLink, getContractName } from "@/lib/utilities";
import backend from "@/lib/backend";
import UsersWhoLiked from "./UsersWhoLiked";
import MiniFollowButton from "./MiniFollowButton";
import UsersWhoOwn from "./UsersWhoOwn";
import OrbitIcon from "./Icons/OrbitIcon";
import { CHAIN_IDENTIFIERS } from "@/lib/constants";
import PolygonIcon from "./Icons/PolygonIcon";
import Tippy from "@tippyjs/react";
import TezosIcon from "./Icons/TezosIcon";
import ShowtimeIcon from "./Icons/ShowtimeIcon";
import BuyModal from "./UI/Modals/BuyModal";
import useFlags, { FLAGS } from "@/hooks/useFlags";
import ListModal from "./UI/Modals/ListModal";

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
  const { [FLAGS.hasMinting]: canList } = useFlags();
  useEffect(() => {
    if (
      !item.mime_type?.startsWith("model") ||
      window.customElements.get("model-viewer")
    )
      return;
    import("@google/model-viewer");
  }, []);

  const context = useContext(AppContext);
  const { isMobile } = context;
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
      if (token_aspect_ratio && token_aspect_ratio > 1)
        img_url = img_url.split("=")[0] + "=h660";
      else img_url = img_url.split("=")[0] + "=w660";
    }

    return img_url;
  };

  const getBiggerImageUrl = (img_url) => {
    if (img_url && img_url.includes("https://lh3.googleusercontent.com"))
      img_url = img_url.split("=")[0] + "=h1328";

    return img_url;
  };

  const getBiggestImageUrl = (img_url) => {
    if (img_url && img_url.includes("https://lh3.googleusercontent.com"))
      img_url = img_url.split("=")[0] + "=s0";

    return img_url;
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isListModalOpen, setListModalOpen] = useState(false);
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);

  // Set dimensions of the media based on available space and original aspect ratio
  const targetRef = useRef();
  const modalRef = useRef();
  const [mediaHeight, setMediaHeight] = useState(null);
  const [mediaWidth, setMediaWidth] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [moreShown, setMoreShown] = useState(false);

  const max_description_length = context.isMobile ? 120 : 220;

  useEffect(() => {
    var aspectRatio = item.token_aspect_ratio ? item.token_aspect_ratio : 1;

    if (isMobile) {
      setMediaWidth(modalRef.current.clientWidth);
      setMediaHeight(modalRef.current.clientWidth / aspectRatio);
    } else {
      setMediaHeight(TOKEN_MEDIA_HEIGHT);
      setMediaWidth(TOKEN_MEDIA_HEIGHT * aspectRatio);
    }
  }, [
    targetRef,
    item,
    context.windowSize,
    isMobile,
    modalRef?.current?.clientWidth,
  ]);

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
      {typeof document !== "undefined" ? (
        <>
          <BuyModal
            open={isBuyModalOpen}
            onClose={() => setBuyModalOpen(false)}
            token={item}
          />
          <ListModal
            open={isListModalOpen}
            onClose={() => setListModalOpen(false)}
            token={item}
          />
          {parentReportModalOpen !== null && (
            <ModalReportItem
              isOpen={reportModalOpen}
              setReportModalOpen={setReportModalOpen}
              nftId={item.nft_id}
            />
          )}
        </>
      ) : null}
      {lightboxOpen && (
        <Lightbox
          mainSrc={
            item.source_url
              ? getBiggestImageUrl(item.source_url)
              : item.token_img_original_url
              ? item.token_img_original_url
              : item.token_img_url
          }
          onCloseRequest={() => setLightboxOpen(false)}
        />
      )}
      <div className="flex flex-col relative dark:bg-gray-900" ref={modalRef}>
        {isMobile ? (
          <div className="py-4 px-4 flex flex-row">
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
                            : DEFAULT_PROFILE_PIC
                        }
                        className="rounded-full w-6 h-6"
                      />
                    </div>
                    <div className="text-gray-800 dark:text-gray-300 hover:text-stpink dark:hover:text-stpink ml-2">
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
                              : DEFAULT_PROFILE_PIC
                          }
                          className="rounded-full w-6 h-6"
                        />
                      </div>
                      <div className="text-gray-800 dark:text-gray-300 hover:text-stpink dark:hover:text-stpink ml-2">
                        {truncateWithEllipses(item.creator_name, 22)}
                      </div>
                    </a>
                  </Link>
                  {context.myProfile?.profile_id !== item?.creator_id && (
                    <div className="ml-2">
                      <MiniFollowButton
                        key={item?.creator_id}
                        profileId={item?.creator_id}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div>&nbsp;</div>
          </div>
        ) : null}
        {/* Media area */}
        <div
          className="flex flex-shrink-0 items-center md:p-12"
          style={{ backgroundColor: getBackgroundColor() }}
          ref={targetRef}
        >
          {/* Use mime_type to display appropriate media */}
          {item.mime_type?.startsWith("image") && (
            <div className="m-auto w-full md:w-auto">
              <div className="w-max absolute right-0 m-2.5 z-0 top-14 sm:top-0">
                <button
                  type="button"
                  onClick={() => {
                    setLightboxOpen(true);
                    mixpanel.track("Original clicked");
                  }}
                  className="flex-row items-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all rounded-lg p-3 hidden md:flex"
                >
                  <div>
                    <FontAwesomeIcon icon={faExpand} width={18} height={18} />
                  </div>
                  <div className="ml-2 text-sm">Original</div>
                </button>
              </div>
              <img
                src={getImageUrl(
                  item.source_url ? item.source_url : item.token_img_url,
                  item.token_aspect_ratio
                )}
                alt={item.token_name}
                className={fullResLoaded === true ? "hidden" : ""}
                style={
                  context.isMobile
                    ? {
                        width: mediaWidth,
                        height: item.token_aspect_ratio
                          ? mediaWidth / item.token_aspect_ratio
                          : null,
                      }
                    : { height: TOKEN_MEDIA_HEIGHT }
                }
              />

              <img
                src={
                  context.isMobile
                    ? getImageUrl(
                        item.source_url ? item.source_url : item.token_img_url
                      )
                    : getBiggerImageUrl(
                        item.source_url ? item.source_url : item.token_img_url
                      )
                }
                alt={item.token_name}
                className={fullResLoaded === true ? "" : "hidden"}
                style={
                  context.isMobile
                    ? { width: mediaWidth }
                    : { height: TOKEN_MEDIA_HEIGHT }
                }
                onLoad={() => setTimeout(() => setFullResLoaded(true), 100)}
              />
            </div>
          )}
          {item.mime_type?.startsWith("video") && (
            <ReactPlayer
              url={item.source_url ? item.source_url : item.token_animation_url}
              playing={true}
              loop
              controls
              muted={muted}
              height={mediaHeight}
              width={mediaWidth}
              style={{ margin: "auto" }}
              playsinline
              // Disable downloading & right click
              config={{
                file: {
                  attributes: {
                    onContextMenu: (e) => e.preventDefault(),
                    controlsList: "nodownload",
                  },
                },
              }}
            />
          )}
          {item.mime_type?.startsWith("model") && (
            <div className="m-auto w-full md:w-auto">
              <div className="relative">
                <model-viewer
                  src={item.source_url}
                  class="max-w-full"
                  style={{
                    height: TOKEN_MEDIA_HEIGHT,
                    width: TOKEN_MEDIA_HEIGHT,
                    "--poster-color": "transparent",
                  }}
                  autoplay
                  auto-rotate
                  camera-controls
                  ar
                  ar-modes="scene-viewer quick-look"
                  interaction-prompt="none"
                >
                  <span slot="interaction-prompt" />
                </model-viewer>
                <div className="p-2.5 absolute top-1 right-1">
                  <div className="flex items-center space-x-1 text-white rounded-full py-1 px-2 -my-1 -mx-1 bg-black bg-opacity-40">
                    <OrbitIcon className="w-4 h-4" />
                    <span className="font-semibold">3D</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback to old code for missing mime_types */}
          {!item.mime_type && (
            <>
              {!item.mime_type?.startsWith("model") &&
              (item.token_has_video ||
                (item.token_animation_url && !item.token_img_url)) ? (
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
                  // Disable downloading & right click
                  config={{
                    file: {
                      attributes: {
                        onContextMenu: (e) => e.preventDefault(),
                        controlsList: "nodownload",
                      },
                    },
                  }}
                />
              ) : (
                <div className="m-auto w-full md:w-auto">
                  {isMobile ||
                  item.token_has_video ||
                  (item.token_animation_url &&
                    !item.token_img_url) ? null : item.token_img_url &&
                    !item.mime_type?.startsWith("model") ? (
                    <div className="w-max absolute right-0 m-2.5 z-0 top-14 sm:top-0">
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxOpen(true);
                          mixpanel.track("Original clicked");
                        }}
                        className="flex-row items-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all rounded-lg p-3 hidden md:flex"
                      >
                        <div>
                          <FontAwesomeIcon
                            icon={faExpand}
                            width={18}
                            height={18}
                          />
                        </div>
                        <div className="ml-2 text-sm">Original</div>
                      </button>
                    </div>
                  ) : null}
                  {item.mime_type?.startsWith("model") ? (
                    <div className="relative">
                      <model-viewer
                        src={item.source_url}
                        class="max-w-full"
                        style={{
                          height: TOKEN_MEDIA_HEIGHT,
                          width: TOKEN_MEDIA_HEIGHT,
                          "--poster-color": "transparent",
                        }}
                        autoplay
                        auto-rotate
                        camera-controls
                        ar
                        ar-modes="scene-viewer quick-look"
                        interaction-prompt="none"
                      >
                        <span slot="interaction-prompt" />
                      </model-viewer>
                      <div className="p-2.5 absolute top-1 right-1">
                        <div className="flex items-center space-x-1 text-white rounded-full py-1 px-2 -my-1 -mx-1 bg-black bg-opacity-40">
                          <OrbitIcon className="w-4 h-4" />
                          <span className="font-semibold">3D</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={getImageUrl(
                          item.token_img_url,
                          item.token_aspect_ratio
                        )}
                        alt={item.token_name}
                        className={fullResLoaded === true ? "hidden" : ""}
                        style={
                          context.isMobile
                            ? {
                                width: mediaWidth,
                                height: item.token_aspect_ratio
                                  ? mediaWidth / item.token_aspect_ratio
                                  : null,
                              }
                            : { height: TOKEN_MEDIA_HEIGHT }
                        }
                      />

                      <img
                        src={
                          context.isMobile
                            ? getImageUrl(item.token_img_url)
                            : getBiggerImageUrl(item.token_img_url)
                        }
                        alt={item.token_name}
                        className={fullResLoaded === true ? "" : "hidden"}
                        style={
                          context.isMobile
                            ? { width: mediaWidth }
                            : { height: TOKEN_MEDIA_HEIGHT }
                        }
                        onLoad={() =>
                          setTimeout(() => setFullResLoaded(true), 100)
                        }
                      />
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/*
				<div className={`flex flex-shrink-0 items-center md:p-12 ${item.token_has_video || (item.token_animation_url && !item.token_img_url) ? 'bg-black' : ''}`} style={item.token_has_video || (item.token_animation_url && !item.token_img_url) ? null : { backgroundColor: getBackgroundColor() }} ref={targetRef}>
					{!item.mime_type?.startsWith('model') && (item.token_has_video || (item.token_animation_url && !item.token_img_url)) ? (
						<ReactPlayer
							url={item.token_animation_url}
							playing={true}
							loop
							controls
							muted={muted}
							height={mediaHeight}
							width={mediaWidth}
							style={{ margin: 'auto' }}
							playsinline
							// Disable downloading & right click
							config={{
								file: {
									attributes: {
										onContextMenu: e => e.preventDefault(),
										controlsList: 'nodownload',
									},
								},
							}}
						/>
					) : (
						<div className="m-auto w-full md:w-auto">
							{isMobile || item.token_has_video || (item.token_animation_url && !item.token_img_url) ? null : item.token_img_url && !item.mime_type?.startsWith('model') ? (
								<div className="w-max absolute right-0 m-2.5 z-0 top-14 sm:top-0">
									<button
										type="button"
										onClick={() => {
											setLightboxOpen(true)
											mixpanel.track('Original clicked')
										}}
										className="flex-row items-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all rounded-lg p-3 hidden md:flex"
									>
										<div>
											<FontAwesomeIcon icon={faExpand} width={18} height={18} />
										</div>
										<div className="ml-2 text-sm">Original</div>
									</button>
								</div>
							) : null}
							{item.mime_type?.startsWith('model') ? (
								<div className="relative">
									<model-viewer src={item.source_url} class="max-w-full" style={{ height: TOKEN_MEDIA_HEIGHT, width: TOKEN_MEDIA_HEIGHT, '--poster-color': 'transparent' }} autoplay auto-rotate camera-controls ar ar-modes="scene-viewer quick-look" interaction-prompt="none">
										<span slot="interaction-prompt" />
									</model-viewer>
									<div className="p-2.5 absolute top-1 right-1">
										<div className="flex items-center space-x-1 text-white rounded-full py-1 px-2 -my-1 -mx-1 bg-black bg-opacity-40">
											<OrbitIcon className="w-4 h-4" />
											<span className="font-semibold">3D</span>
										</div>
									</div>
								</div>
							) : (
								<>
									<img
										src={getImageUrl(item.token_img_url, item.token_aspect_ratio)}
										alt={item.token_name}
										className={fullResLoaded === true ? 'hidden' : ''}
										style={
											context.isMobile
												? {
														width: mediaWidth,
														height: item.token_aspect_ratio ? mediaWidth / item.token_aspect_ratio : null,
												  }
												: { height: TOKEN_MEDIA_HEIGHT }
										}
									/>

									<img src={context.isMobile ? getImageUrl(item.token_img_url) : getBiggerImageUrl(item.token_img_url)} alt={item.token_name} className={fullResLoaded === true ? '' : 'hidden'} style={context.isMobile ? { width: mediaWidth } : { height: TOKEN_MEDIA_HEIGHT }} onLoad={() => setTimeout(() => setFullResLoaded(true), 100)} />
								</>
							)}
						</div>
					)}
									</div>*/}
        {/* Details wrapper */}

        <div className="p-2 md:p-8 max-w-screen-2xl overflow-auto relative w-full m-auto">
          {/* Title and description section */}
          <div className="flex flex-col md:flex-row pb-10 items-stretch w-full max-w-full">
            <div className="pb-0 text-left flex-1 p-4 break-words md:max-w-[50%]">
              <div className="flex items-center space-x-3">
                <div className="text-2xl md:text-4xl dark:text-gray-200">
                  {item.token_name}
                </div>
                {SHOWTIME_CONTRACTS.includes(item.contract_address) && (
                  <Tippy content="Created on Showtime">
                    <div className="flex items-center justify-center">
                      <ShowtimeIcon className="w-6 h-6 fill-gold" />
                    </div>
                  </Tippy>
                )}
              </div>
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
                <div className="p-3 rounded-full shadow-md mr-2 flex items-center justify-center">
                  <ShareButton
                    url={
                      typeof window !== "undefined" &&
                      window.location.protocol +
                        "//" +
                        window.location.hostname +
                        (window.location.port
                          ? ":" + window.location.port
                          : "") +
                        `/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                          (key) =>
                            CHAIN_IDENTIFIERS[key] == item.chain_identifier
                        )}/${item.contract_address}/${item.token_id}`
                    }
                    type={"item"}
                  />
                </div>

                {canList && item.listing ? (
                  <button
                    title="Buy on Showtime"
                    className="border-2 text-gray-800 dark:text-gray-500 border-transparent shadow-md dark:shadow-none dark:border-gray-500 dark:hover:border-gray-400 hover:text-gray-900 dark:hover:text-gray-400 px-4 py-2 rounded-full transition focus:outline-none flex items-center space-x-1"
                    onClick={() => setBuyModalOpen(true)}
                  >
                    <span className="text-sm sm:text-base">
                      Buy for {item.listing.min_price} ${item.listing.currency}
                    </span>
                  </button>
                ) : canList &&
                  SHOWTIME_CONTRACTS.includes(item.contract_address) ? (
                  <button
                    title="List on Showtime"
                    className="border-2 text-gray-800 dark:text-gray-500 border-transparent shadow-md dark:shadow-none dark:border-gray-500 dark:hover:border-gray-400 hover:text-gray-900 dark:hover:text-gray-400 px-4 py-2 rounded-full transition focus:outline-none flex items-center space-x-1"
                    onClick={() => setListModalOpen(true)}
                  >
                    <span className="text-sm sm:text-base">
                      List on Showtime
                    </span>
                  </button>
                ) : (
                  <a
                    href={getBidLink(item)}
                    title={`View on ${getContractName(item)}`}
                    target="_blank"
                    className="border-2 text-gray-800 dark:text-gray-500 border-transparent shadow-md dark:shadow-none dark:border-gray-500 dark:hover:border-gray-400 hover:text-gray-900 dark:hover:text-gray-400 px-4 py-2 rounded-full transition focus:outline-none flex items-center space-x-1"
                    onClick={() => mixpanel.track("OpenSea link click")}
                    rel="noreferrer"
                  >
                    <span className="whitespace-nowrap text-sm sm:text-base">
                      View on
                    </span>
                    <span className="hidden sm:inline">
                      {getContractName(item)}
                    </span>
                    <img
                      src={getContractImage(item)}
                      className="w-auto h-5 sm:hidden"
                    />
                  </a>
                )}
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
            <div className="flex-1 p-4 pb-0 md:max-w-[50%]">
              {item.token_description && (
                <>
                  <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base whitespace-pre-line">
                    {moreShown ? (
                      <div className="whitespace-pre-line">
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
                              className="text-gray-900 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 cursor-pointer"
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
          <hr className="border-gray-200 dark:border-gray-800" />
          {/* Artist and Owned by Section */}
          {ownershipDetails ? (
            <div className="flex flex-col md:flex-row mt-4">
              {/* left column section */}
              <div className="flex-1 p-4 md:w-0">
                {/* artist section */}

                {item.contract_is_creator
                  ? item.contract_is_creator && (
                      <div>
                        <CreatorSummary
                          name={`${item.collection_name} Collection`}
                          imageUrl={
                            item.collection_img_url
                              ? item.collection_img_url
                              : DEFAULT_PROFILE_PIC
                          }
                          collectionSlug={item.collection_slug}
                          closeModal={() => {
                            if (setEditModalOpen) setEditModalOpen(false);
                          }}
                          isCollection
                        />
                      </div>
                    )
                  : item.creator_address && (
                      <div>
                        <CreatorSummary
                          address={item.creator_address}
                          name={item.creator_name}
                          username={item.creator_username}
                          imageUrl={item.creator_img_url}
                          bio={ownershipDetails.creator_bio}
                          closeModal={() => {
                            if (setEditModalOpen) setEditModalOpen(false);
                          }}
                          profileId={item.creator_id}
                        />
                      </div>
                    )}
                {/* Owned by Section */}
                {!isMobile && (
                  <div className="mt-8">
                    <div className="md:text-lg pt-4 dark:text-gray-400">
                      Owned By
                    </div>

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

                    {ownershipDetails?.multiple_owners_list &&
                      ownershipDetails.multiple_owners_list.length > 1 && (
                        <div>
                          <UsersWhoOwn
                            users={ownershipDetails.multiple_owners_list}
                            ownerCount={item.owner_count}
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
                  <div className="md:text-lg py-4 dark:text-gray-500 flex items-center space-x-2">
                    {["137", "80001"].includes(item.chain_identifier) && (
                      <Tippy content="This NFT is on the Polygon chain">
                        <PolygonIcon className="w-4 h-4" />
                      </Tippy>
                    )}
                    {item.chain_identifier == "NetXdQprcVkpaWU" && (
                      <Tippy content="This NFT is on the Tezos chain">
                        <TezosIcon className="w-auto h-4" />
                      </Tippy>
                    )}

                    <span>Owner History</span>
                  </div>
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
                    <div className="md:text-lg pt-4 dark:text-gray-500">
                      Owned By
                    </div>

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

                    {ownershipDetails?.multiple_owners_list &&
                      ownershipDetails.multiple_owners_list.length > 1 && (
                        <div>
                          <UsersWhoOwn
                            users={ownershipDetails.multiple_owners_list}
                            ownerCount={item.owner_count}
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
              <div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
            </div>
          )}

          {/* OpenSea Link */}

          <div className="m-4 flex text-sm">
            {[CONTRACTS.HICETNUNC, CONTRACTS.KALAMINT].includes(
              item.contract_address
            ) ? null : (
              <>
                <a
                  href={`https://opensea.io/assets/${
                    item.chain_identifier == 137 ? "matic/" : ""
                  }${item.contract_address}/${
                    item.token_id
                  }?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`}
                  title="Buy on OpenSea"
                  target="_blank"
                  onClick={() => {
                    mixpanel.track("OpenSea link click");
                  }}
                  className="mr-4 text-gray-500 hover:text-stpink"
                  rel="noreferrer"
                >
                  <div>View on OpenSea</div>
                </a>
                <div className="mr-4">·</div>{" "}
              </>
            )}
            <div
              onClick={() => {
                parentSetReportModalOpen !== undefined
                  ? parentSetReportModalOpen(true)
                  : setReportModalOpen(true);
              }}
              className="text-gray-500 hover:text-stpink cursor-pointer whitespace-nowrap"
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
