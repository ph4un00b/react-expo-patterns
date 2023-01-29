import { registerRootComponent } from "expo";

import App from "./App";

/**
 * @abstract gesture-handler
 * @see https://docs.swmansion.com/react-native-gesture-handler/docs/installation#web
 */
import { enableExperimentalWebImplementation } from "react-native-gesture-handler";
enableExperimentalWebImplementation(true);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
