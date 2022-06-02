// Learn more https://docs.expo.io/guides/customizing-metro
const extraNodeModules = require("node-libs-react-native");
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Monorepo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, "../..");

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.extraNodeModules = extraNodeModules;
config.resolver.sourceExts = ["ts", "tsx", "js", "jsx", "json", "cjs"];
config.resolver.assetExts = ["glb", "gltf", "png", "jpg"];
// config.transformer.minifierPath = "metro-minify-esbuild";

module.exports = config;
