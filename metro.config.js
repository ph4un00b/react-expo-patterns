// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);

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