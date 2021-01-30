import React, { useState } from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";
import Link from "next/link";

function truncateWithEllipses(text, max) {
  return text.substr(0, max - 1) + (text.length > max ? "..." : "");
}

const TokenSquare = ({ item, handleLike, handleUnlike, isMobile }) => {
  const [moreShown, setMoreShown] = useState(false);
  const max_description_length = 105;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "rgb(219,219,219)",
      }}
    >
      <Link
        href="/t/[...token]"
        as={`/t/${item.asset_contract.address}/${item.token_id}`}
      >
        <a>
          <img
            className="w-full object-cover object-center mb-1"
            src={item.image_url}
            alt="nft"
            style={{ boxShadow: "1px 2px 5px #bbb" }}
          />
        </a>
      </Link>
      <div className="p-2">
        <div>
          <div className="flex items-center">
            <div className="flex-grow p-1">
              {item.creator ? (
                <Link href="/p/[slug]" as={`/p/${item.creator.address}`}>
                  <a className="flex flex-row items-center">
                    <div>
                      <img
                        alt={
                          item.creator.user && item.creator.user.username
                            ? item.creator.user.username
                            : "Unnamed"
                        }
                        src={
                          "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                        }
                        className="rounded-full mr-1"
                        style={{ height: 24, width: 24 }}
                      />
                    </div>
                    <div className="showtime-card-profile-link">
                      {item.creator.user && item.creator.user.username
                        ? truncateWithEllipses(item.creator.user.username, 22)
                        : "Unnamed"}
                    </div>
                  </a>
                </Link>
              ) : null}
            </div>

            <div>
              <LikeButton
                isLiked={item.liked}
                likeCount={item.showtime.like_count}
                handleLike={handleLike}
                handleLikeArgs={{
                  contract: item.asset_contract.address,
                  token_id: item.token_id,
                  creator_address: item.creator ? item.creator.address : null,
                  creator_name:
                    item.creator && item.creator.user
                      ? item.creator.user.username
                      : null,
                  creator_img_url: item.creator
                    ? item.creator.profile_img_url
                    : null,
                }}
                handleUnlike={handleUnlike}
                handleUnlikeArgs={{
                  contract: item.asset_contract.address,
                  token_id: item.token_id,
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
                  `/t/${item.asset_contract.address}/${item.token_id}`
                }
                type={"item"}
              />
            </div>
          </div>
          <div className="mt-2 px-1 py-2">
            <Link
              href="/t/[...token]"
              as={`/t/${item.asset_contract.address}/${item.token_id}`}
            >
              <a className="showtime-card-title">{item.name}</a>
            </Link>
            {item.animation_url && item.animation_url.includes(".mp4") ? (
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
              }}
            >
              {moreShown ? (
                <div>{item.description}</div>
              ) : (
                <div>
                  {item.description ? (
                    item.description.length > max_description_length ? (
                      <>
                        {truncateWithEllipses(
                          item.description,
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
                      <div>{item.description}</div>
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
            paddingTop: 3,
          }}
        >
          Owned by
        </span>
        {item.owner ? (
          item.owner.user && item.owner.user.username === "NullAddress" ? (
            <span style={{ fontSize: 14, fontWeight: 400 }}>
              multiple owners
            </span>
          ) : (
            <Link href="/p/[slug]" as={`/p/${item.owner.address}`}>
              <a className="flex flex-row items-center inline-flex">
                <div>
                  <img
                    alt={item.owner.user ? item.owner.user.username : "Unnamed"}
                    src={
                      "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                    }
                    className="rounded-full mr-1"
                    style={{ height: 24, width: 24 }}
                  />
                </div>
                <div className="showtime-card-profile-link">
                  {item.owner.user
                    ? item.owner.user.username
                      ? item.owner.user.username
                      : "Unnamed"
                    : "Unnamed"}
                </div>
              </a>
            </Link>
          )
        ) : null}
      </div>
    </div>
  );
};

export default TokenSquare;
