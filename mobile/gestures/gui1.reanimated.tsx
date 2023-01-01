import { SafeAreaView, View } from "react-native";
import { DragHandler } from "./dnd";

export function GUI1() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <DragHandler>
        <View className="w-[50px] h-[50px] bg-rose-400">

        </View>
      </DragHandler>
    </SafeAreaView>
  );
}
