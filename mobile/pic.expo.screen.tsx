import { Asset, useAssets } from "expo-asset";
import { View, Image as ExpoImage } from "react-native";
import { DragDetector } from "./gestures/dnd";

export default function AssetScreen() {
    /** @see https://docs.expo.dev/versions/latest/sdk/asset/ */
  const [assets, error] = useAssets([require("./assets/necro.webp")]);
  if (!assets) return null;
  return (
    <View style={{ flex: 1 }}>
      <DragDetector>
        <ExpoImage style={{ width: "auto", height: "100%" }} source={assets[0]} />
      </DragDetector>
    </View>
  );
}
