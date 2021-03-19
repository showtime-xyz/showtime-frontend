import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import AppContext from "../context/app-context";
import backend from "../lib/backend";
import { getImageUrl } from "../lib/utilities";
import useKeyPress from "../hooks/useKeyPress";
import useOnClickOutside from "../hooks/useOnClickOutside";
import LoadingSpinner from "./LoadingSpinner";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 1.5rem;
  padding-right: 1.5rem;
  width: 100%;
  max-width: 700px;
  @media (max-width: 1229px) {
    display: none;
  }
`;

const MobileSearchWrapper = styled.div`
  display: none;
  position: relative;
  justify-content: flex-start;
  margin-left: 16px;
  padding-right: 8px;
  width: 100%;
  @media (max-width: 1229px) {
    display: flex;
  }
  @media (max-width: 767px) {
    justify-content: flex-end;
    padding-right: 32px;
  }
  @media (max-width: 420px) {
    margin-left: 4px;
    padding-right: 16px;
  }
`;

const OverlaySearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  height: 80px;
  background: #fff;
  padding: 16px;
  width: 100%;
  left: 0;
  top: 0;
`;

const SearchToggleButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  color: #000;
  border: 2px solid #000;
  border-radius: 50%;
  padding: 16px;
  cursor: pointer;
  &:hover {
    color: #e45cff;
    border: 2px solid #e45cff;
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`;

const OverlaySearchInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  display: flex;
  border: 1px solid #ddd;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 16px;
  padding-left: 40px;
  box-sizing: border-box;
  border-radius: 999px;
  width: 100%;
  &:focus {
    padding-left: 39px;
    margin-top: -1px;
    border: 2px solid #000;
  }
`;

const SearchIcon = styled.div`
  display: flex;
  position: absolute;
  left: 16px;
  top: 50%;
  transform: TranslateY(-8px);
  margin-bottom: 1px;
  width: 14px;
  height: 14px;
  margin-right: 12px;
  color: #000;
  margin-top: ${(p) => (p.isFocused ? -1 : 0)}px;
`;

const CloseButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  margin-right: 16px;
  color: #000;
  border: 2px solid #000;
  border-radius: 50%;
  padding: 16px;
  cursor: pointer;
  margin-top: ${(p) => (p.isFocused ? -1 : 0)}px;
  &:hover {
    color: #e45cff;
    border: 2px solid #e45cff;
  }
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  max-height: 80vh;
  overflow-y: scroll;
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 10px 20px rgb(0 0 0 / 5%);
`;

const OverlaySearchResults = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  max-height: 80vh;
  overflow-y: scroll;
  position: absolute;
  top: 60px;
  left: 68px;
  right: 16px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 10px 20px rgb(0 0 0 / 5%);
`;

const SearchResult = styled.div`
  display: flex;
  width: 100%;
  padding: 16px;
  cursor: pointer;
  background: ${(p) => (p.isActive ? "#E6E8EB" : "#fff")};
  border-top-left-radius: ${(p) => (p.roundedTop ? "8px" : "0px")};
  border-top-right-radius: ${(p) => (p.roundedTop ? "8px" : "0px")};
  border-bottom-left-radius: ${(p) => (p.roundedBottom ? "8px" : "0px")};
  border-bottom-right-radius: ${(p) => (p.roundedBottom ? "8px" : "0px")};
  &:hover {
    background: #e6e8eb;
  }
`;

const SearchProfile = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 50%;
`;

const SearchResultText = styled.div`
  font-size: 16px;
  //width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const SearchResultUsernameText = styled.div`
  font-size: 13px;
  color: #aaa;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-left: 4px;
`;

const EmptySearchText = styled.div`
  display: flex;
  width: 100%;
  padding: 16px;
`;

const LoadingSpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px;
`;

const handleSearchQuery = async (
  searchText,
  setSearchResults,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const result = await backend.get(`/v1/search?q=${searchText}`, {
      method: "get",
    });
    setSearchResults(result?.data?.data);
  } catch (error) {
    console.error(error);
  }
  setIsLoading(false);
};

const handleDebouncedSearchQuery = AwesomeDebouncePromise(
  handleSearchQuery,
  500
);

const SearchBar = () => {
  const context = useContext(AppContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileSearchOverlayOpen, toggleMobileSearchOverlay] = useState(
    false
  );
  const [searchText, setSearchText] = useState("");
  const [activeSelectedSearchResult, setActiveSelectedSearchResult] = useState(
    null
  );

  const dropdownRef = useRef(null);
  const searchInputContainerRef = useRef(null);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  useEffect(() => {
    if (upPress) {
      mixpanel.track("Up Search - keyboard");
      if (activeSelectedSearchResult === null) {
        setActiveSelectedSearchResult(
          searchResults.length - 1 >= 0 ? searchResults.length - 1 : null
        );
      } else {
        setActiveSelectedSearchResult(
          activeSelectedSearchResult - 1 >= 0
            ? activeSelectedSearchResult - 1
            : null
        );
      }
    }
    if (downPress) {
      mixpanel.track("Down search - keyboard");
      if (activeSelectedSearchResult === null) {
        setActiveSelectedSearchResult(searchResults.length - 1 >= 0 ? 0 : null);
      } else {
        setActiveSelectedSearchResult(
          activeSelectedSearchResult + 1 < searchResults.length
            ? activeSelectedSearchResult + 1
            : null
        );
      }
    }
    if (
      enterPress &&
      activeSelectedSearchResult !== null &&
      searchResults.length > 0
    ) {
      setShowSearchResults(false);
      setSearchText("");
      toggleMobileSearchOverlay(false);
      const searchResult = searchResults[activeSelectedSearchResult];
      router.push(`/${searchResult?.username || searchResult.address0}`);
    }
  }, [downPress, upPress, enterPress]);

  useOnClickOutside(
    dropdownRef,
    () => setShowSearchResults(false),
    searchInputContainerRef
  );
  return (
    <>
      {/* Start desktop-only menu */}
      <SearchContainer>
        <SearchInputContainer ref={searchInputContainerRef}>
          <SearchIcon>
            <FontAwesomeIcon icon={faSearch} />
          </SearchIcon>
          <SearchInput
            placeholder={
              context.gridWidth < 400
                ? "Search by name"
                : "Search by name or wallet address"
            }
            value={searchText}
            onFocus={() => {
              setShowSearchResults(true);
              setSearchInputFocused(true);
            }}
            onBlur={() => {
              setSearchInputFocused(false);
            }}
            onChange={(e) => {
              setShowSearchResults(true);
              setSearchText(e.currentTarget.value);
              setActiveSelectedSearchResult(null);
              handleDebouncedSearchQuery(
                e.currentTarget.value,
                setSearchResults,
                setIsLoading
              );
            }}
          />
        </SearchInputContainer>
        {searchText.length > 0 && showSearchResults && (
          <SearchResults ref={dropdownRef}>
            {isLoading ? (
              <LoadingSpinnerWrapper>
                <LoadingSpinner dimensions={24} />
              </LoadingSpinnerWrapper>
            ) : (
              <>
                {searchResults.map((searchResult, index) => (
                  <Link
                    href="/[profile]"
                    as={`/${searchResult?.username || searchResult.address0}`}
                    key={searchResult.profile_id}
                  >
                    <SearchResult
                      roundedTop={index === 0}
                      roundedBottom={index === searchResults.length - 1}
                      isActive={activeSelectedSearchResult === index}
                      key={index}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchText("");
                      }}
                      className="items-center"
                    >
                      <SearchProfile src={getImageUrl(searchResult?.img_url)} />
                      <SearchResultText>
                        {searchResult?.name || searchResult.address0}
                      </SearchResultText>
                      {searchResult?.username ? (
                        <SearchResultUsernameText>
                          @{searchResult?.username}
                        </SearchResultUsernameText>
                      ) : null}
                    </SearchResult>
                  </Link>
                ))}
                {searchResults.length === 0 && (
                  <EmptySearchText>{"No matching people"}</EmptySearchText>
                )}
              </>
            )}
          </SearchResults>
        )}
      </SearchContainer>
      {/* Start mobile-only menu */}
      <MobileSearchWrapper>
        <SearchToggleButton onClick={() => toggleMobileSearchOverlay(true)}>
          <FontAwesomeIcon icon={faSearch} />
        </SearchToggleButton>
      </MobileSearchWrapper>
      {/* Start overlay menu */}
      {isMobileSearchOverlayOpen && (
        <OverlaySearchContainer>
          <OverlaySearchInputContainer>
            <CloseButton
              isFocused={searchInputFocused}
              onClick={() => toggleMobileSearchOverlay(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
            <SearchInputContainer ref={searchInputContainerRef}>
              <SearchIcon isFocused={searchInputFocused}>
                <FontAwesomeIcon icon={faSearch} />
              </SearchIcon>
              <SearchInput
                placeholder={
                  context.gridWidth < 400
                    ? "Search by name"
                    : "Search by name or wallet address"
                }
                value={searchText}
                onFocus={() => {
                  setShowSearchResults(true);
                  setSearchInputFocused(true);
                }}
                onBlur={() => {
                  setSearchInputFocused(false);
                }}
                onChange={(e) => {
                  setShowSearchResults(true);
                  setSearchText(e.currentTarget.value);
                  setActiveSelectedSearchResult(null);
                  handleDebouncedSearchQuery(
                    e.currentTarget.value,
                    setSearchResults,
                    setIsLoading
                  );
                }}
              />
            </SearchInputContainer>
          </OverlaySearchInputContainer>
          {searchText.length > 0 && showSearchResults && (
            <OverlaySearchResults ref={dropdownRef}>
              {isLoading ? (
                <LoadingSpinnerWrapper>
                  <LoadingSpinner dimensions={24} />
                </LoadingSpinnerWrapper>
              ) : (
                <>
                  {searchResults.map((searchResult, index) => (
                    <Link
                      href="/[profile]"
                      as={`/${searchResult?.username || searchResult.address0}`}
                      key={searchResult.profile_id}
                    >
                      <SearchResult
                        roundedTop={index === 0}
                        roundedBottom={index === searchResults.length - 1}
                        key={index}
                        isActive={activeSelectedSearchResult === index}
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchText("");
                          toggleMobileSearchOverlay(false);
                        }}
                        className="items-center"
                      >
                        <SearchProfile
                          src={getImageUrl(searchResult?.img_url)}
                        />
                        <SearchResultText className="flex-0">
                          {searchResult?.name || searchResult.address0}
                        </SearchResultText>
                        {searchResult?.username ? (
                          <SearchResultUsernameText className="flex-1">
                            @{searchResult?.username}
                          </SearchResultUsernameText>
                        ) : null}
                      </SearchResult>
                    </Link>
                  ))}
                  {searchResults.length === 0 && (
                    <EmptySearchText>{"No matching people"}</EmptySearchText>
                  )}
                </>
              )}
            </OverlaySearchResults>
          )}
        </OverlaySearchContainer>
      )}
    </>
  );
};

export default SearchBar;
