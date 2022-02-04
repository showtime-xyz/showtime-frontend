# Showtime Monorepo

The Showtime UI universal react application powered by Expo, Next.js, Storybook and the Showtime internal design system in a monorepo.

You'll find included:

- [Expo SDK 43](https://docs.expo.dev/) (with Hermes on iOS and Android)
- [Next.js 12](https://nextjs.org/docs/getting-started)
- [React Native for Web](https://reactnative.dev/docs/getting-started)
- [TypeScript](https://www.typescriptlang.org/)
- [Babel config](./babel.config.js) that works for Expo and Next.js with Reanimated in a monorepo
- [Reanimated](https://github.com/software-mansion/react-native-reanimated)
- [React Native Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet)
- [Dripsy](https://www.dripsy.xyz/)
- [Tailwind](https://github.com/jaredh159/tailwind-react-native-classnames) - For react native
- [Sentry](https://docs.sentry.io/)
- Expo Application Services
- Custom Development Client
- Progressive Web App
- [SWR](https://swr.vercel.app/docs/getting-started)
- [Storybook](https://storybook.js.org/docs/react/writing-docs/docs-page)
- [Turbo](https://turborepo.org/docs)

## Architecture

Introduction: [Universal Design System](https://axeldelafosse.com/blog/universal-design-system) by Axel Delafoss

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

`yarn dev` to start Storybook

### Storybook (React Native)

> Storybook for React Native

Storybook config: `apps/storybook-react-native/.storybook/*`

`cd apps/storybook-react-native`

`yarn dev` to start Storybook

## Usage

Here is a quick overview of the repo.

### Commands

The monorepo leverages [Turbo](https://turborepo.org/docs) as it's build system. Their are a lot of advantages to Turbo but two deciding factors were

1. Faster, incremental builds
2. Cloud caching, managed by Vercel

Turbo pipelines are configured within the root directory [package.json](./package.json) and can be ran through yarn scripts.

#### Development

- `yarn dev` runs the dev script for every [application](/apps)
- `yarn dev:expo` runs the dev script for [@showtime/expo](/apps/expo)
- `yarn dev:next` runs the dev script for [@showtime/next-react](/apps/next-react)
- `yarn dev:expo-storybook` runs the dev script for [@showtime/storybook-react-native](/apps/storybook-react-native)
- `yarn dev:next-storybook` runs the dev script for [@showtime/next-storybook](/apps/next-storybook)
- `yarn dev:next-react-native` runs the dev script for [@showtime/next-react-native](/apps/next-react-native)
- `yarn dev:web` runs both dev scripts for [@showtime/next-react](/apps/next-react) and [@showtime/next-storybook](/apps/next-storybook)
- `yarn dev:mobile` runs both dev scripts for [@showtime/expo](/apps/expo) and [@showtime/storybook-react-native](/apps/storybook-react-native)

#### Build

- `yarn build` runs the build script for every [application](/apps)
- `yarn build:expo` runs the build script for [@showtime/expo](/apps/expo)
- `yarn build:next` runs the build script for [@showtime/next-react](/apps/next-react)
- `yarn build:expo-storybook` runs the build script for [@showtime/storybook-react-native](/apps/storybook-react-native)
- `yarn build:next-storybook` runs the build script for [@showtime/next-storybook](/apps/next-storybook)

#### Start

- `yarn start:next` runs the start script for [@showtime/next-react](/apps/next-react)

#### Lint

- `yarn lint` runs the lint script for every [application](/apps)
- `yarn lint:expo` runs the lint script for [@showtime/expo](/apps/expo)
- `yarn lint:next` runs the lint script for [@showtime/next-react](/apps/next-react)
- `yarn lint:expo-storybook` runs the lint script for [@showtime/storybook-react-native](/apps/storybook-react-native)
- `yarn lint:next-storybook` runs the lint script for [@showtime/next-storybook](/apps/next-storybook)
- `yarn lint:next-react-native` runs the lint script for [@showtime/next-react-native](/apps/next-react-native)

#### Formatting

The formatting rules are the ones from `prettier/recommended`. The actual formatting is done via `eslint`.

To get formatting on save in VS Code, install the `eslint` extension and add the following setting:

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```

#### Graph

- `yarn turbo:graph` generates the current [task graph](https://turborepo.org/docs/reference/command-line-reference#--graph) for all [application](/apps)
  `yarn turbo:graph:next` generates the current [task graph](https://turborepo.org/docs/reference/command-line-reference#--graph) for [@showtime/next-react](/apps/next-react)

#### Utility scripts

- `clean` removes all monorepo node_modules and clears the turbo cache
- `clean:turbo` clears the turbo cache
- `clean:node-modules` removes all node_modules
- `clean:native` runs yarn clean and removes android, iOS folders from expo and storybook-react-native apps.

### Enable Remote Cache

Turbo can use a technique known as [Remote Caching](https://turborepo.org/docs/features/remote-caching) to share cache artifacts across machines for an additional speed boost.

#### Local Remote Cache

Link your local turbo project to the remote cache through Vercel

```shell
npx turbo login
```

```shell
npx turbo link
```

To verify, build and delete your local turbo cache with:

1. Run any build locally
1. Clear the turbo cache
   ```shell
   yarn clean:turbo
   ```
1. Then run the same build again. If things are working properly, turbo should not execute tasks locally

## Mobile Development Client

You can create a [development client](https://docs.expo.dev/clients/introduction/) in local or in the cloud.

### Expo dev client

- We're using expo dev client for development builds which allows us to add custom/third party native libraries while preserving the expo like developer experience. Read more about custom dev clients [here](https://docs.expo.dev/development/introduction/)
- You only need to build and install custom dev client in below cases.

1. If you don't have it installed on your phone or simulator
2. If you make any changes on native side or add a new native library

- To install dev client, plug your device and run below commands. This will install the dev client and start the javascript bundler.

```
// For iOS
yarn ios -d

// For android
yarn android
```

- For subsequent developments, we can simple start javascript bundler, no need to build dev client again. Run below command to start the bundler.

```
yarn dev:expo
```

#### Local

> ❗️ The yarn script commands are from within the [@showtime/expo](/apps/expo) application ❗️

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

- `packages/design-system/*`
- [Showtime figma design system](https://www.figma.com/file/hseAlaaQKC4b7MIZS6TdF9/%F0%9F%93%9A-UI-Library?node-id=1099%3A3333)
- Learn more: [universal design system](https://axeldelafosse.com/blog/universal-design-system)

### State Management

SWR

- `SWRConfig` in `apps/expo/App.tsx` and `apps/next/src/pages/_app.tsx`

### Data Fetching

SWR + axios

- `axiosAPI` in `packages/app/lib/axios.ts`
- `useSWR` hooks like `const { data, error } = useSWR([url], url => axios({ url, method: 'GET', unmountSignal }))`
- `packages/app/hooks/use-user.ts`

### Navigation

React Navigation + Next.js Router

- `packages/app/navigation/*`
- Learn more: https://github.com/axeldelafosse/expo-next-monorepo-example/pull/1

### Authentication

Magic + WalletConnect

- `packages/app/components/login.tsx`

### Analytics

Mixpanel

- `packages/app/lib/mixpanel.ts`

### Testing

// TODO: cypress + jest + detox?

### Deployment

Vercel + Expo

### CI/CD

GitHub Actions

- ESLint: [`.github/workflows/lint.yml`](github/workflows/lint.ym)
- Expo PR Previews [`.github/workflows/expo-preview.yml`](.github/workflows/expo-preview.yml)
- Expo Storybook PR Preview [`.github/workflows/expo-storybook-preview.yml`](.github/workflows/expo-storybook-preview.yml)
- Expo Staging [`.github/workflows/expo-preview.yml`](.github/workflows/expo-preview.yml)
- Expo Production [`.github/workflows/expo-preview.yml`](.github/workflows/expo-preview.yml)
- Chromatic Push [`.github/workflows/chromatic.yml`](.github/workflows/chromatic.yml)

### Environment Variables

Using `dotenv` for the Expo app. Next.js is automatically picking up the `.env.local` file.

- `.env.development` + `.env.staging` + `.env.production` in `apps/expo`
- `.env.local` in `apps/next-react`
- `.env.local` in `apps/next-react-native`

## Notes

Pro tip: you can add `tw` to `Tailwind CSS: Class Attributes` VS Code extension setting to get IntelliSense working.

Pro tip: Ignore a list of commits within `git-blame` by default on version `>2.23`

```
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

### Root

- Don't add any package here

### App

- Don't add any package here
- You can use SVGR to generate the icons component from the `.svg` files: `npx @svgr/cli --icon --replace-attr-values "#000={props.color},#fff={props.color},#FFF={props.color}" --ignore-existing --native --typescript -d . .` and then you can programmatically change the color thanks to `fill={props.color}` for example.

### Expo

- Add all the React Native and universal packages here

### Next.js

- Add the web-only packages here

### Quick Style Guide

// TODO: define this as a team. consistency is key

- Filenames: lowercase and separated by dashes
- Imports order: import third-party packages first, then our own packages.
  Always import React and React Native first (if imported).
- `export { Component }` instead of `export default Component`
