import { SafeAreaView, View } from "react-native";
import { DragDetector, DragHandler } from "./gestures/dnd";

export function DragScreen() {
  const r2 = 128;
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <DragHandler>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "royalblue",
          }}
        />
      </DragHandler>
      <DragDetector>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "peru",
          }}
        />
      </DragDetector>
    </SafeAreaView>
  );
}
