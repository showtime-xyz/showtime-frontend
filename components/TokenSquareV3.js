import React from "react";
import Link from "next/link";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faVideo } from "@fortawesome/free-solid-svg-icons";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";

class TokenSquareV3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spans: 0,
      moreShown: false,
      imageLoaded: false,
    };
    this.handleMoreShown = this.handleMoreShown.bind(this);
    this.divRef = React.createRef();
    this.imageRef = React.createRef();
    this.setSpans = this.setSpans.bind(this);
  }

  componentDidMount() {
    this.setSpans();
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

  handleMoreShown = () => {
    this.setState({ moreShown: true }, this.setSpans);
  };

  getImageUrl = () => {
    var img_url = this.props.item.token_img_url
      ? this.props.item.token_img_url
      : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      img_url = img_url.split("=")[0] + "=s375";
      console.log(img_url);
    }
    return img_url;
  };

  max_description_length = 102;

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
    return (
      <div
        className={`row-span-${this.state.spans} ${
          this.props.columns === 1 ? "pb-0" : "p-2"
        }`}
      >
        <div
          style={_.merge(
            {
              backgroundColor: "white",
            },
            this.props.columns === 1
              ? {
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                }
              : {
                  width: 375,
                  borderWidth: 1,
                }
          )}
          ref={this.divRef}
          className={
            this.props.columns === 1
              ? "mx-auto showtime-card"
              : "mx-auto showtime-card sm:rounded-md"
          }
        >
          <div className="p-4 flex flex-row">
            <div className="flex-shrink">
              {this.props.item.creator_address ? (
                <Link
                  href="/p/[slug]"
                  as={`/p/${this.props.item.creator_address}`}
                >
                  <a className="flex flex-row items-center ">
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
                    <div className="showtime-card-profile-link ml-2">
                      {this.truncateWithEllipses(
                        this.props.item.creator_name,
                        30
                      )}
                    </div>
                  </a>
                </Link>
              ) : null}
            </div>
            <div>&nbsp;</div>
          </div>
          <Link
            href="/t/[...token]"
            as={`/t/${this.props.item.contract_address}/${this.props.item.token_id}`}
          >
            <a>
              {!this.state.imageLoaded ? (
                <div className="w-full text-center">
                  <div
                    className="lds-grid"
                    style={{ marginTop: 148, marginBottom: 148 }}
                  >
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : null}
              <div
                style={{
                  backgroundColor: this.getBackgroundColor(this.props.item),
                }}
              >
                <img
                  className="w-full object-cover object-center "
                  ref={this.imageRef}
                  src={this.getImageUrl()}
                  alt={this.props.item.token_name}
                  onLoad={() => this.setState({ imageLoaded: true })}
                  style={!this.state.imageLoaded ? { display: "none" } : {}}
                />
              </div>
            </a>
          </Link>

          <div className="p-4">
            <div>
              <div className="flex flex-row items-center">
                <div className="flex-shrink">
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

                <div className="flex-grow text-right"></div>
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
              <div className="mt-4 ">
                <Link
                  href="/t/[...token]"
                  as={`/t/${this.props.item.contract_address}/${this.props.item.token_id}`}
                >
                  <a
                    className="showtime-card-title"
                    style={{
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    {this.props.item.token_name}
                  </a>
                </Link>
                {this.props.item.token_has_video ? (
                  <FontAwesomeIcon
                    className="ml-1 inline"
                    style={{ height: 12, marginBottom: 2 }}
                    icon={faVideo}
                  />
                ) : null}
                {this.props.item.token_description ? (
                  <div
                    style={{
                      fontWeight: 400,
                      color: "#888",
                      fontSize: 12,
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                    }}
                    className="pt-1  pb-2"
                  >
                    {this.state.moreShown ? (
                      <div>
                        {this.removeTags(this.props.item.token_description)}
                      </div>
                    ) : (
                      <div>
                        {this.props.item.token_description.length >
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
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div
            className="mx-4 py-4 flex items-center"
            style={{
              backgroundColor: "#ffffff",
              borderTopWidth: 1,
              borderColor: "rgb(219,219,219)",
            }}
          >
            <div
              className="flex-shrink pr-2"
              style={{
                fontWeight: 400,
                fontSize: 12,
                color: "#888",
              }}
            >
              Owned by{" "}
              {this.props.item.multiple_owners ? "multiple owners" : null}
            </div>
            <div>
              {this.props.item.multiple_owners ? null : this.props.item
                  .owner_id ? (
                <Link
                  href="/p/[slug]"
                  as={`/p/${this.props.item.owner_address}`}
                >
                  <a className="flex flex-row items-center">
                    <div>
                      <img
                        alt={this.props.item.owner_name}
                        src={
                          this.props.item.owner_img_url
                            ? this.props.item.owner_img_url
                            : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                        }
                        className="rounded-full mr-2"
                        style={{ height: 24, width: 24 }}
                      />
                    </div>
                    <div className="showtime-card-profile-link">
                      {this.truncateWithEllipses(
                        this.props.item.owner_name,
                        22
                      )}
                    </div>
                  </a>
                </Link>
              ) : null}
            </div>
            <div className="flex-grow"></div>
            <div style={{ fontSize: 12, fontWeight: 400 }}>
              <a
                href={`https://opensea.io/assets/${this.props.item.contract_address}/${this.props.item.token_id}?ref=0x0c7f6405bf7299a9ebdccfd6841feac6c91e5541`}
                target="_blank"
                className="flex flex-row items-center showtime-card-bid"
              >
                <div className="mr-1">Bid</div>
                <div className="mb-1 flex">
                  <FontAwesomeIcon
                    style={{ height: 12 }}
                    icon={faExternalLinkAlt}
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TokenSquareV3;
