export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MAGIC_PUB_KEY: string;
      NEXT_PUBLIC_WEBSITE_DOMAIN: string;
      NEXT_PUBLIC_STRIPE_KEY: string;
      NEXT_PUBLIC_AMPLITUDE_API_KEY: string;
      GROWTHBOOK_FEATURES_ENDPOINT: string;
      NEXT_PUBLIC_ALCHEMY_API_KEY: string;
      E2E: string;
    }
  }
  interface Window {
    hcaptcha?: string;
  }
}
