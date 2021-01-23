import React from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";
import Link from "next/link";

const TokenHero = ({ item, handleLike, handleUnlike, isDetail, isMobile }) => {
  return (
    <div>
      {isDetail ? (
        <img className="w-full" src={item.image_url} alt="nft" />
      ) : (
        <Link
          href="/t/[...token]"
          as={`/t/${item.asset_contract.address}/${item.token_id}`}
        >
          <a>
            <img
              className="object-cover object-center h-full w-full"
              style={{ maxHeight: 600 }}
              src={item.image_url}
              alt="nft"
            />
          </a>
        </Link>
      )}

      <div className="mt-6 p-1">
        <div className="float-right text-right ">
          <div>
            <ShareButton />
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

          {/*<div className=" text-gray-200 text-right lg:ml-auto md:ml-0 ml-auto leading-none text-md py-3 ">
            {item.last_sale && item.last_sale.payment_token
              ? "Last sale Ξ" +
                parseFloat(item.last_sale.payment_token.eth_price).toFixed(3) +
                " ($" +
                parseInt(item.last_sale.payment_token.usd_price) +
                ")"
              : null}
            </div>*/}
        </div>

        {isDetail ? null : (
          <div className="showtime-hero-title text-2xl md:text-4xl">
            <Link
              href="/t/[...token]"
              as={`/t/${item.asset_contract.address}/${item.token_id}`}
            >
              <a className="showtime-link">{item.name}</a>
            </Link>{" "}
            {item.creator ? (
              <>
                {" by "}
                <Link href="/p/[slug]" as={`/p/${item.creator.address}`}>
                  <a className="showtime-link">
                    {item.creator.user && item.creator.user.username
                      ? item.creator.user.username
                      : "[Unnamed]"}
                  </a>
                </Link>
              </>
            ) : (
              "\u00A0"
            )}
          </div>
        )}

        {/*<p className="leading-relaxed mb-3 text-gray-200">
          Owned by {item.owner.user ? item.owner.user.username : "[Unnamed]"}
          </p>*/}
      </div>
    </div>
  );
};

export default TokenHero;
