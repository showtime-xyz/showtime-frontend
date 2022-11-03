type SWRCacheType = {
  set: (key: string, value: any) => void;
  get: (key: string) => any;
};

const persistCacheKeys = ["/v2/trending/nfts", "/v2/myinfo"];

export const setupSWRCache = ({ set, get }: SWRCacheType) => {
  const appCache = get("app-cache");
  const swrCacheMap = new Map<string, string>(
    appCache ? JSON.parse(appCache) : []
  );

  const persistCache = () => {
    const prevCache = get("app-cache");
    const prevMap = new Map(prevCache ? JSON.parse(prevCache) : []);

    persistCacheKeys.forEach((key) => {
      for (const [k, val] of swrCacheMap.entries()) {
        if (k.includes(key)) {
          prevMap.set(k, val);
        }
      }
    });
    const newAppCache = JSON.stringify(Array.from(prevMap.entries()));
    set("app-cache", newAppCache);
  };

  return {
    persistCache,
    swrCacheMap,
  };
};
