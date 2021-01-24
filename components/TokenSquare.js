import React from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";
import Link from "next/link";

const TokenSquare = ({ item, handleLike, handleUnlike, isMobile }) => {
  return (
    <div>
      <Link
        href="/t/[...token]"
        as={`/t/${item.asset_contract.address}/${item.token_id}`}
      >
        <a>
          <img
            className="w-full object-cover object-center"
            src={item.image_url}
            alt="nft"
          />
        </a>
      </Link>
      <div className="mt-6 p-1">
        <div>
          <div className="float-right showtime-square-created">
            {/*{item.last_sale && item.last_sale.payment_token
              ? " Ξ 123 ETH"
            : null}*/}
          </div>
          <h2 className="showtime-square-created text-lg md:text-xl">
            {item.creator ? (
              <Link href="/p/[slug]" as={`/p/${item.creator.address}`}>
                <a className="showtime-link">
                  {item.creator.user && item.creator.user.username
                    ? item.creator.user.username
                    : "Unnamed"}
                </a>
              </Link>
            ) : (
              "\u00A0"
            )}
          </h2>
        </div>
        <div>
          <div className="float-right text-right pt-8 flex flex-row">
            <ShareButton
              url={
                window.location.protocol +
                "//" +
                window.location.hostname +
                (window.location.port ? ":" + window.location.port : "") +
                `/t/${item.asset_contract.address}/${item.token_id}`
              }
            />
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
          <h1 className="showtime-square-title text-2xl md:text-3xl my-1">
            <Link
              href="/t/[...token]"
              as={`/t/${item.asset_contract.address}/${item.token_id}`}
            >
              <a className="showtime-link">{item.name}</a>
            </Link>
          </h1>

          <p className="showtime-square-owned text-base md:text-lg">
            Owned by{" "}
            {item.owner ? (
              item.owner.user && item.owner.user.username === "NullAddress" ? (
                " multiple owners"
              ) : (
                <Link href="/p/[slug]" as={`/p/${item.owner.address}`}>
                  <a className="showtime-link" style={{ fontWeight: 600 }}>
                    {item.owner.user ? item.owner.user.username : "Unnamed"}
                  </a>
                </Link>
              )
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenSquare;
