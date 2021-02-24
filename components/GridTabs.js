import React from "react";
import styled from "styled-components";

const GridTabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ddd;
  //   overflow-x: scroll;
`;
const GridTabsContainer = styled.div`
  margin: 20px 10px;
`;
const GridTabsTitle = styled.h3`
  padding: 10px 0px;
  font-weight: 600;
`;

const Tab = styled.div`
  width: max-content;
  padding: 15px 0px;
  margin-right: 25px;
  white-space: nowrap;
  cursor: pointer;
  border-bottom: ${(p) =>
    p.isActive ? "3px solid #e45cff" : "3px solid transparent"};
  transition: all 300ms ease;
  color: ${(p) => (p.isActive ? "#e45cff" : "inherit")};
  &:hover {
    opacity: ${(p) => (p.isActive ? null : 0.6)};
  }
`;

const ItemCountSpan = styled.span`
  color: ${(p) => (p.isActive ? null : "#a6a6a6")};
  margin-right: 5px;
`;

function GridTabs({ children, title }) {
  return (
    <GridTabsContainer>
      {title && (
        <GridTabsTitle className="text-2xl md:text-4xl">{title}</GridTabsTitle>
      )}
      <GridTabsWrapper>{children}</GridTabsWrapper>
    </GridTabsContainer>
  );
}

function GridTab({ label, itemCount, isActive, onClickTab }) {
  const cleanItemCount = () => {
    if (itemCount === null || itemCount === undefined) {
      return null;
    }
    if (itemCount === 0) {
      return "0";
    }
    return Number(itemCount) < 150 ? Number(itemCount) : "150+";
  };
  return (
    <Tab
      onClick={onClickTab}
      isActive={isActive}
      className="text-sm md:text-base"
    >
      {cleanItemCount() && (
        <ItemCountSpan isActive={isActive}>{cleanItemCount()}</ItemCountSpan>
      )}
      <span>{label}</span>
    </Tab>
  );
}

export { GridTabs, GridTab };
