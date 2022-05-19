import { BabelAspect, BabelMain } from "@teambit/babel";
import { MainRuntime } from "@teambit/cli";
import { EnvsAspect, EnvsMain } from "@teambit/envs";
import { ReactNativeAspect, ReactNativeMain } from "@teambit/react-native";

import { ReactNativeWebAspect } from "./react-native-web.aspect";
import {
  previewConfigTransformer,
  devServerConfigTransformer,
} from "./webpack/webpack-transformers";

const babelConfig = require("./babel/babel.config");
const tsConfig = require("./typescript/tsconfig");

export class ReactNativeWebMain {
  static slots = [];

  static dependencies = [ReactNativeAspect, EnvsAspect, BabelAspect];

  static runtime = MainRuntime;

  static async provider([reactNative, envs, babel]: [
    ReactNativeMain,
    EnvsMain,
    BabelMain
  ]) {
    const babelCompiler = babel.createCompiler({
      babelTransformOptions: babelConfig,
    });

    const templatesReactNativeEnv = envs.compose(reactNative.reactNativeEnv, [
      // // @ts-ignore
      // reactNative.overrideCompiler(babelCompiler),

      // // @ts-ignore
      // reactNative.overrideCompilerTasks([babelCompiler.createTask()]),

      // reactNative.overrideTsConfig(tsConfig),

      // reactNative.overrideJestConfig(require.resolve('./jest/jest.config')),

      reactNative.useWebpack({
        previewConfig: [previewConfigTransformer],
        devServerConfig: [devServerConfigTransformer],
      }),

      /**
       * override the ESLint default config here then check your files for lint errors
       * @example
       * bit lint
       * bit lint --fix
       */
      reactNative.useEslint({
        transformers: [
          (config) => {
            config.setRule("no-console", ["error"]);
            return config;
          },
        ],
      }),

      /**
       * override the Prettier default config here the check your formatting
       * @example
       * bit format --check
       * bit format
       */
      reactNative.usePrettier({
        transformers: [
          (config) => {
            config.setKey("tabWidth", 2);
            return config;
          },
        ],
      }),

      /**
       * override dependencies here
       * @example
       * Uncomment types to include version 17.0.3 of the types package
       */
      reactNative.overrideDependencies({
        devDependencies: {
          // '@types/react': '17.0.3'
        },
      }),
    ]);

    envs.registerEnv(templatesReactNativeEnv);

    return new ReactNativeWebMain();
  }
}

ReactNativeWebAspect.addRuntime(ReactNativeWebMain);
