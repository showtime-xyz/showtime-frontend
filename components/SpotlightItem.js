import React from "react";
import Link from "next/link";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPlay,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";
//import { faEdit } from "@fortawesome/free-regular-svg-icons";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import ReactPlayer from "react-player";
import mixpanel from "mixpanel-browser";
import AppContext from "../context/app-context";
import { getBidLink, getContractName } from "../lib/utilities";
import ModalTokenDetail from "./ModalTokenDetail";

class SpotlightItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spans: 1,
      moreShown: false,
      imageLoaded: false,
      showVideo: false,
      muted: true,
      refreshing: false,
      currentlyOpenModal: false,
      currentlyPlayingVideo: false,
    };
    this.divRef = React.createRef();
  }

  handleLike = async (nft_id) => {
    // Change myLikes via setMyLikes
    this.context.setMyLikes([...this.context.myLikes, nft_id]);

    const likedItem = this.props.item;
    const myLikeCounts = this.context.myLikeCounts;
    this.context.setMyLikeCounts({
      ...this.context.myLikeCounts,
      [nft_id]:
        ((myLikeCounts && myLikeCounts[nft_id]) || likedItem.like_count) + 1,
    });

    // Post changes to the API
    await fetch(`/api/like_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Liked item");
  };

  handleUnlike = async (nft_id) => {
    // Change myLikes via setMyLikes
    this.context.setMyLikes(
      this.context.myLikes.filter((item) => !(item === nft_id))
    );

    const likedItem = this.props.item;
    const myLikeCounts = this.context.myLikeCounts;
    this.context.setMyLikeCounts({
      ...this.context.myLikeCounts,
      [nft_id]:
        ((myLikeCounts && myLikeCounts[nft_id]) || likedItem.like_count) - 1,
    });

    // Post changes to the API
    await fetch(`/api/unlike_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Unliked item");
  };

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

  handleRefreshNFTMetadata = async () => {
    this.setState({ refreshing: true });
    await fetch(`/api/refreshmetadata/${this.props.item.nft_id}`, {
      method: "post",
    });
    await this.props.refreshItems();
    this.setState({ refreshing: false });
  };

  getImageUrl = () => {
    var img_url = this.props.item.token_img_url
      ? this.props.item.token_img_url
      : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      img_url = img_url.split("=")[0] + "=w375";
    }
    return img_url;
  };

  max_description_length = 150;

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
    const { item, isMyProfile, listId } = this.props;
    const hash = item.token_img_url || item.token_animation_url;
    const { isMobile, columns } = this.context;
    return (
      <>
        {typeof document !== "undefined" ? (
          <>
            <ModalTokenDetail
              isOpen={this.state.currentlyOpenModal}
              setEditModalOpen={(_) =>
                this.setState({ currentlyOpenModal: false })
              }
              item={this.props.item}
              handleLike={this.handleLike}
              handleUnlike={this.handleUnlike}
              // goToNext={goToNext}
              // goToPrevious={goToPrevious}
              // columns={context.columns}
              // hasNext={false}
              // hasPrevious={false}
            />
          </>
        ) : null}
        <div className="w-full">
          <div
            style={_.merge(
              {
                backgroundColor: "white",
              },
              columns === 1
                ? {
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                  }
                : {
                    height: 500,
                    borderWidth: 1,
                  }
            )}
            ref={this.divRef}
            className={
              isMobile
                ? "mx-auto shadow-lg"
                : "mx-3 flex sm:rounded-md overflow-hidden hover:shadow-xl transition border-gray-300"
            }
          >
            {(item.token_has_video &&
              this.state.showVideo &&
              this.state.currentlyPlayingVideo) ||
            (item.token_has_video && !item.token_img_url) ? (
              <div className="sm:flex-1 md:w-2/4 bg-black">
                <ReactPlayer
                  url={item.token_animation_url}
                  playing={
                    this.state.currentlyPlayingVideo ||
                    (item.token_has_video && !item.token_img_url)
                  }
                  loop
                  controls
                  muted={this.state.muted}
                  width={columns === 1 ? window.innerWidth : "100%"}
                  height={
                    columns === 1
                      ? item.imageRef.current
                        ? item.imageRef.current.height
                        : null
                      : "100%"
                  }
                  playsinline
                  //onReady={this.setSpans}
                />
              </div>
            ) : (
              <div
                className="sm:flex-1 md:w-2/4"
                style={{ position: "relative" }}
              >
                <div
                  onClick={() => {
                    mixpanel.track("Open NFT modal");
                    this.setState({
                      currentlyOpenModal: true,
                      showVideo: false,
                      muted: true,
                      currentlyPlayingVideo: false,
                    });
                  }}
                  style={{ cursor: "pointer" }}
                  className="h-full"
                >
                  {!this.state.imageLoaded ? (
                    <div
                      className="w-full text-center flex items-center justify-center"
                      style={
                        columns === 1
                          ? { height: window.innerWidth }
                          : { height: 373 }
                      }
                    >
                      <div className="loading-card-spinner" />
                    </div>
                  ) : null}
                  <div
                    style={{
                      backgroundColor: this.getBackgroundColor(item),
                    }}
                    className="h-full"
                  >
                    <img
                      className="w-full object-cover object-center h-full"
                      ref={item.imageRef}
                      src={this.getImageUrl()}
                      alt={item.token_name}
                      onLoad={() => this.setState({ imageLoaded: true })}
                      style={{
                        ...(!this.state.imageLoaded ? { display: "none" } : {}),
                        ...(columns === 1 ? { height: window.innerWidth } : {}),
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
                      this.setState({
                        showVideo: true,
                        muted: false,
                        currentlyPlayingVideo: true,
                      });
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

            <div className="p-4 md:p-6 sm:flex-1 md:w-2/4">
              <div>
                <div className="">
                  {!isMobile && (
                    <div className="flex items-top justify-between">
                      <div className="text-gray-500 flex items-center">
                        <FontAwesomeIcon
                          style={{
                            height: 22,
                            width: 22,
                          }}
                          icon={faSun}
                        />
                        <div className="text-lg ml-1">Spotlight</div>
                      </div>
                      {isMyProfile && (
                        <div className="relative">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();

                              this.props.setOpenCardMenu(
                                this.props.openCardMenu ==
                                  item.nft_id + "_" + listId
                                  ? null
                                  : item.nft_id + "_" + listId
                              );
                            }}
                            className="card-menu-button text-right flex items-center justify-center ml-4"
                          >
                            <FontAwesomeIcon
                              style={{
                                height: 20,
                                width: 20,
                              }}
                              icon={faEllipsisH}
                            />
                          </div>
                          {this.props.openCardMenu ==
                          item.nft_id + "_" + listId ? (
                            <div className="">
                              <div className="flex justify-end relative z-10">
                                <div
                                  className={`absolute text-center top-2 bg-white shadow-lg py-2 px-2 rounded-xl transition-all text-md transform  ${
                                    this.props.openCardMenu ==
                                    item.nft_id + "_" + listId
                                      ? "visible opacity-1 "
                                      : "invisible opacity-0"
                                  }`}
                                  style={{ border: "1px solid #f0f0f0" }}
                                >
                                  <div
                                    className="py-2 px-3 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap"
                                    onClick={this.handleRefreshNFTMetadata}
                                  >
                                    Refresh Metadata
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    onClick={() => {
                      mixpanel.track("Open NFT modal");
                      this.setState({
                        currentlyOpenModal: true,
                        showVideo: false,
                        muted: true,
                        currentlyPlayingVideo: false,
                      });
                    }}
                    className="showtime-card-title md:mb-2"
                    style={{
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      fontSize: isMobile ? 24 : 36,
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
                      style={{
                        fontSize: isMobile ? 14 : 18,
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        display: "block",
                        minHeight: "3.5rem",
                      }}
                      className="py-2 md:pb-4 text-gray-500"
                    >
                      <div>
                        {item.token_description?.length >
                        this.max_description_length ? (
                          <>
                            {this.truncateWithEllipses(
                              this.removeTags(item.token_description),
                              this.max_description_length
                            )}{" "}
                            <a
                              onClick={() => {
                                this.setState({ currentlyOpenModal: true });
                              }}
                              style={{ color: "#111", cursor: "pointer" }}
                            >
                              {" "}
                              more
                            </a>
                          </>
                        ) : (
                          <div>{this.removeTags(item.token_description)}</div>
                        )}
                      </div>
                    </div>
                  ) : null}
                  <div className="flex items-center">
                    <div className="mr-3">
                      <LikeButton
                        item={item}
                        handleLike={this.handleLike}
                        handleUnlike={this.handleUnlike}
                      />
                    </div>
                    <div className="mr-3">
                      <CommentButton
                        item={item}
                        handleComment={() => {
                          mixpanel.track("Open NFT modal via comment button");
                          this.setState({
                            currentlyOpenModal: true,
                            showVideo: false,
                            muted: true,
                            currentlyPlayingVideo: false,
                          });
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
                    <div>
                      {isMyProfile && isMobile && (
                        <>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();

                              this.props.setOpenCardMenu(
                                this.props.openCardMenu ==
                                  item.nft_id + "_" + listId
                                  ? null
                                  : item.nft_id + "_" + listId
                              );
                            }}
                            className="card-menu-button text-right flex items-center justify-center ml-4"
                          >
                            <FontAwesomeIcon
                              style={{
                                height: 20,
                                width: 20,
                              }}
                              icon={faEllipsisH}
                            />
                          </div>

                          {this.props.openCardMenu ==
                          item.nft_id + "_" + listId ? (
                            <div className="">
                              <div className="flex justify-end relative z-10">
                                <div
                                  className={`absolute text-center top-2 bg-white shadow-lg py-2 px-2 rounded-xl transition-all text-md transform  ${
                                    this.props.openCardMenu ==
                                    item.nft_id + "_" + listId
                                      ? "visible opacity-1 "
                                      : "invisible opacity-0"
                                  }`}
                                  style={{ border: "1px solid #f0f0f0" }}
                                >
                                  <div
                                    className="py-2 px-3 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap"
                                    onClick={this.handleRefreshNFTMetadata}
                                  >
                                    Refresh Metadata
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col items-start"
                style={
                  {
                    // borderTopWidth: 1,
                    // borderColor: "rgb(219,219,219)",
                  }
                }
              >
                <div className="flex flex-col mt-3 md:mt-6">
                  <div>
                    <div
                      className="flex-shrink pr-2"
                      style={{
                        fontWeight: 400,
                        fontSize: 14,
                        color: "#888",
                      }}
                    >
                      Owned by
                    </div>
                    <div className="md:text-lg">
                      {item.multiple_owners ? (
                        <span style={{ color: "#888" }}>Multiple owners</span>
                      ) : item.owner_id ? (
                        <Link
                          href="/[profile]"
                          as={`/${item?.owner_username || item.owner_address}`}
                        >
                          <a className="flex flex-row items-center pt-1">
                            <div>
                              <img
                                alt={item.owner_name}
                                src={
                                  item.owner_img_url
                                    ? item.owner_img_url
                                    : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                                }
                                className="rounded-full mr-2"
                                style={{
                                  height: isMobile ? 24 : 30,
                                  width: isMobile ? 24 : 30,
                                }}
                              />
                            </div>
                            <div className="showtime-card-profile-link">
                              {this.truncateWithEllipses(item.owner_name, 22)}
                            </div>
                          </a>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className="py-4 flex flex-col items-start"
                    style={{ position: "relative" }}
                  >
                    <div
                      className="flex-shrink pr-2"
                      style={{
                        fontWeight: 400,
                        fontSize: 14,
                        color: "#888",
                      }}
                    >
                      Created by
                    </div>
                    <div className="flex-shrink">
                      {item.creator_address ? (
                        <Link
                          href="/[profile]"
                          as={`/${
                            item?.creator_username || item.creator_address
                          }`}
                        >
                          <a className="flex flex-row items-center pt-1">
                            <div>
                              <img
                                alt={item.creator_name}
                                src={
                                  item.creator_img_url
                                    ? item.creator_img_url
                                    : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                                }
                                className="rounded-full"
                                style={{
                                  height: isMobile ? 24 : 30,
                                  width: isMobile ? 24 : 30,
                                }}
                              />
                            </div>
                            <div className="showtime-card-profile-link ml-2 md:text-lg">
                              {this.truncateWithEllipses(item.creator_name, 30)}
                            </div>
                          </a>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div
                  style={{ fontSize: 16, fontWeight: 400 }}
                  className="flex items-center justify-center md:justify-start w-full"
                >
                  <div>
                    <a
                      href={getBidLink(item)}
                      title={`Buy on ${getContractName(item)}`}
                      target="_blank"
                      onClick={() => {
                        mixpanel.track("OpenSea link click");
                      }}
                    >
                      <div className="flex mt-2 mb-4 md:mb-0 items-center bg-stpink text-white px-6 py-3 rounded-full border-2 border-stpink hover:text-stpink hover:bg-white transition">
                        <div className="mr-2">
                          Bid on {getContractName(item)}
                        </div>
                        <div>
                          <FontAwesomeIcon
                            style={{
                              height: 16,
                              width: 16,
                            }}
                            icon={faArrowRight}
                          />
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
SpotlightItem.contextType = AppContext;

export default SpotlightItem;
