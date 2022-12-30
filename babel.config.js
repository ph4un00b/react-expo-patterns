module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    /** @see https://docs.expo.dev/versions/latest/sdk/reanimated/ */
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      // Reanimated plugin has to be listed last.
      /**
       *  @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation#babel-plugin
       * 
       * "Reanimated 2 failed to create a worklet"
       * clean cache
       * $ npx expo start -c
       * */
      "react-native-reanimated/plugin",
    ],
  };
};
