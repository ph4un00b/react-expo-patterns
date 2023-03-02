/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
// Create the default Metro config
const config = getDefaultConfig(projectRoot);

config.resolver.extraNodeModules = {
	"jotai-signal/jsx-runtime": path.resolve(projectRoot, "node_modules/jotai-signal/dist/jsx-runtime/index.modern.js"),
	"jotai-signal": path.resolve(projectRoot, "node_modules/jotai-signal/dist/index.modern.js"),
};

module.exports = config;


/**
 * maybee when you need to use gltf
 * in order to support some extensions!
 * @see https://docs.pmnd.rs/react-three-fiber/getting-started/installation
 */
// module.exports = {

//     resolver: {
//         sourceExts: ["js", "jsx", "json", "ts", "tsx", "cjs"],
//         assetExts: ["glb", "gltf", "png", "jpg"],
//       },
// }
