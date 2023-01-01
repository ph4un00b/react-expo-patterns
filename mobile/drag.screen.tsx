import { SafeAreaView, View } from "react-native";
import { DragDetector, DragReanimated } from "./gestures/dnd";

export function DragScreen() {
  const r2 = 128;
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <DragReanimated>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "royalblue",
          }}
        />
      </DragReanimated>
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
