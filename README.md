# Showtime App Monorepo!

Universal Showtime React app using Expo and Next.js in a monorepo.

You'll find included:

-   Expo SDK 43 (with Hermes on iOS and Android)
-   Next.js 12
-   React Native for Web
-   TypeScript
-   Babel config that works for Expo and Next.js with Reanimated in a monorepo
-   Reanimated
-   React Native Bottom Sheet
-   Dripsy
-   Tailwind
-   Sentry
-   Expo Application Services
-   Custom Development Client
-   Progressive Web App
-   SWR

## Architecture

### App

> Code shared between iOS, Android and Web

`cd packages/app`

### Design System

> Universal design system

`cd packages/design-system`

### Expo

> React Native

Expo entrypoint: `apps/expo/App.tsx`

`cd apps/expo`

`yarn dev` to start the development client (iOS and Android app with Expo)

### Next.js (React)

> Web

Next.js entrypoint: `apps/next-react/src/pages/_app.tsx`

`cd apps/next-react`

`yarn dev` to start the web app

### Next.js (React Native)

> Web

Next.js entrypoint: `apps/next-react-native/src/pages/_app.tsx`

`cd apps/next-react-native`

`yarn dev` to start the web app

### Storybook React

> Storybook for Web (using React Native for Web)

Storybook config: `apps/storybook-react/.storybook/*`

`cd apps/storybook-react`

`yarn storybook` to start Storybook

### Storybook (React Native)

> Storybook for React Native

// TODO: create Expo app and add Storybook

## Usage

Here is a quick overview of the repo.

### Development Client

You can create a [development client](https://docs.expo.dev/clients/introduction/) in local or in the cloud.

#### Local

Plug your device and build the app with Expo CLI:

```
yarn ios -d
yarn android
```

#### Cloud

Use Expo Application Services to build the app:

```
yarn build:development
```

This is useful if you want to build the iOS app without a Mac, for example.

### Design system

React Native for Web + Tailwind + Dripsy

-   `packages/design-system/*`
-   https://www.figma.com/file/hseAlaaQKC4b7MIZS6TdF9/%F0%9F%93%9A-UI-Library?node-id=1099%3A3333
-   Learn more: https://axeldelafosse.com/blog/universal-design-system

### State Management

SWR

-   `SWRConfig` in `apps/expo/App.tsx` and `apps/next/src/pages/_app.tsx`

### Data Fetching

SWR + axios

-   `axiosAPI` in `packages/app/lib/axios.ts`
-   `useSWR` hooks like `const { data, error } = useSWR([url], url => axios({ url, method: 'GET', unmountSignal }))`
-   `packages/app/hooks/use-user.ts`

### Navigation

React Navigation + Next.js Router

-   `packages/app/navigation/*`
-   Learn more: https://github.com/axeldelafosse/expo-next-monorepo-example/pull/1

### Authentication

Magic + WalletConnect

-   `packages/app/components/login.tsx`

### Analytics

Mixpanel

-   `packages/app/lib/mixpanel.ts`

### Testing

// TODO: cypress + jest + detox?

### Deployment

Vercel + Expo

### CI/CD

GitHub Actions

-   ESLint: `.github/workflows/lint.yml`
-   PR previews: `.github/workflows/preview.yml`
-   Build and Submit: `.github/workflows/build-and-submit.yml`

### Environment Variables

Using `dotenv` for the Expo app. Next.js is automatically picking up the `.env.local` file.

-   `.env.development` + `.env.staging` + `.env.production` in `apps/expo`
-   `.env.local` in `apps/next-react`
-   `.env.local` in `apps/next-react-native`

## Notes

Pro tip: you can add `tw` to `Tailwind CSS: Class Attributes` VS Code extension setting to get IntelliSense working.

### Root

-   Don't add any package here

### App

-   Don't add any package here
-   You can use SVGR to generate the icons component from the `.svg` files: `npx @svgr/cli --icon --replace-attr-values "#000={props.color},#fff={props.color},#FFF={props.color}" --ignore-existing --native --typescript -d . .` and then you can programmatically change the color thanks to `fill={props.color}` for example.

### Expo

-   Add all the React Native and universal packages here

### Next.js

-   Add the web-only packages here

### Quick Style Guide

// TODO: define this as a team. consistency is key

-   Filenames: lowercase and separated by dashes
-   Imports order: import third-party packages first, then our own packages.
    Always import React and React Native first (if imported).
-   `export { Component }` instead of `export default Component`
