import { useKV } from "app/hooks/use-kv";

export type Banner = {
  type: "profile" | "drop" | "link";
  username: string;
  slug: string;
  link: string;
  image: string;
};

export const useBanners = () => {
  const { data, ...rest } = useKV<Banner[]>("banners");
  return {
    data: data ?? [],
    ...rest,
  };
};
