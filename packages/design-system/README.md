# Universal

Introduction: [How to build a great universal design system](https://axeldelafosse.com/blog/universal-design-system) by Axel Delafosse

## Bit

You need to install [Bit](https://bit.dev) to compile the design system.

- `npx @teambit/bvm install`
- `bit import`
- `bit compile showtime.universal/extensions/react-native-web && bit link`
- `bit compile && bit link`

While you are developing, you can use the `bit watch` command to watch for changes.

Then if you want to publish a new version you can run:

- `bit tag --force-deploy`
- `bit export`

Then you can install the new version of the packages in `apps/expo/package.json`:

- `yarn up '@showtime-xyz/universal.*'`
  or
- `yarn upgrade:design-system` if you are working in the Showtime monorepo.

You can run `bit status` at all times to check the status of the components.

## Use Universal UI in your own app

You can get started pretty easily if you follow the same monorepo structure as the Showtime monorepo or [Solito example monorepo](https://github.com/nandorojo/solito/tree/master/example-monorepos/with-tailwind).

`cd apps/expo`

`yarn add @showtime-xyz/universal.view @showtime-xyz/universal.text`

In `next.config.js`, please use `transpilePackages` to transpile the design system:

```js
const nextConfig = {
  experimental: {
    transpilePackages: [
      "@showtime-xyz/universal.tailwind",
      "@showtime-xyz/universal.view",
      "@showtime-xyz/universal.text",
    ],
  },
};
```

> Don't forget to add the Universal packages to this list. Keep this in mind when you install new packages.

Then create or update the `tailwind.config.js` file in both `apps/expo` and `apps/next`.

In `apps/expo`, make sure to use the following:

```js
// ...
content: [
  "./App.tsx",
  "../../packages/**/*.{js,ts,jsx,tsx}",
  "../../node_modules/@showtime-xyz/**/*.{js,ts,jsx,tsx}",
],
// ...
```

And in `apps/next`, make sure to use the following:

```js
// ...
content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "../../packages/**/*.{js,ts,jsx,tsx}",
],
important: "html",
// ...
```

You can now use Universal in your app:

```tsx:app/hello-world.tsx
import { View } from "@showtime-xyz/universal.view"
import { Text } from "@showtime-xyz/universal.text"

export function HelloWorld() {
  return (
    <View tw="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text tw="text-lg text-black dark:text-white md:dark:text-purple">
        Hello, World!
      </Text>
    </View>
  )
}
```

Enjoy!

## Storybook

You can check out [Storybook](https://universal.showtime.xyz).

You can also run the Storybook web app and the Storybook native app locally.

## How to contribute?

Send a DM to [@axeldelafosse](https://twitter.com/axeldelafosse) on Twitter.
We'll add you as a contributor on
[bit.cloud/showtime/universal](https://bit.cloud/showtime/universal)
and [npmjs.com/org/showtime-xyz](https://npmjs.com/org/showtime-xyz).
