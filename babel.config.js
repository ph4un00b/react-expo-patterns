module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    /** @see https://docs.expo.dev/versions/latest/sdk/reanimated/ */
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
