import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import mixpanel from "mixpanel-browser";
import AppContext from "../context/app-context";

const Button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  border-radius: 41px;
  padding: 8px;
  &:hover {
    opacity: 0.7;
  }
  @media screen and (max-width: 400px) {
    width: 100%;
    margin-top: 10px;
  }
`;

const CrossIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 14px;
  height: 14px;
`;

const RemoveText = styled.h6`
  margin-left: 10px;
  font-size: 13px;
  font-weight: 400;
`;

const RemoveRecommendationButton = ({ item, removeRecommendation }) => {
  const handleRemove = async () => {
    removeRecommendation(item);
  };
  const context = useContext(AppContext);

  const myFollows = context?.myFollows || [];
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    var it_is_followed = false;
    _.forEach(myFollows, (follow) => {
      if (follow?.profile_id === item?.profile_id) {
        it_is_followed = true;
      }
    });
    setIsFollowed(it_is_followed);
  }, [myFollows]);

  return (
    !isFollowed && (
      <div className="ml-0 md:ml-1">
        <Button onClick={handleRemove}>
          <CrossIcon>
            {context.isMobile ? (
              <RemoveText>Remove</RemoveText>
            ) : (
              <FontAwesomeIcon
                icon={faTimes}
                style={{ height: 16, width: 16 }}
              />
            )}
          </CrossIcon>
        </Button>
      </div>
    )
  );
};

export default RemoveRecommendationButton;
