import React from "react";
import Link from "next/link";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPlay,
  faEllipsisH,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
//import { faSun } from "@fortawesome/free-regular-svg-icons";
//import { faEdit } from "@fortawesome/free-regular-svg-icons";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import ReactPlayer from "react-player";
import mixpanel from "mixpanel-browser";
import AppContext from "@/context/app-context";
import { getBidLink, getContractName, removeTags } from "@/lib/utilities";
import ModalTokenDetail from "./ModalTokenDetail";
import CappedWidth from "./CappedWidth";

class SpotlightItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spans: 1,
      moreShown: false,
      imageLoaded: false,
      muted: true,
      refreshing: false,
      currentlyOpenModal: false,
      currentlyPlayingVideo: true,
      videoReady: false,
      thisItem: props.item,
    };
    this.divRef = React.createRef();
  }

  truncateWithEllipses(text, max) {
    if (text) {
      return text.substr(0, max - 1) + (text.length > max ? "..." : "");
    }
  }

  handleRefreshNFTMetadata = async () => {
    mixpanel.track("Clicked refresh metadata");
    this.setState({ refreshing: true });

    const result = await fetch(
      `/api/refreshmetadata/${this.state.thisItem.nft_id}`,
      {
        method: "post",
      }
    );
    const { data } = await result.json();
    if (data) {
      // Replace all fields
      this.setState({ thisItem: data });
    }

    this.setState({ refreshing: false });
  };

  handleRemoveFromSpotlight = async () => {};

  getImageUrl = () => {
    var img_url = this.state.thisItem.token_img_url
      ? this.state.thisItem.token_img_url
      : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      this.state.thisItem.token_aspect_ratio &&
      Number(this.state.thisItem.token_aspect_ratio) > this.aspect_ratio_cutoff
        ? (img_url = img_url.split("=")[0] + "=w2104")
        : (img_url = img_url.split("=")[0] + "=w1004");
    }
    return img_url;
  };

  max_description_length = 170;
  aspect_ratio_cutoff = 1.6;

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
    const { isMobile } = this.context;
    const { isMyProfile, listId, pageProfile } = this.props;
    const { thisItem: item } = this.state;
    return (
      <>
        {typeof document !== "undefined" ? (
          <>
            <ModalTokenDetail
              isOpen={this.state.currentlyOpenModal}
              setEditModalOpen={(_) =>
                this.setState({ currentlyOpenModal: false })
              }
              item={this.state.thisItem}
            />
          </>
        ) : null}

        <CappedWidth>
          <div className="relative">
            <div
              ref={this.divRef}
              className="md:w-3/4 mx-auto flex items-center flex-col md:flex-row md:p-0"
            >
              <div className="flex-1 text-right">
                <div>
                  {item.token_has_video ? (
                    <>
                      <div
                        className={`w-full h-full ${
                          this.state.videoReady ? "hidden" : null
                        }`}
                      >
                        <div className="w-full text-center flex items-center mt-24 justify-center">
                          <div className="loading-card-spinner" />
                        </div>
                      </div>
                      <div
                        className={`w-full shadow-lg h-full relative ${
                          this.state.videoReady ? "" : "invisible"
                        }`}
                      >
                        <ReactPlayer
                          url={item.token_animation_url}
                          playing={this.state.currentlyPlayingVideo}
                          loop
                          controls
                          muted={this.state.muted}
                          className={`w-full h-full`}
                          width={
                            isMobile
                              ? "100%"
                              : this.divRef?.current?.clientWidth
                              ? this.divRef?.current?.clientWidth / 2
                              : null
                          }
                          height={"1"}
                          //width={columns === 1 ? window.innerWidth : "100%"}
                          // height={
                          //   columns === 1
                          //     ? item.imageRef
                          //       ? item.imageRef.current
                          //         ? item.imageRef.current.height
                          //         : null
                          //       : null
                          //     : "100%"
                          // }
                          playsinline
                          onReady={() => this.setState({ videoReady: true })}
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
                    </>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <div
                        onClick={() => {
                          mixpanel.track("Open NFT modal");
                          this.setState({
                            currentlyOpenModal: true,
                            muted: true,
                            currentlyPlayingVideo: false,
                          });
                        }}
                        className="cursor-pointer text-right flex flex-row"
                      >
                        {!this.state.imageLoaded ? (
                          <div
                            className="w-full text-center flex items-center justify-center"
                            style={{
                              height: this.divRef?.current?.clientWidth
                                ? this.divRef?.current?.clientWidth
                                : 375,
                            }}
                          >
                            <div className="loading-card-spinner" />
                          </div>
                        ) : null}

                        <img
                          className={`hover:opacity-90  transition-all  shadow-lg


                        `}
                          ref={item.imageRef}
                          src={this.getImageUrl()}
                          alt={item.token_name}
                          onLoad={() => this.setState({ imageLoaded: true })}
                          style={{
                            ...(!this.state.imageLoaded
                              ? { display: "none" }
                              : isMobile
                              ? {
                                  backgroundColor: this.getBackgroundColor(
                                    item
                                  ),
                                  width: this.divRef?.current?.clientWidth,
                                  height:
                                    item.token_aspect_ratio &&
                                    this.divRef?.current?.clientWidth
                                      ? this.divRef?.current?.clientWidth /
                                        item.token_aspect_ratio
                                      : null,
                                }
                              : {
                                  backgroundColor: this.getBackgroundColor(
                                    item
                                  ),
                                  maxHeight: 500,
                                }),
                          }}
                        />
                      </div>
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
                </div>
              </div>
              <div className="flex-1 text-left mt-3 md:mt-4 md:mt-0 md:pl-12 w-full p-6 pb-0 md:p-0">
                {/*START DROPDOWN MENU */}
                {isMyProfile ? (
                  <div className="relative sm:static">
                    <div className="absolute top-0 right-0 sm:right-6">
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
                        className="card-menu-button text-right flex items-center justify-center text-gray-600"
                      >
                        <FontAwesomeIcon
                          style={{
                            height: 20,
                            width: 20,
                          }}
                          icon={faEllipsisH}
                        />
                      </div>
                      {this.props.openCardMenu == item.nft_id + "_" + listId ? (
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
                              className="py-2 px-3 hover:text-stpink hover:bg-gray-50  transition-all rounded-lg cursor-pointer whitespace-nowrap"
                              onClick={this.props.removeSpotlightItem}
                            >
                              Remove Spotlight
                            </div>
                            <div
                              className="py-2 px-3 hover:text-stpink hover:bg-gray-50  transition-all rounded-lg cursor-pointer whitespace-nowrap"
                              onClick={this.handleRefreshNFTMetadata}
                            >
                              Refresh Metadata
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {/* END DROPDOWN MENU */}

                <div>
                  <div className="flex flex-row">
                    <div
                      onClick={() => {
                        mixpanel.track("Open NFT modal");
                        this.setState({
                          currentlyOpenModal: true,
                          muted: true,
                          currentlyPlayingVideo: false,
                        });
                      }}
                      className="mb-2 sm:mb-4 text-2xl sm:text-3xl hover:text-stpink"
                      style={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",

                        cursor: "pointer",
                      }}
                    >
                      {item.token_name}
                    </div>
                    <div className="flex-grow"></div>
                  </div>

                  {item.token_description ? (
                    <div
                      style={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                      }}
                      className="pb-4 text-sm sm:text-base text-gray-500"
                    >
                      <div>
                        {item.token_description?.length >
                          this.max_description_length &&
                        !this.state.moreShown ? (
                          <>
                            {this.truncateWithEllipses(
                              removeTags(item.token_description),
                              this.max_description_length
                            )}{" "}
                            <a
                              onClick={() => {
                                this.setState({ moreShown: true });
                              }}
                              className="text-gray-900 hover:text-gray-500 cursor-pointer"
                            >
                              {" "}
                              more
                            </a>
                          </>
                        ) : (
                          <div style={{ whiteSpace: "pre-line" }}>
                            {removeTags(item.token_description)}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center">
                    <div className="mr-4 text-base ">
                      <LikeButton item={item} />
                    </div>
                    <div className="mr-4 text-base ">
                      <CommentButton
                        item={item}
                        handleComment={() => {
                          mixpanel.track("Open NFT modal via comment button");
                          this.setState({
                            currentlyOpenModal: true,
                            muted: true,
                            currentlyPlayingVideo: false,
                          });
                        }}
                      />
                    </div>
                    <div className="mr-4 text-base ">
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
                  <div className="flex-grow ">
                    <div className="flex flex-row mt-8">
                      <a
                        href={getBidLink(item)}
                        title={`Buy on ${getContractName(item)}`}
                        target="_blank"
                        onClick={() => {
                          mixpanel.track("OpenSea link click");
                        }}
                      >
                        <div className="text-base px-5 py-2 shadow-md transition-all rounded-full text-white bg-stpink hover:bg-white hover:text-stpink border-2 border-stpink">
                          {`Bid on ${getContractName(item)}`}
                        </div>
                      </a>

                      <div className="flex-grow"></div>
                    </div>
                  </div>
                  <div
                    className={`flex ${
                      //
                      item.multiple_owners &&
                      this.props.pageProfile.profile_id !== item.creator_id
                        ? "flex-col lg:flex-row  pb-6"
                        : "flex-row"
                    } pt-4 mt-8 w-full`}
                  >
                    {item.contract_is_creator ? (
                      <div className="flex-col flex-1">
                        <div className="flex-shrink mb-1 pr-2 text-xs text-gray-500">
                          Created by
                        </div>
                        <div className="flex-shrink">
                          <Link
                            href="/c/[collection]"
                            as={`/c/${item.collection_slug}`}
                          >
                            <a className="flex flex-row items-center">
                              <div style={{ width: 30 }}>
                                <img
                                  alt={item.collection_name}
                                  src={
                                    item.collection_img_url
                                      ? item.collection_img_url
                                      : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                                  }
                                  className="rounded-full"
                                  style={{
                                    height: 30,
                                    width: 30,
                                  }}
                                />
                              </div>
                              <div className="mx-2 hover:text-stpink">
                                {this.truncateWithEllipses(
                                  item.collection_name + " Collection",
                                  25
                                )}{" "}
                              </div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    ) : item.creator_id ? (
                      <div className="flex-col flex-1 mb-6">
                        <div className="flex-shrink pr-2 mb-1 text-xs text-gray-500">
                          {item.owner_id == item.creator_id
                            ? "Created & Owned By"
                            : "Created by"}
                        </div>
                        <div className="flex-shrink">
                          <Link
                            href="/[profile]"
                            as={`/${
                              item?.creator_username || item.creator_address
                            }`}
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
                                  className="rounded-full"
                                  style={{
                                    height: 30,
                                    width: 30,
                                  }}
                                />
                              </div>
                              <div className="ml-2 hover:text-stpink">
                                {this.truncateWithEllipses(
                                  item.creator_name,
                                  25
                                )}
                              </div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    ) : null}
                    {(item.owner_id &&
                      (item.owner_id != item.creator_id ||
                        item.contract_is_creator)) ||
                    item.owner_count > 0 ? (
                      <div className="flex-1">
                        <div className="flex-shrink pr-2 mb-1 text-xs text-gray-500">
                          Owned by
                        </div>
                        <div className="">
                          {item.multiple_owners ? (
                            this.props.pageProfile.profile_id !==
                            item.creator_id ? (
                              <div className="flex flex-row items-center">
                                <Link
                                  href="/[profile]"
                                  as={`/${pageProfile.slug_address}`}
                                >
                                  <a className="flex flex-row items-center pr-2 ">
                                    <div>
                                      <img
                                        alt={
                                          pageProfile.name
                                            ? pageProfile.name
                                            : pageProfile.username
                                            ? pageProfile.username
                                            : pageProfile
                                                .wallet_addresses_excluding_email
                                                .length > 0
                                            ? pageProfile
                                                .wallet_addresses_excluding_email[0]
                                            : "Unknown"
                                        }
                                        src={
                                          pageProfile.img_url
                                            ? pageProfile.img_url
                                            : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                                        }
                                        className="rounded-full mr-2"
                                        style={{
                                          height: 30,
                                          width: 30,
                                        }}
                                      />
                                    </div>
                                    <div className="hover:text-stpink">
                                      {pageProfile.name
                                        ? pageProfile.name
                                        : pageProfile.username
                                        ? pageProfile.username
                                        : wallet_addresses_excluding_email.length >
                                          0
                                        ? wallet_addresses_excluding_email[0]
                                        : "Unknown"}
                                    </div>
                                  </a>
                                </Link>

                                <div
                                  className="text-gray-400 text-sm mr-2 -ml-1"
                                  style={{ marginTop: 2 }}
                                >
                                  & {item.owner_count - 1} other
                                  {item.owner_count - 1 > 1 ? "s" : null}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">
                                Multiple owners
                              </span>
                            )
                          ) : item.owner_id ? (
                            <Link
                              href="/[profile]"
                              as={`/${
                                item?.owner_username || item.owner_address
                              }`}
                            >
                              <a className="flex flex-row items-center">
                                <div>
                                  <img
                                    alt={item.owner_name}
                                    src={
                                      item.owner_img_url
                                        ? item.owner_img_url
                                        : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                                    }
                                    className="rounded-full mr-2 "
                                    style={{
                                      height: 30,
                                      width: 30,
                                    }}
                                  />
                                </div>
                                <div className="hover:text-stpink">
                                  {this.truncateWithEllipses(
                                    item.owner_name,
                                    25
                                  )}
                                </div>
                              </a>
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CappedWidth>
      </>
    );
  }
}
SpotlightItem.contextType = AppContext;

export default SpotlightItem;
