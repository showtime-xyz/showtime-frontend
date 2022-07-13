# Universal

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

## Docs

We don't have docs yet, but you can check out [Storybook](https://universal.showtime.xyz).

## How to contribute?

Send a DM to [@axeldelafosse](https://twitter.com/axeldelafosse) on Twitter.
We'll add you as a contributor on
[bit.cloud/showtime/universal](https://bit.cloud/showtime/universal)
and [npmjs.com/org/showtime-xyz](https://npmjs.com/org/showtime-xyz).
