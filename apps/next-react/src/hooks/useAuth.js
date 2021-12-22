import axios from "@/lib/axios";
import useSWR from "swr";

const useAuth = () => {
  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    "/api/auth/user",
    (url) => axios.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    user,
    error,
    loading: !user && !error,
    isAuthenticated: Boolean(user && !error),
    mutate,
  };
};

export default useAuth;
