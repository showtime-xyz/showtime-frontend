export const siteKey =
  process.env.E2E || __DEV__ || process.env.NEXT_PUBLIC_STAGE === "development"
    ? "10000000-ffff-ffff-ffff-000000000001"
    : "e75de5d7-0f0c-4061-8647-65362888979e";
