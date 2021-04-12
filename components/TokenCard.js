import React from "react";
import Link from "next/link";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  //faExternalLinkAlt,
  faPlay,
  faEllipsisH,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
//import { faEdit } from "@fortawesome/free-regular-svg-icons";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import ReactPlayer from "react-player";
import mixpanel from "mixpanel-browser";
import AppContext from "../context/app-context";
//import { getBidLink } from "../lib/utilities";
import MiniFollowButton from "./MiniFollowButton";
import TokenCardImage from "../components/TokenCardImage";

class TokenCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spans: 1,
      moreShown: false,
      imageLoaded: false,
      showVideo: false,
      muted: true,
      refreshing: false,
    };
    this.handleMoreShown = this.handleMoreShown.bind(this);
    this.divRef = React.createRef();
    this.imageRef = React.createRef();
    //this.setSpans = this.setSpans.bind(this);
  }

  removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, " ");
  }

  truncateWithEllipses(text, max) {
    if (text) {
      return text.substr(0, max - 1) + (text.length > max ? "..." : "");
    }
  }

  handleMoreShown = () => {
    this.setState(
      { moreShown: true }
      //this.setSpans
    );
  };

  handleHide = async () => {
    this.props.setUserHiddenItems([
      ...this.props.userHiddenItems,
      this.props.item.nft_id,
    ]);

    // Post changes to the API
    await fetch(`/api/hidenft/${this.props.item.nft_id}/${this.props.listId}`, {
      method: "post",
    });

    mixpanel.track("Hid item");
  };

  handleUnhide = async () => {
    this.props.setUserHiddenItems([
      ...this.props.userHiddenItems.filter(
        (nft_id) => nft_id != this.props.item.nft_id
      ),
    ]);

    // Post changes to the API
    await fetch(
      `/api/unhidenft/${this.props.item.nft_id}/${this.props.listId}`,
      {
        method: "post",
      }
    );

    mixpanel.track("Unhid item");
  };

  handleRefreshNFTMetadata = async () => {
    this.setState({ refreshing: true });
    await fetch(`/api/refreshmetadata/${this.props.item.nft_id}`, {
      method: "post",
    });
    await this.props.refreshItems();
    this.setState({ refreshing: false });
  };

  getImageUrl = (token_aspect_ratio) => {
    var img_url = this.props.item.token_img_url
      ? this.props.item.token_img_url
      : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      if (token_aspect_ratio && token_aspect_ratio > 1) {
        img_url = img_url.split("=")[0] + "=h660";
      } else {
        img_url = img_url.split("=")[0] + "=w660";
      }
    }
    return img_url;
  };

  max_description_length = 67;

  getBackgroundColor = (item) => {
    if (
      item.token_background_color &&
      item.token_background_color.length === 6
    ) {
      return `#${item.token_background_color}`;
    } else {
      return null;
    }
  };

  render() {
    const {
      item,
      showDuplicateNFTs,
      setShowDuplicateNFTs,
      isMyProfile,
      listId,
    } = this.props;
    const hash = item.token_img_url || item.token_animation_url;
    const { isMobile } = this.context;
    return (
      <>
        <div className="px-3">
          <div
            style={
              this.props.userHiddenItems &&
              this.props.userHiddenItems.includes(this.props.item.nft_id)
                ? { opacity: 0.7, backgroundColor: "#ddd" }
                : null
            }
            ref={this.divRef}
            className="mx-auto sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all bg-white"
          >
            <div
              ref={this.imageRef}
              className="p-4 flex flex-row items-center relative"
            >
              <div className="pr-2 ">
                {item.contract_is_creator ? (
                  <Link
                    href="/c/[collection]"
                    as={`/c/${item.collection_slug}`}
                  >
                    <a className="flex flex-row items-center ">
                      <div>
                        <img
                          alt={item.collection_name}
                          src={
                            item.collection_img_url
                              ? item.collection_img_url
                              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                          }
                          className="rounded-full"
                          style={{ height: 24, width: 24 }}
                        />
                      </div>
                      <div className="showtime-card-profile-link ml-2">
                        {this.truncateWithEllipses(
                          item.collection_name + " Collection",
                          30
                        )}
                      </div>
                    </a>
                  </Link>
                ) : item.creator_address ? (
                  <Link
                    href="/[profile]"
                    as={`/${item?.creator_username || item.creator_address}`}
                  >
                    <a className="flex flex-row items-center ">
                      <div>
                        <img
                          alt={item.creator_name}
                          src={
                            item.creator_img_url
                              ? item.creator_img_url
                              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                          }
                          className="rounded-full"
                          style={{ height: 24, width: 24, minWidth: 24 }}
                        />
                      </div>
                      <div className="ml-2 hover:text-stpink truncate">
                        {this.truncateWithEllipses(item.creator_name, 22)}
                      </div>
                    </a>
                  </Link>
                ) : null}
              </div>

              {this.context.myProfile?.profile_id !== item.creator_id &&
                !(isMyProfile && listId !== 3) && (
                  <MiniFollowButton profileId={item.creator_id} />
                )}
              <div className="flex-grow">&nbsp;</div>

              <div>
                {isMyProfile && listId !== 3 ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();

                      this.props.setOpenCardMenu(
                        this.props.openCardMenu == item.nft_id + "_" + listId
                          ? null
                          : item.nft_id + "_" + listId
                      );
                    }}
                    className="card-menu-button text-right text-gray-500"
                  >
                    <FontAwesomeIcon
                      style={{
                        height: 20,
                        width: 20,
                      }}
                      icon={faEllipsisH}
                    />
                  </div>
                ) : null}

                {this.props.openCardMenu == item.nft_id + "_" + listId ? (
                  <div className="">
                    <div className="flex justify-end relative z-10">
                      <div
                        className={`absolute text-center top-2 bg-white shadow-lg py-2 px-2 rounded-xl transition-all text-md transform  ${
                          this.props.openCardMenu == item.nft_id + "_" + listId
                            ? "visible opacity-1 "
                            : "invisible opacity-0"
                        }`}
                        style={{ border: "1px solid #f0f0f0" }}
                      >
                        <div
                          className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap flex flew-row"
                          onClick={() => {
                            mixpanel.track("Clicked Spotlight Item");
                            this.props.changeSpotlightItem(this.props.item);
                          }}
                        >
                          <div>
                            <FontAwesomeIcon
                              style={{ height: 18, width: 18, marginRight: 6 }}
                              icon={faStar}
                            />
                          </div>
                          <div>Spotlight Item</div>
                        </div>

                        <div
                          className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap"
                          onClick={
                            this.props.userHiddenItems.includes(
                              this.props.item.nft_id
                            )
                              ? this.handleUnhide
                              : this.handleHide
                          }
                        >
                          {this.props.userHiddenItems.includes(
                            this.props.item.nft_id
                          )
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
                        </div>
                        <div
                          className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap"
                          onClick={this.handleRefreshNFTMetadata}
                        >
                          Refresh Metadata
                        </div>
                      </div>
                    </div>
                    {/*<div
                      style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        position: "absolute",
                        top: 40,
                        right: 15,
                        backgroundColor: "white",
                        borderRadius: 7,
                        zIndex: 1,
                        fontSize: 14,
                      }}
                      className="py-2 px-4"
                    >
                      <div
                        className="card-menu-item"
                        onClick={
                          this.props.userHiddenItems.includes(
                            this.props.item.nft_id
                          )
                            ? this.handleUnhide
                            : this.handleHide
                        }
                      >
                        {this.props.userHiddenItems.includes(
                          this.props.item.nft_id
                        )
                          ? `Unhide item from ${
                              listId === 1
                                ? "Created"
                                : listId === 2
                                ? "Owned"
                                : listId === 3
                                ? "Liked"
                                : "List"
                            }`
                          : `Hide item from ${
                              listId === 1
                                ? "Created"
                                : listId === 2
                                ? "Owned"
                                : listId === 3
                                ? "Liked"
                                : "List"
                            }`}
                      </div>
                          </div>*/}
                  </div>
                ) : null}
              </div>
            </div>
            {item.token_has_video &&
            this.state.showVideo &&
            this.props.currentlyPlayingVideo === item.nft_id ? (
              <div className="bg-black">
                <ReactPlayer
                  url={item.token_animation_url}
                  playing={
                    this.props.currentlyPlayingVideo === item.nft_id ||
                    (item.token_has_video && !item.token_img_url)
                  }
                  loop
                  controls
                  muted={this.state.muted}
                  width={this.imageRef?.current?.clientWidth}
                  height={this.imageRef?.current?.clientWidth}
                  playsinline
                  //onReady={this.setSpans}
                />
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => {
                    mixpanel.track("Open NFT modal");
                    this.props.setCurrentlyOpenModal(item);
                    this.setState({ showVideo: false, muted: true });
                    this.props.setCurrentlyPlayingVideo(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {!this.state.imageLoaded ? (
                    <div
                      className="w-full text-center flex items-center justify-center"
                      style={{
                        height: 373,
                      }}
                    >
                      <div className="loading-card-spinner" />
                    </div>
                  ) : null}
                  <div
                    style={{
                      backgroundColor: this.getBackgroundColor(item),
                    }}
                    //className={
                    //  this.state.imageLoaded === true ? "block" : "hidden"
                    //}
                  >
                    <TokenCardImage
                      nft={item}
                      onLoad={() => {
                        //console.log("HERE");
                        this.setState({ imageLoaded: true });
                      }}
                    />
                  </div>
                </div>
                {item.token_has_video ? (
                  <div
                    className="p-4 playbutton"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      mixpanel.track("Play card video");
                      this.setState({ showVideo: true, muted: false });
                      this.props.setCurrentlyPlayingVideo(item.nft_id);
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        height: 20,
                        width: 20,
                        color: "white",
                        filter: "drop-shadow(0px 0px 10px grey)",
                      }}
                      icon={faPlay}
                    />
                  </div>
                ) : null}
                {this.state.refreshing && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fffffff0",
                    }}
                  >
                    <div className="loading-card-spinner-small mb-2" />
                    <div>Refreshing...</div>
                  </div>
                )}
              </div>
            )}

            <div className="p-4">
              <div>
                <div className="">
                  <div
                    onClick={() => {
                      mixpanel.track("Open NFT modal");
                      this.props.setCurrentlyOpenModal(item);
                      this.setState({ showVideo: false, muted: true });
                      this.props.setCurrentlyPlayingVideo(null);
                    }}
                    className=""
                    style={{
                      overflowWrap: "break-word",
                      wordWrap: "break-word",

                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.token_name}
                    {/* {this.props.item.token_has_video ? (
                      <FontAwesomeIcon
                        className="ml-1 inline"
                        style={{ height: 12, marginBottom: 2 }}
                        icon={faVideo}
                      />
                    ) : null} */}
                  </div>
                  {!isMobile || item.token_description ? (
                    <div
                      style={
                        isMobile
                          ? {
                              overflowWrap: "break-word",
                              wordWrap: "break-word",
                              display: "block",
                              minHeight: "3.5rem",
                            }
                          : {
                              overflowWrap: "break-word",
                              wordWrap: "break-word",
                              display: "block",
                              minHeight: "4.7rem",
                            }
                      }
                      className="py-4 text-gray-500 text-sm"
                    >
                      {this.state.moreShown ? (
                        <div>{this.removeTags(item.token_description)}</div>
                      ) : (
                        <div>
                          {item.token_description?.length >
                          this.max_description_length ? (
                            <>
                              {this.truncateWithEllipses(
                                this.removeTags(item.token_description),
                                this.max_description_length
                              )}{" "}
                              <a
                                onClick={this.handleMoreShown}
                                className="text-gray-900 hover:text-gray-500 cursor-pointer"
                              >
                                {" "}
                                more
                              </a>
                            </>
                          ) : (
                            <div>{this.removeTags(item.token_description)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center">
                  <div className="mr-4">
                    <LikeButton item={item} />
                  </div>
                  <div className="mr-4">
                    <CommentButton
                      item={item}
                      handleComment={() => {
                        mixpanel.track("Open NFT modal via comment button");
                        this.props.setCurrentlyOpenModal(item);
                        this.setState({ showVideo: false, muted: true });
                        this.props.setCurrentlyPlayingVideo(null);
                      }}
                    />
                  </div>
                  <div>
                    <ShareButton
                      url={
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
                </div>
              </div>
            </div>
            <div
              className="flex items-end md:h-20"
              style={{
                borderTopWidth: 1,
                borderColor: "rgb(219,219,219)",
              }}
            >
              <div className="mx-4 py-4 flex flex-col">
                <div className="flex-shrink pr-2 text-xs text-gray-500 mb-1">
                  Owned by {item.multiple_owners ? null : null}
                </div>
                <div>
                  {item.multiple_owners ? (
                    <span className="text-gray-500">Multiple owners</span>
                  ) : item.owner_id ? (
                    <div className="flex flex-row items-center pt-1">
                      <Link
                        href="/[profile]"
                        as={`/${item?.owner_username || item.owner_address}`}
                      >
                        <a className="flex flex-row items-center pr-2 ">
                          <div>
                            <img
                              alt={item.owner_name}
                              src={
                                item.owner_img_url
                                  ? item.owner_img_url
                                  : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                              }
                              className="rounded-full mr-2"
                              style={{ height: 24, width: 24 }}
                            />
                          </div>
                          <div className="showtime-card-profile-link">
                            {this.truncateWithEllipses(item.owner_name, 24)}
                          </div>
                        </a>
                      </Link>
                      {this.context.myProfile?.profile_id !== item.owner_id &&
                        !(isMyProfile && listId !== 3) && (
                          <MiniFollowButton profileId={item.owner_id} />
                        )}
                      <div className="flex-grow">&nbsp;</div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex-grow"></div>

              {/*<div className="mr-4 py-4 text-sm text-gray-500 hover:text-gray-400 cursor-pointer">
                <a
                  href={getBidLink(item)}
                  target="_blank"
                  className="flex flex-row items-center "
                >
                  <div className="mr-1">Bid</div>
                </a>
                        </div>*/}
            </div>
          </div>
          <div
            className="text-right mr-2 mt-1 sm:mb-5 flex flex-row"
            style={{ fontWeight: 400, fontSize: 14 }}
          >
            <div className="flex-grow"></div>
            {item.duplicate_count > 1 && (
              <div
                onClick={() => {
                  setShowDuplicateNFTs({
                    ...showDuplicateNFTs,
                    [hash]: !showDuplicateNFTs[hash],
                  });
                }}
                className="showtime-card-profile-link ml-2 cursor-pointer"
                style={{ fontWeight: 400 }}
              >
                {`${showDuplicateNFTs[hash] ? "Hide" : "Show"} ${
                  item.duplicate_count - 1
                } more similar`}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
TokenCard.contextType = AppContext;

export default TokenCard;
