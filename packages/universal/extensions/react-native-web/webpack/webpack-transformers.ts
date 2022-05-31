import {
  WebpackConfigTransformer,
  WebpackConfigMutator,
  WebpackConfigTransformContext,
} from "@teambit/webpack";

/**
 * Transformation to apply for both preview and dev server
 * @param config
 * @param _context
 */
function commonTransformation(
  config: WebpackConfigMutator,
  // eslint-disable-next-line unused-imports/no-unused-vars
  _context: WebpackConfigTransformContext
) {
  // Merge config with the webpack.config.js file - adding handlebars support
  // config.merge([webpackConfig]);
  config.addAliases({
    "react-native-web": require.resolve("react-native-web"),
  });
  return config;
}

/**
 * Transformation for the preview only
 * @param config
 * @param context
 * @returns
 */
export const previewConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) => {
  const newConfig = commonTransformation(config, context);
  return newConfig;
};

/**
 * Transformation for the dev server only
 * @param config
 * @param context
 * @returns
 */
export const devServerConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) => {
  const newConfig = commonTransformation(config, context);
  return newConfig;
};
