import { Blur, Canvas, Circle, Group } from "@shopify/react-native-skia";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Colors, Header } from "react-native/Libraries/NewAppScreen";

const App = () => {
  const size = 256;
  const r = size * 0.33;
  return (
    <Canvas style={{ flex: 1 }}>
      <Group blendMode="multiply">
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={size - r} cy={r} r={r} color="magenta" />
        <Circle
          cx={size/2}
          cy={size - r}
          r={r}
          color="yellow"
        />
      </Group>
    </Canvas>
  );
}
export default App;
