import useSWR from "swr";

function fetcher(route) {
  /* our token cookie gets sent with this request */
  return fetch(route)
    .then((r) => r.ok && r.json())
    .then((user) => user || null);
}

export default function useMyLikes(user, myLikesLoaded) {
  const { data, error, mutate } = useSWR(
    user && !myLikesLoaded ? "/api/mylikes" : null,
    fetcher
  );

  const loading = data === undefined;

  return {
    data,
    loading,
    error,
  };
}
