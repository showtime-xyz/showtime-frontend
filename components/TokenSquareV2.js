import React, { useState } from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";
import Link from "next/link";
import _ from "lodash";

function truncateWithEllipses(text, max) {
  return text.substr(0, max - 1) + (text.length > max ? "..." : "");
}

const TokenSquareV2 = ({ item, handleLike, handleUnlike, isMobile }) => {
  const [moreShown, setMoreShown] = useState(false);
  const max_description_length = 102;

  const [isHovering, setIsHovering] = useState(false);

  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, " ");
  }

  return (
    <div
      style={_.merge(
        {
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "rgb(219,219,219)",
        },
        isHovering
          ? {
              boxShadow: "1px 1px 10px 6px #e9e9e9",
            }
          : null
      )}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => {
        setIsHovering(false);
      }}
    >
      <Link
        href="/t/[...token]"
        as={`/t/${item.contract_address}/${item.token_id}`}
      >
        <a>
          <img
            className="w-full object-cover object-center mb-1"
            src={
              item.token_img_url
                ? item.token_img_url
                : item.contract_address ===
                  "0xc2c747e0f7004f9e8817db2ca4997657a7746928"
                ? "https://lh3.googleusercontent.com/L7Q_7aQGYfn8PYOrZwwA4400_EEScTOX9f3ut67oHy1Tjk0SSt85z_ekBjwtfXBQxT8epJHcbEbb-8njMZiGDMzgqjZYHVQwle5sQA=s500"
                : null
            }
            alt={item.token_name}
          />
        </a>
      </Link>

      <div className="p-2">
        <div>
          <div className="flex flex-row items-center">
            <div className="flex-shrink">
              {item.creator_address ? (
                <Link href="/p/[slug]" as={`/p/${item.creator_address}`}>
                  <a className="flex flex-row items-center p-1 ">
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
                    <div className="showtime-card-profile-link ml-1">
                      {truncateWithEllipses(item.creator_name, 22)}
                    </div>
                  </a>
                </Link>
              ) : null}
            </div>

            <div className="flex-grow text-right">
              <LikeButton
                isLiked={item.liked}
                likeCount={item.like_count}
                handleLike={handleLike}
                handleLikeArgs={{
                  tid: item.tid,
                }}
                handleUnlike={handleUnlike}
                handleUnlikeArgs={{
                  tid: item.tid,
                }}
                showTooltip={isMobile === false}
              />
            </div>
            <div className="flex-shrink">
              <ShareButton
                url={
                  window.location.protocol +
                  "//" +
                  window.location.hostname +
                  (window.location.port ? ":" + window.location.port : "") +
                  `/t/${item.contract_address}/${item.token_id}`
                }
                type={"item"}
              />
            </div>
          </div>
          <div className="mt-2 px-1 py-2">
            <Link
              href="/t/[...token]"
              as={`/t/${item.contract_address}/${item.token_id}`}
            >
              <a className="showtime-card-title">{item.token_name}</a>
            </Link>
            {item.token_has_video ? (
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
              {moreShown ? (
                <div>{removeTags(item.token_description)}</div>
              ) : (
                <div>
                  {item.token_description ? (
                    item.token_description.length > max_description_length ? (
                      <>
                        {truncateWithEllipses(
                          removeTags(item.token_description),
                          max_description_length
                        )}{" "}
                        <a
                          onClick={() => {
                            setMoreShown(true);
                          }}
                          style={{ color: "#111", cursor: "pointer" }}
                        >
                          {" "}
                          more
                        </a>
                      </>
                    ) : (
                      <div>{removeTags(item.token_description)}</div>
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
        {item.multiple_owners ? (
          <span style={{ fontSize: 14, fontWeight: 400 }}>multiple owners</span>
        ) : item.owner_id ? (
          <Link href="/p/[slug]" as={`/p/${item.owner_address}`}>
            <a className="flex flex-row items-center inline-flex">
              <div>
                <img
                  alt={item.owner_name}
                  src={
                    item.owner_img_url
                      ? item.owner_img_url
                      : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                  }
                  className="rounded-full mr-1"
                  style={{ height: 24, width: 24 }}
                />
              </div>
              <div className="showtime-card-profile-link">
                {item.owner_name}
              </div>
            </a>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default TokenSquareV2;
