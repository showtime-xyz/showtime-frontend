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
  padding: 5px;
  font-weight: 600;
`;

const Tab = styled.div`
  width: max-content;
  padding: 20px 5px;
  margin-right: 15px;
  white-space: nowrap;
  cursor: pointer;
  border-bottom: ${(p) =>
    p.isActive ? "3px solid #e45cff" : "3px solid transparent"};
  transition: all 200ms ease;
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
  return (
    <Tab onClick={onClickTab} isActive={isActive}>
      {itemCount && (
        <ItemCountSpan isActive={isActive}>{itemCount}</ItemCountSpan>
      )}
      <span>{label}</span>
    </Tab>
  );
}

export { GridTabs, GridTab };
