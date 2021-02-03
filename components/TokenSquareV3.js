import React, { useState } from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";
import Link from "next/link";
import _ from "lodash";

class TokenSquareV3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spans: 0,
      moreShown: false,
      isHovering: false,
      imageLoaded: false,
    };
    this.handleHover = this.handleHover.bind(this);
    this.handleUnhover = this.handleUnhover.bind(this);
    this.handleMoreShown = this.handleMoreShown.bind(this);
    this.divRef = React.createRef();
    this.imageRef = React.createRef();
    this.setSpans = this.setSpans.bind(this);
  }

  componentDidMount() {
    //this.setState({ elementHeight: this.divRef.clientHeight });
    //this.setSpans;
    this.imageRef.current.addEventListener("load", this.setSpans);
  }

  componentWillUnmount() {
    this.imageRef.current.removeEventListener("load", this.setSpans);
  }

  setSpans = () => {
    const height = this.divRef.current.clientHeight;
    const spans = Math.min(Math.ceil(height / 30 + 1), 50);
    this.setState({ spans });
  };

  removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, " ");
  }

  truncateWithEllipses(text, max) {
    return text.substr(0, max - 1) + (text.length > max ? "..." : "");
  }

  handleHover = () => {
    this.setState({ isHovering: true });
  };

  handleUnhover = () => {
    this.setState({ isHovering: false });
  };

  handleMoreShown = () => {
    this.setState({ moreShown: true }, this.setSpans);
  };

  getImageUrl = () => {
    var img_url = this.props.item.token_img_url
      ? this.props.item.token_img_url
      : this.props.item.contract_address ===
        "0xc2c747e0f7004f9e8817db2ca4997657a7746928"
      ? "https://lh3.googleusercontent.com/L7Q_7aQGYfn8PYOrZwwA4400_EEScTOX9f3ut67oHy1Tjk0SSt85z_ekBjwtfXBQxT8epJHcbEbb-8njMZiGDMzgqjZYHVQwle5sQA"
      : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      img_url = img_url.split("=")[0] + "=s375";
      console.log(img_url);
    }
    return img_url;
  };

  max_description_length = 102;

  render() {
    return (
      <div
        className={`row-span-${this.state.spans} ${
          this.props.columns === 1 ? "pb-4" : "p-2"
        }`}
      >
        <div
          style={_.merge(
            {
              backgroundColor: "white",
            },
            this.state.isHovering
              ? {
                  boxShadow: "1px 1px 10px 6px #e9e9e9",
                }
              : null,
            this.props.columns === 1
              ? {
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: "rgb(219,219,219)",
                }
              : { width: 375, borderWidth: 1, borderColor: "rgb(219,219,219)" }
          )}
          onMouseOver={this.handleHover}
          onMouseOut={this.handleUnhover}
          ref={this.divRef}
          className="mx-auto"
        >
          <Link
            href="/t/[...token]"
            as={`/t/${this.props.item.contract_address}/${this.props.item.token_id}`}
          >
            <a>
              {!this.state.imageLoaded ? (
                <img
                  style={{
                    height: 96,
                    width: 96,
                    marginLeft: 139, // 77,
                    marginRight: 139,
                    marginTop: 139,
                    marginBottom: 139,
                  }}
                  onLoad={() => this.setSpans()}
                  src="/icons/96x96.gif"
                />
              ) : null}

              <img
                className="w-full object-cover object-center mb-1"
                ref={this.imageRef}
                src={this.getImageUrl()}
                alt={this.props.item.token_name}
                onLoad={() => this.setState({ imageLoaded: true })}
                style={!this.state.imageLoaded ? { display: "none" } : {}}
              />
            </a>
          </Link>

          <div className="p-2">
            <div>
              <div className="flex flex-row items-center">
                <div className="flex-shrink">
                  {this.props.item.creator_address ? (
                    <Link
                      href="/p/[slug]"
                      as={`/p/${this.props.item.creator_address}`}
                    >
                      <a className="flex flex-row items-center p-1 ">
                        <div>
                          <img
                            alt={this.props.item.creator_name}
                            src={
                              this.props.item.creator_img_url
                                ? this.props.item.creator_img_url
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                            }
                            className="rounded-full "
                            style={{ height: 24, width: 24 }}
                          />
                        </div>
                        <div className="showtime-card-profile-link ml-1">
                          {this.truncateWithEllipses(
                            this.props.item.creator_name,
                            22
                          )}
                        </div>
                      </a>
                    </Link>
                  ) : null}
                </div>

                <div className="flex-grow text-right">
                  <LikeButton
                    isLiked={this.props.item.liked}
                    likeCount={this.props.item.like_count}
                    handleLike={this.props.handleLike}
                    handleLikeArgs={{
                      tid: this.props.item.tid,
                    }}
                    handleUnlike={this.props.handleUnlike}
                    handleUnlikeArgs={{
                      tid: this.props.item.tid,
                    }}
                    showTooltip={this.props.isMobile === false}
                  />
                </div>
                <div className="flex-shrink">
                  <ShareButton
                    url={
                      window.location.protocol +
                      "//" +
                      window.location.hostname +
                      (window.location.port ? ":" + window.location.port : "") +
                      `/t/${this.props.item.contract_address}/${this.props.item.token_id}`
                    }
                    type={"item"}
                  />
                </div>
              </div>
              <div className="mt-2 px-1 py-2">
                <Link
                  href="/t/[...token]"
                  as={`/t/${this.props.item.contract_address}/${this.props.item.token_id}`}
                >
                  <a className="showtime-card-title">
                    {this.props.item.token_name}
                  </a>
                </Link>
                {this.props.item.token_has_video ? (
                  <img
                    style={{ display: "inline-block" }}
                    src="/icons/video-solid.svg"
                    width="16"
                    height="16"
                    className=" pl-1"
                  />
                ) : null}
                <div
                  style={{
                    fontWeight: 400,
                    color: "#888",
                    fontSize: 12,
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                  }}
                >
                  {this.state.moreShown ? (
                    <div>
                      {this.removeTags(this.props.item.token_description)}
                    </div>
                  ) : (
                    <div>
                      {this.props.item.token_description ? (
                        this.props.item.token_description.length >
                        this.max_description_length ? (
                          <>
                            {this.truncateWithEllipses(
                              this.removeTags(
                                this.props.item.token_description
                              ),
                              this.max_description_length
                            )}{" "}
                            <a
                              onClick={this.handleMoreShown}
                              style={{ color: "#111", cursor: "pointer" }}
                            >
                              {" "}
                              more
                            </a>
                          </>
                        ) : (
                          <div>
                            {this.removeTags(this.props.item.token_description)}
                          </div>
                        )
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="px-3 py-2 text-right flex items-center"
            style={{
              backgroundColor: "#ffffff",
              borderTopWidth: 1,
              borderColor: "rgb(219,219,219)",
            }}
          >
            <span
              className="flex-grow pr-1"
              style={{
                fontWeight: 400,
                fontSize: 12,
                color: "#666",
              }}
            >
              Owned by
            </span>
            {this.props.item.multiple_owners ? (
              <span style={{ fontSize: 14, fontWeight: 400 }}>
                multiple owners
              </span>
            ) : this.props.item.owner_id ? (
              <Link href="/p/[slug]" as={`/p/${this.props.item.owner_address}`}>
                <a className="flex flex-row items-center inline-flex">
                  <div>
                    <img
                      alt={this.props.item.owner_name}
                      src={
                        this.props.item.owner_img_url
                          ? this.props.item.owner_img_url
                          : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                      }
                      className="rounded-full mr-1"
                      style={{ height: 24, width: 24 }}
                    />
                  </div>
                  <div className="showtime-card-profile-link">
                    {this.props.item.owner_name}
                  </div>
                </a>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default TokenSquareV3;
