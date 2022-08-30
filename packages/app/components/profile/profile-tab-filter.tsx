import { useCallback, useContext } from "react";

import { Select } from "design-system/select";

import { FilterContext } from "./fillter-context";

const sortFields = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Likes", value: "likes" },
  { label: "Comments", value: "comments" },
  { label: "Custom", value: "custom" },
];

export const ProfileListFilter = () => {
  const { filter, dispatch } = useContext(FilterContext);

  const onSortChange = useCallback(
    (value: number | string) => {
      dispatch({ type: "sort_change", payload: value });
    },
    [dispatch]
  );

  return (
    <Select
      value={filter.sortType}
      onChange={onSortChange}
      options={sortFields}
      size="small"
      placeholder="Sort"
    />
  );
};
