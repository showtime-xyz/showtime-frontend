import React, { useContext } from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";
import Link from "next/link";
import AppContext from "../context/app-context";
import ReactPlayer from "react-player";

const TokenHeroV2 = ({
  item,
  handleLike,
  handleUnlike,
  isDetail,
  isMobile,
}) => {
  const context = useContext(AppContext);
  const videoWidth = context.windowSize
    ? context.windowSize < 768
      ? context.windowSize * (10 / 12)
      : (context.windowSize * (10 / 12)) / 2 - 16
    : 640;

  const getImageUrl = () => {
    var img_url = item.token_img_url
      ? item.token_img_url
      : item.contract_address === "0xc2c747e0f7004f9e8817db2ca4997657a7746928"
      ? "https://lh3.googleusercontent.com/L7Q_7aQGYfn8PYOrZwwA4400_EEScTOX9f3ut67oHy1Tjk0SSt85z_ekBjwtfXBQxT8epJHcbEbb-8njMZiGDMzgqjZYHVQwle5sQA"
      : null;

    if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
      img_url = img_url.split("=")[0] + "=s375";
    }
    return img_url;
  };

  const getBackgroundColor = () => {
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
    <div>
      {isDetail ? (
        item.token_has_video ? (
          <ReactPlayer
            url={item.token_animation_url}
            playing
            loop
            controls
            muted
            height={videoWidth}
            width={videoWidth}
          />
        ) : (
          <img
            className="w-full"
            style={{ backgroundColor: getBackgroundColor() }}
            src={getImageUrl()}
            alt={item.token_name}
          />
        )
      ) : (
        <Link
          href="/t/[...token]"
          as={`/t/${item.contract_address}/${item.token_id}`}
        >
          <a>
            <img
              className="object-cover object-center h-full w-full"
              style={{ maxHeight: 600 }}
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
      )}

      <div className="mt-4 p-1 mr-1">
        <div className="float-right text-right ">
          <div className="flex flex-row">
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
              as={`/t/${item.contract_address}/${item.token_id}`}
            >
              <a className="showtime-link">{item.token_name}</a>
            </Link>{" "}
            {item.creator_address ? (
              <>
                <span style={{ fontWeight: 400 }}>{" by "}</span>
                <Link href="/p/[slug]" as={`/p/${item.creator_address}`}>
                  <a className="showtime-link">{item.creator_name}</a>
                </Link>
              </>
            ) : (
              "\u00A0"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenHeroV2;
