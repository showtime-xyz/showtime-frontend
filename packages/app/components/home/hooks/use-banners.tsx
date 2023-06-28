import { useState, useEffect } from "react";

import { createClient } from "@vercel/kv";

const kv = createClient({
  url: "https://patient-gar-40486.kv.vercel-storage.com",
  token:
    "Ap4mASQgZmRhZDFlNTYtOTViMi00ZDQzLTg3N2ItOWEzYWQwY2Y5NGJmXFJxyhlB-QtE3C_-WS3HwhtKmaDdlHR65OjUS1jFTok=",
});

export type Banner = {
  type: "profile" | "drop" | "link";
  username: string;
  slug: string;
  link: string;
  image: string;
};
export const useBanners = () => {
  const [banners, setbanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getBanners() {
      setIsLoading(true);
      await kv.get<Banner[]>("banners").then((data) => {
        if (data) {
          setbanners(data);
        }
        setIsLoading(false);
      });
    }
    getBanners();
  }, []);

  return {
    data: banners,
    isLoading,
  };
};
