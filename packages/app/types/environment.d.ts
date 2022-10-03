export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MAGIC_PUB_KEY: string;
      NEXT_PUBLIC_WEBSITE_DOMAIN: string;
    }
  }
}
