# Showtime App Monorepo

Universal Showtime React app using Expo and Next.js in a monorepo.

You'll find included:

-   Expo SDK 43 (with Hermes on iOS and Android)
-   Next.js 11.1 (with Webpack 5)
-   React Native for Web
-   TypeScript
-   Babel config that works for Expo and Next.js with Reanimated in a monorepo
-   Reanimated
-   React Native Bottom Sheet
-   Dripsy

And ready-to-use (small configuration required):

-   Expo Application Services
-   Custom Development Client
-   Sentry
-   Progressive Web App

## Architecture

### App

> Code shared between iOS, Android and Web

`cd packages/app`

### Expo

> Native

Expo entrypoint: `packages/expo/App.tsx`

`cd packages/expo`

`yarn start:expo` to start iOS and Android app with Expo

### Next.js

> Web

Next.js entrypoint: `packages/next/src/pages/_app.tsx`

`cd packages/next`

`yarn dev` to start web app

## Notes

### Root

-   Don't add any package here

### App

-   Don't add any package here

### Expo

-   Add all the React Native and universal packages here

### Next.js

-   Add the web-only packages here
