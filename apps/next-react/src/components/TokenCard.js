import { useState, useRef, Fragment, useEffect } from "react";
import { DEFAULT_PROFILE_PIC, SHOWTIME_CONTRACTS } from "@/lib/constants";
import Link from "next/link";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import ReactPlayer from "react-player";
import mixpanel from "mixpanel-browser";
import TokenCardImage from "@/components/TokenCardImage";
import {
  formatAddressShort,
  truncateWithEllipses,
  classNames,
} from "@/lib/utilities";
import axios from "@/lib/axios";
import { MenuIcon, PlayIcon } from "@heroicons/react/solid";
import EllipsisIcon from "./Icons/EllipsisIcon";
import BadgeIcon from "./Icons/BadgeIcon";
import { Menu, Transition } from "@headlessui/react";
import MiniFollowButton from "./MiniFollowButton";
import useProfile from "@/hooks/useProfile";
import OrbitIcon from "./Icons/OrbitIcon";
import { CHAIN_IDENTIFIERS } from "../lib/constants";
import ShowtimeIcon from "./Icons/ShowtimeIcon";
import Tippy from "@tippyjs/react";

const TokenCard = ({
  originalItem,
  isMyProfile,
  listId,
  changeSpotlightItem,
  currentlyPlayingVideo,
  setCurrentlyPlayingVideo,
  setCurrentlyOpenModal,
  setTransferModal,
  setBurnModal,
  setListModal,
  setUnlistModal,
  setBuyModal,
  pageProfile,
  handleRemoveItem,
  showUserHiddenItems,
  showDuplicates,
  setHasUserHiddenItems,
  isChangingOrder,
}) => {
  const { myProfile } = useProfile();
  const [item, setItem] = useState(originalItem);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const hasMatchingListing = item?.listing?.all_sellers?.find((seller) => {
    return seller.profile_id === pageProfile?.profile_id;
  });
  const ifListedIsOwner =
    myProfile?.profile_id === item?.listing?.profile_id &&
    typeof myProfile?.profile_id === "number";

  // Automatically load models that have no preview image. We don't account for video here because currently token_animation_url is a glb file.
  useEffect(() => {
    if (!item || !item.mime_type?.startsWith("model")) return;
    if (item.token_img_url || item.token_img_original_url) return;

    setShowModel(true);
  }, [item]);

  useEffect(() => {
    setItem(originalItem);
  }, [originalItem]);

  const divRef = useRef();

  const handleHide = async () => {
    setItem({ ...item, user_hidden: true });
    setHasUserHiddenItems(true);

    // Post changes to the API
    await axios.post(`/api/hidenft/${item.nft_id}/${listId}`, {
      showDuplicates: showDuplicates ? 1 : 0,
    });

    if (!showUserHiddenItems) handleRemoveItem(item.nft_id);

    mixpanel.track("Hid item");
  };

  const handleUnhide = async () => {
    setItem({ ...item, user_hidden: false });

    // Post changes to the API
    await axios.post(`/api/unhidenft/${item.nft_id}/${listId}`, {
      showDuplicates: showDuplicates ? 1 : 0,
    });

    mixpanel.track("Unhid item");
  };

  const handleRefreshNFTMetadata = async () => {
    // Keep these from the original item
    const user_hidden = item.user_hidden;
    const owner_id = item.owner_id;

    setRefreshing(true);
    const { data } = await axios
      .post(`/api/refreshmetadata/${item.nft_id}`)
      .then((res) => res.data);

    if (data)
      setItem({ ...data, user_hidden: user_hidden, owner_id: owner_id });
    else handleRemoveItem(item.nft_id);

    setRefreshing(false);
  };

  const getBackgroundColor = (item) => {
    if (
      item.token_background_color &&
      item.token_background_color.length === 6
    ) {
      return `#${item.token_background_color}`;
    } else {
      return null;
    }
  };

  return (
    <div className={`w-full h-full ${isChangingOrder ? "cursor-move" : ""}`}>
      <div
        ref={divRef}
        className={`w-full h-full overflow-hidden shadow-lg hover:shadow-xl md:rounded-2xl transition-all duration-300 transform hover:translate-y-[-2px] flex flex-col bg-white dark:bg-black ${
          item.user_hidden ? "opacity-50" : ""
        } ${
          isChangingOrder
            ? "border-2 border-stpink dark:border-stpink"
            : "border-t border-b md:border-l md:border-r border-transparent dark:border-gray-700"
        }`}
      >
        <div ref={item.imageRef} className="p-4 relative">
          <div className="flex items-center justify-between">
            <div className="pr-2">
              {item.contract_is_creator ? (
                <Link href="/c/[collection]" as={`/c/${item.collection_slug}`}>
                  <a className="flex flex-row items-center space-x-2">
                    <img
                      alt={item.collection_name}
                      src={
                        item.collection_img_url
                          ? item.collection_img_url
                          : DEFAULT_PROFILE_PIC
                      }
                      className="rounded-full w-8 h-8"
                    />
                    <div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Created by
                      </span>
                      <div className="text-sm font-semibold truncate -mt-0.5 dark:text-gray-200">
                        {truncateWithEllipses(
                          item.collection_name + " Collection",
                          30
                        )}
                      </div>
                    </div>
                  </a>
                </Link>
              ) : item.creator_address ? (
                <Link
                  href="/[profile]"
                  as={`/${item?.creator_username || item.creator_address}`}
                >
                  <a className="flex flex-row items-center space-x-2">
                    <img
                      alt={item.creator_name}
                      src={
                        item.creator_img_url
                          ? item.creator_img_url
                          : DEFAULT_PROFILE_PIC
                      }
                      className="rounded-full w-8 h-8"
                    />
                    <div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Created by
                      </span>
                      <div className="flex items-center space-x-1 -mt-0.5">
                        <div className="text-sm font-semibold truncate dark:text-gray-200">
                          {item.creator_name === item.creator_address
                            ? formatAddressShort(item.creator_address)
                            : truncateWithEllipses(item.creator_name, 22)}
                        </div>
                        {item.creator_verified == 1 && (
                          <BadgeIcon
                            className="w-3.5 h-3.5 text-black dark:text-white"
                            tickClass="text-white dark:text-black"
                          />
                        )}
                      </div>
                    </div>
                  </a>
                </Link>
              ) : null}
            </div>

            <div className="flex items-center space-x-2">
              {myProfile?.profile_id !== item.creator_id &&
                !item.contract_is_creator &&
                item.creator_id && (
                  <MiniFollowButton profileId={item.creator_id} />
                )}
              <Menu as="div" className="relative">
                {isMyProfile && listId !== 3 ? (
                  <Menu.Button className="text-right text-gray-600 dark:text-white focus:outline-none rounded-full relative hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:bg-gray-100 dark:focus-visible:bg-gray-800 py-2 -my-2 px-2 -mx-2 transition">
                    <EllipsisIcon className="w-5 h-5" />
                  </Menu.Button>
                ) : null}
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Menu.Items className="z-1 absolute right-0 mt-2 origin-top-right border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {SHOWTIME_CONTRACTS.includes(item.contract_address) &&
                      item?.show_transfer_options == 1 && (
                        <>
                          {!hasMatchingListing ? (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => setListModal(item)}
                                  className={classNames(
                                    active
                                      ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                                      : "text-gray-900 dark:text-white",
                                    "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                                  )}
                                >
                                  <span className="block truncate font-medium">
                                    List
                                  </span>
                                </button>
                              )}
                            </Menu.Item>
                          ) : (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => setUnlistModal(item)}
                                  className={classNames(
                                    active
                                      ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                                      : "text-gray-900 dark:text-white",
                                    "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                                  )}
                                >
                                  <span className="block truncate font-medium">
                                    Unlist
                                  </span>
                                </button>
                              )}
                            </Menu.Item>
                          )}
                        </>
                      )}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            mixpanel.track("Clicked Spotlight Item");
                            changeSpotlightItem(item);
                          }}
                          className={classNames(
                            active
                              ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                              : "text-gray-900 dark:text-white",
                            "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                          )}
                        >
                          <span className="block truncate font-medium">
                            Spotlight Item
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={item.user_hidden ? handleUnhide : handleHide}
                          className={classNames(
                            active
                              ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                              : "text-gray-900 dark:text-white",
                            "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                          )}
                        >
                          <span className="block truncate font-medium">
                            {item.user_hidden
                              ? `Unhide From ${
                                  listId === 1
                                    ? "Created"
                                    : listId === 2
                                    ? "Owned"
                                    : listId === 3
                                    ? "Liked"
                                    : "List"
                                }`
                              : `Hide From ${
                                  listId === 1
                                    ? "Created"
                                    : listId === 2
                                    ? "Owned"
                                    : listId === 3
                                    ? "Liked"
                                    : "List"
                                }`}
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleRefreshNFTMetadata}
                          className={classNames(
                            active
                              ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                              : "text-gray-900 dark:text-white",
                            "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                          )}
                        >
                          <span className="block truncate font-medium">
                            Refresh Metadata
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                    {SHOWTIME_CONTRACTS.includes(item.contract_address) &&
                      item?.show_transfer_options == 1 && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setTransferModal(item)}
                                className={classNames(
                                  active
                                    ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                                    : "text-gray-900 dark:text-white",
                                  "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                                )}
                              >
                                <span className="block truncate font-medium">
                                  Transfer
                                </span>
                              </button>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setBurnModal(item)}
                                className={classNames(
                                  active
                                    ? "text-gray-900 dark:text-white bg-red-100 dark:bg-gray-800"
                                    : "text-gray-900 dark:text-white",
                                  "cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left"
                                )}
                              >
                                <span className="block truncate font-medium text-red-500 dark:text-red-700">
                                  Burn
                                </span>
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      )}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        {/* Display card content based on mime_type */}
        {item.mime_type?.startsWith("image") && (
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={() => {
                mixpanel.track("Open NFT modal");
                setCurrentlyOpenModal(item);
                setShowVideo(false);
                setMuted(true);
                setCurrentlyPlayingVideo(null);
              }}
            >
              <div style={{ backgroundColor: getBackgroundColor(item) }}>
                <TokenCardImage nft={item} showModel={showModel} />
              </div>
            </div>
            {refreshing && (
              <div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
                <div className="inline-block w-6 h-6 border-2 border-gray-100 dark:border-gray-300 border-t-gray-800 dark:border-t-gray-800 rounded-full animate-spin mb-2" />
                <span className="dark:text-gray-300">Refreshing...</span>
              </div>
            )}
            {isChangingOrder && (
              <div className="absolute cursor-move inset-0 flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70">
                <div className="p-2 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg shadow flex justify-center items-center">
                  <MenuIcon
                    className="w-5 h-5 text-black dark:text-gray-400 mr-2"
                    aria-hidden="true"
                  />
                  <span className="dark:text-gray-300">Drag to Reorder</span>
                </div>
              </div>
            )}
          </div>
        )}
        {item.mime_type?.startsWith("video") &&
          (showVideo && currentlyPlayingVideo === item.nft_id ? (
            <div className="bg-black">
              <ReactPlayer
                url={
                  item.source_url ? item.source_url : item.token_animation_url
                }
                playing={currentlyPlayingVideo === item.nft_id}
                loop
                controls
                muted={muted}
                width={item.imageRef?.current?.clientWidth}
                height={item.imageRef?.current?.clientWidth}
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
            </div>
          ) : (
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => {
                  mixpanel.track("Open NFT modal");
                  setCurrentlyOpenModal(item);
                  setShowVideo(false);
                  setMuted(true);
                  setCurrentlyPlayingVideo(null);
                }}
              >
                <div style={{ backgroundColor: getBackgroundColor(item) }}>
                  <TokenCardImage nft={item} showModel={showModel} />
                </div>
              </div>

              <div
                className="p-2.5 opacity-80 hover:opacity-100 absolute bottom-0 right-0 cursor-pointer"
                onClick={() => {
                  mixpanel.track("Play card video");
                  setShowVideo(true);
                  setMuted(false);
                  setCurrentlyPlayingVideo(item.nft_id);
                }}
              >
                <PlayIcon className="h-6 w-6 text-white filter drop-shadow" />
              </div>

              {refreshing && (
                <div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
                  <div className="inline-block w-6 h-6 border-2 border-gray-100 dark:border-gray-300 border-t-gray-800 dark:border-t-gray-800 rounded-full animate-spin mb-2" />
                  <span className="dark:text-gray-300">Refreshing...</span>
                </div>
              )}
              {isChangingOrder && (
                <div className="absolute cursor-move inset-0 flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70">
                  <div className="p-2 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg shadow flex justify-center items-center">
                    <MenuIcon
                      className="w-5 h-5 text-black dark:text-gray-400 mr-2"
                      aria-hidden="true"
                    />
                    <span className="dark:text-gray-300">Drag to Reorder</span>
                  </div>
                </div>
              )}
            </div>
          ))}

        {item.mime_type?.startsWith("model") && (
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={() => {
                mixpanel.track("Open NFT modal");
                setCurrentlyOpenModal(item);
                setShowVideo(false);
                setMuted(true);
                setCurrentlyPlayingVideo(null);
              }}
            >
              <div style={{ backgroundColor: getBackgroundColor(item) }}>
                <TokenCardImage nft={item} showModel={showModel} />
              </div>
            </div>
            {showModel ? null : (
              <div
                className="p-2.5 opacity-80 hover:opacity-100 absolute bottom-0 right-0 cursor-pointer"
                onClick={() => {
                  mixpanel.track("Load 3d model for card");
                  setShowModel(true);
                }}
              >
                <div className="flex items-center space-x-1 text-white rounded-full py-1 px-2 -my-1 -mx-1 bg-black bg-opacity-40">
                  <OrbitIcon className="w-4 h-4" />
                  <span className="font-semibold">3D</span>
                </div>
              </div>
            )}
            {refreshing && (
              <div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
                <div className="inline-block w-6 h-6 border-2 border-gray-100 dark:border-gray-300 border-t-gray-800 dark:border-t-gray-800 rounded-full animate-spin mb-2" />
                <span className="dark:text-gray-300">Refreshing...</span>
              </div>
            )}
            {isChangingOrder && (
              <div className="absolute cursor-move inset-0 flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70">
                <div className="p-2 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg shadow flex justify-center items-center">
                  <MenuIcon
                    className="w-5 h-5 text-black dark:text-gray-400 mr-2"
                    aria-hidden="true"
                  />
                  <span className="dark:text-gray-300">Drag to Reorder</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fall back to old code if missing mime_type */}
        {!item.mime_type &&
          ((item.token_has_video ||
            (!item.token_img_url && item.token_animation_url)) &&
          showVideo &&
          currentlyPlayingVideo === item.nft_id ? (
            <div className="bg-black">
              <ReactPlayer
                url={item.token_animation_url}
                playing={
                  currentlyPlayingVideo === item.nft_id ||
                  ((item.token_has_video ||
                    (!item.token_img_url && item.token_animation_url)) &&
                    !item.token_img_url)
                }
                loop
                controls
                muted={muted}
                width={item.imageRef?.current?.clientWidth}
                height={item.imageRef?.current?.clientWidth}
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
            </div>
          ) : (
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => {
                  mixpanel.track("Open NFT modal");
                  setCurrentlyOpenModal(item);
                  setShowVideo(false);
                  setMuted(true);
                  setCurrentlyPlayingVideo(null);
                }}
              >
                <div style={{ backgroundColor: getBackgroundColor(item) }}>
                  <TokenCardImage nft={item} showModel={showModel} />
                </div>
              </div>
              {item.mime_type?.startsWith("model") ? (
                showModel ? null : (
                  <div
                    className="p-2.5 opacity-80 hover:opacity-100 absolute bottom-0 right-0 cursor-pointer"
                    onClick={() => {
                      mixpanel.track("Load 3d model for card");
                      setShowModel(true);
                    }}
                  >
                    <div className="flex items-center space-x-1 text-white rounded-full py-1 px-2 -my-1 -mx-1 bg-black bg-opacity-40">
                      <OrbitIcon className="w-4 h-4" />
                      <span className="font-semibold">3D</span>
                    </div>
                  </div>
                )
              ) : item.token_has_video ||
                (!item.token_img_url && item.token_animation_url) ? (
                <div
                  className="p-2.5 opacity-80 hover:opacity-100 absolute bottom-0 right-0 cursor-pointer"
                  onClick={() => {
                    mixpanel.track("Play card video");
                    setShowVideo(true);
                    setMuted(false);
                    setCurrentlyPlayingVideo(item.nft_id);
                  }}
                >
                  <PlayIcon className="h-6 w-6 text-white filter drop-shadow" />
                </div>
              ) : null}
              {refreshing && (
                <div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
                  <div className="inline-block w-6 h-6 border-2 border-gray-100 dark:border-gray-300 border-t-gray-800 dark:border-t-gray-800 rounded-full animate-spin mb-2" />
                  <span className="dark:text-gray-300">Refreshing...</span>
                </div>
              )}
              {isChangingOrder && (
                <div className="absolute cursor-move inset-0 flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70">
                  <div className="p-2 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg shadow flex justify-center items-center">
                    <MenuIcon
                      className="w-5 h-5 text-black dark:text-gray-400 mr-2"
                      aria-hidden="true"
                    />
                    <span className="dark:text-gray-300">Drag to Reorder</span>
                  </div>
                </div>
              )}
            </div>
          ))}

        <div className="p-4">
          <div>
            <div className="flex items-center !space-x-1.5">
              <p
                onClick={() => {
                  mixpanel.track("Open NFT modal");
                  setCurrentlyOpenModal(item);

                  setShowVideo(false);
                  setMuted(true);
                  setCurrentlyPlayingVideo(null);
                }}
                className="break-words cursor-pointer truncate text-lg font-semibold dark:text-gray-200"
              >
                {item.token_name}
              </p>
              {SHOWTIME_CONTRACTS.includes(item.contract_address) && (
                <Tippy content="Created on Showtime">
                  <div className="flex items-center justify-center">
                    <ShowtimeIcon className="w-5 h-5 rounded-full fill-gold" />
                  </div>
                </Tippy>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LikeButton item={item} />
                <CommentButton
                  item={item}
                  handleComment={() => {
                    mixpanel.track("Open NFT modal via comment button");
                    setCurrentlyOpenModal(item);
                    setShowVideo(false);
                    setMuted(true);
                    setCurrentlyPlayingVideo(null);
                  }}
                />
              </div>
              <ShareButton
                url={
                  window.location.protocol +
                  "//" +
                  window.location.hostname +
                  (window.location.port ? ":" + window.location.port : "") +
                  `/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                    (key) => CHAIN_IDENTIFIERS[key] == item.chain_identifier
                  )}/${item.contract_address}/${item.token_id}`
                }
                type={"item"}
              />
            </div>
          </div>
        </div>
        <hr className="mx-4 border-gray-100 dark:border-gray-800" />
        <div className="flex flex-1 items-end">
          <div className="w-full">
            <div className="px-4 pb-4 pt-1 flex flex-col w-full">
              <div>
                {item.listing ? (
                  <div className="flex items-center justify-between pt-1 space-x-4">
                    <Link
                      href="/[profile]"
                      as={`/${item.listing.username || item.listing.address}`}
                    >
                      <a className="flex flex-row items-center space-x-2 flex-shrink min-w-0">
                        <img
                          alt={item.listing.name}
                          src={
                            item.listing.img_url
                              ? item.listing.img_url
                              : DEFAULT_PROFILE_PIC
                          }
                          className="rounded-full mr-1 w-8 h-8 flex-shrink-0"
                        />
                        <div className="flex-shrink min-w-0">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-500">
                            Listed by
                          </span>
                          <div className="flex items-center space-x-1 -mt-0.5">
                            <div className="text-sm font-semibold truncate dark:text-gray-200 min-w-0">
                              {item.listing.name
                                ? item.listing.name === item.listing.address
                                  ? formatAddressShort(item.listing.name)
                                  : truncateWithEllipses(item.listing.name, 22)
                                : formatAddressShort(item.listing.name)}
                            </div>
                            {item.listing.verified == 1 && (
                              <BadgeIcon
                                className="w-3.5 h-3.5 text-black dark:text-white"
                                tickClass="text-white dark:text-black"
                              />
                            )}
                          </div>
                        </div>
                      </a>
                    </Link>
                    {ifListedIsOwner ? (
                      <section className="space-x-4 flex items-end hover:bg-gray-100 dark:hover:bg-gray-900 py-0.5 px-3 -my-0.5 -mx-3 rounded-lg transition bg-gray-100 dark:bg-gray-900">
                        <div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-500">
                            Listed for
                          </span>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200 whitespace-nowrap">
                            {parseFloat(item.listing.min_price)} $
                            {item.listing.currency}
                          </p>
                        </div>
                      </section>
                    ) : (
                      <button
                        onClick={() => setBuyModal(item)}
                        className="space-x-4 flex items-end hover:bg-gray-100 dark:hover:bg-gray-900 py-0.5 px-3 -my-0.5 -mx-3 rounded-lg transition"
                      >
                        <div className="text-right">
                          <span className="text-xs text-right font-medium text-gray-600 dark:text-gray-500">
                            Buy
                          </span>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200 whitespace-nowrap">
                            {parseFloat(item.listing.min_price)} $
                            {item.listing.currency}
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                ) : item.owner_count && item.owner_count > 1 ? (
                  pageProfile && listId === 2 ? (
                    <div className="flex items-center pt-1">
                      <Link
                        href="/[profile]"
                        as={`/${item?.owner_username || item.owner_address}`}
                      >
                        <a className="flex flex-row items-center space-x-2">
                          <img
                            alt={item.owner_name}
                            src={
                              item.owner_img_url
                                ? item.owner_img_url
                                : DEFAULT_PROFILE_PIC
                            }
                            className="rounded-full mr-1 w-8 h-8"
                          />
                          <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-500">
                              Owned by
                            </span>
                            <div className="flex items-center space-x-1 -mt-0.5">
                              <div className="text-sm font-semibold truncate dark:text-gray-200">
                                {item.owner_name === item.owner_address
                                  ? formatAddressShort(item.owner_address)
                                  : truncateWithEllipses(item.owner_name, 22)}
                              </div>
                              {item.owner_verified == 1 && (
                                <BadgeIcon
                                  className="w-3.5 h-3.5 text-black dark:text-white"
                                  tickClass="text-white dark:text-black"
                                />
                              )}
                              <div className="text-gray-500 text-sm mr-2 -ml-1 mt-px">
                                &amp; {item.owner_count - 1} other
                                {item.owner_count - 1 > 1 ? "s" : null}
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Multiple owners
                    </span>
                  )
                ) : item.owner_id ? (
                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href="/[profile]"
                      as={`/${item?.owner_username || item.owner_address}`}
                    >
                      <a className="flex flex-row items-center space-x-2">
                        <img
                          alt={item.owner_name}
                          src={
                            item.owner_img_url
                              ? item.owner_img_url
                              : DEFAULT_PROFILE_PIC
                          }
                          className="rounded-full mr-1 w-8 h-8"
                        />
                        <div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-500">
                            Owned by
                          </span>
                          <div className="flex items-center space-x-1 -mt-0.5">
                            <div className="text-sm font-semibold truncate dark:text-gray-200">
                              {item.owner_name === item.owner_address
                                ? formatAddressShort(item.owner_address)
                                : truncateWithEllipses(item.owner_name, 22)}
                            </div>
                            {item.owner_verified == 1 && (
                              <BadgeIcon
                                className="w-3.5 h-3.5 text-black dark:text-white"
                                tickClass="text-white dark:text-black"
                              />
                            )}
                          </div>
                        </div>
                      </a>
                    </Link>
                    {myProfile?.profile_id !== item.owner_id && (
                      <MiniFollowButton profileId={item.owner_id} />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {item.collection_img_url && (
                  <img
                    src={item.collection_img_url}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {item.collection_name}
                </p>
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {item.token_count ? `${item.token_count} Editions` : "1/1"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
