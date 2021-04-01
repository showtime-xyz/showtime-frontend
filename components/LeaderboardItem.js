import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import ReactPlayer from "react-player";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import mixpanel from "mixpanel-browser";
import Link from "next/link";
import useKeyPress from "../hooks/useKeyPress";
import { getImageUrl, truncateWithEllipses } from "../lib/utilities";
import ModalTokenDetail from "./ModalTokenDetail";
import FollowButton from "./FollowButton";
import AppContext from "../context/app-context";
import { formatAddressShort } from "../lib/utilities";

const LeaderboardItemRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.11);
  @media screen and (max-width: 1230px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProfileSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    justify-content: space-around;
  }
`;

const ProfileBottomSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfileTitle = styled.h4`
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    color: #e45cff;
  }
`;

const Metadata = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 600px) {
    margin-left: -16px;
  }
`;

const MetadataIcon = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  margin-left: 16px;
  margin-right: 8px;
  color: #bdbdbd;
`;

const MetadataText = styled.h6`
  font-size: 13px;
  font-weight: 500;
`;

const ProfileImage = styled.img`
  width: 72px;
  min-width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-right: 20px;
  cursor: pointer;
  box-sizing: border-box;
  margin-left: ${(p) => (p.isMobile ? "12px" : "0px")};
`;

const NFTTiles = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @media screen and (max-width: 1230px) {
    margin-left: -12px;
    margin-top: 12px;
  }
`;

const NFTTile = styled.img`
  margin-left: 12px;
  object-fit: cover;
  cursor: pointer;
  @media screen and (max-width: 1230px) {
    margin-top: 12px;
  }
`;

const NFTVideoTile = styled.div`
  margin-left: 12px;
  cursor: pointer;
  background: black;
  @media screen and (max-width: 1230px) {
    margin-top: 12px;
  }
`;

const GraySeparator = styled.div`
  width: 0.125rem;
  margin-left: 16px;
  height: 30px;
  background: rgba(0, 0, 0, 0.11);
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const FollowButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 600px) {
    display: none;
  }
`

const LeaderboardItem = ({ item, index }) => {
  const context = useContext(AppContext);
  const [squareWidth, setSquareWidth] = useState(0);
  const [followerCount, setFollowerCount] = useState();

  useEffect(() => {
    if (context.windowSize) {
      if (context.windowSize.width >= 1230) {
        setSquareWidth(90);
      } else if (context.windowSize.width >= 820) {
        setSquareWidth((context.gridWidth - 90) / 6);
      } else if (context.windowSize.width > 375) {
        setSquareWidth((context.gridWidth - 66) / 3);
      } else {
        setSquareWidth((context.gridWidth - 58) / 3);
      }
    } else {
      setSquareWidth(90);
    }
  }, [context.windowSize?.width]);

  const topItems =
    context.columns > 2
      ? item?.top_items.slice(0, 7)
      : item?.top_items.slice(0, 6);
  const isMyProfile = context?.myProfile?.profile_id === item?.profile_id;
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null);
  const currentIndex = topItems?.findIndex(
    (i) => i.nft_id === currentlyOpenModal?.nft_id
  );
  const goToNext = () => {
    if (currentIndex < topItems.length - 1) {
      setCurrentlyOpenModal(topItems[currentIndex + 1]);
    }
  };
  const goToPrevious = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentlyOpenModal(topItems[currentIndex - 1]);
    }
  };
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");
  useEffect(() => {
    if (escPress) {
      setCurrentlyOpenModal(null);
    }
    if (rightPress && currentlyOpenModal) {
      mixpanel.track("Next NFT - keyboard");
      goToNext();
    }
    if (leftPress && currentlyOpenModal) {
      mixpanel.track("Prior NFT - keyboard");
      goToPrevious();
    }
  }, [escPress, leftPress, rightPress]);

  const handleLike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes([...context.myLikes, nft_id]);

    const likedItem = topItems.find((i) => i.nft_id === nft_id);
    const myLikeCounts = context.myLikeCounts;
    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]:
        (myLikeCounts && !_.isNil(myLikeCounts[nft_id])
          ? myLikeCounts[nft_id]
          : likedItem.like_count) + 1,
    });

    // Post changes to the API
    await fetch(`/api/like_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Liked item");
  };
  const handleUnlike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(context.myLikes.filter((item) => !(item === nft_id)));

    const likedItem = topItems.find((i) => i.nft_id === nft_id);
    const myLikeCounts = context.myLikeCounts;
    context.setMyLikeCounts({
      ...context.myLikeCounts,
      [nft_id]:
        (myLikeCounts && !_.isNil(myLikeCounts[nft_id])
          ? myLikeCounts[nft_id]
          : likedItem.like_count) - 1,
    });

    // Post changes to the API
    await fetch(`/api/unlike_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Unliked item");
  };

  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={currentlyOpenModal}
            setEditModalOpen={setCurrentlyOpenModal}
            item={currentlyOpenModal}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            columns={context.columns}
            hasNext={!(currentIndex === topItems.length - 1)}
            hasPrevious={!(currentIndex === 0)}
          />
        </>
      ) : null}
      <LeaderboardItemRow>
        <ProfileSection>
          <Link href="/[profile]" as={`/${item?.username || item.address}`}>
            <div className="relative">
              <div
                className="absolute rounded-full bg-white text-center self-center"
                style={
                  context.isMobile
                    ? {
                      border: "1px solid rgba(0, 0, 0, 0.16)",
                      fontSize: 12,
                      fontWeight: 500,
                      paddingTop: 1,
                      height: 22,
                      width: 22,
                      color: "#010101",
                      bottom: 4,
                      right: 19,
                    }
                    : {
                      border: "1px solid rgba(0, 0, 0, 0.16)",
                      fontSize: 13,
                      fontWeight: 500,
                      paddingTop: 1,
                      height: 24,
                      width: 24,
                      color: "#010101",
                      bottom: 0,
                      right: 20,
                    }
                }
              >
                {index + 1}
              </div>
              <ProfileImage
                isMobile={context.isMobile}
                src={getImageUrl(item?.img_url)}
              />
            </div>
          </Link>
          <ProfileSectionContent>
            <Link href="/[profile]" as={`/${item?.username || item.address}`}>
              <ProfileTitle>
                {truncateWithEllipses(item?.name, context.isMobile ? 19 : 30) ||
                  formatAddressShort(item.address) ||
                  "Unnamed"}
              </ProfileTitle>
            </Link>
            <ProfileBottomSection>
              {!isMyProfile && (
                <FollowButtonWrapper>
                  <FollowButton
                    item={item}
                    followerCount={followerCount}
                    setFollowerCount={setFollowerCount} />
                  <GraySeparator />
                </FollowButtonWrapper>
              )}
              <Metadata>
                <MetadataIcon>
                  <FontAwesomeIcon icon={faUser} />
                </MetadataIcon>
                <MetadataText>{followerCount}</MetadataText>
                <MetadataIcon>
                  <FontAwesomeIcon icon={faHeart} />
                </MetadataIcon>
                <MetadataText>{item?.like_count_total}</MetadataText>
              </Metadata>
            </ProfileBottomSection>
          </ProfileSectionContent>
        </ProfileSection>
        <NFTTiles>
          {topItems.map((topItem, index) => (
            <div key={topItem?.nft_id}>
              {topItem?.token_img_thumbnail_url ? (
                <NFTTile
                  onClick={() => setCurrentlyOpenModal(topItem)}
                  src={topItem?.token_img_thumbnail_url}
                  style={{ width: squareWidth, height: squareWidth }}
                />
              ) : (
                <NFTVideoTile
                  onClick={() => setCurrentlyOpenModal(topItem)}
                  width={squareWidth}
                  height={squareWidth}
                >
                  <ReactPlayer
                    url={topItem?.token_animation_url}
                    playing={false}
                    loop
                    muted={true}
                    width={squareWidth}
                    height={squareWidth}
                    playsinline
                  />
                </NFTVideoTile>
              )}
            </div>
          ))}
        </NFTTiles>
      </LeaderboardItemRow>
    </>
  );
};

export default LeaderboardItem;
