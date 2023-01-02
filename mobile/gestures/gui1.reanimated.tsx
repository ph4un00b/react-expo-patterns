import { LayoutRectangle, SafeAreaView, View } from "react-native";
import { DragReanimated } from "./dnd";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MyReadInput } from "../components/MyInput";
import { MyButton } from "../components/MyButton";
import { atom, useAtom } from "jotai";
import { useState } from "react";

const COUNT = atom(0);
const $count = atom(
  (r) => r(COUNT),
  (_, w) => w(COUNT, (v) => v + 1)
);

// const CONTAINER = atom<LayoutRectangle>(null!);

export function GUI_1() {
  const [count, inc] = useAtom($count);
  const [layoutProps, setLayout] = useState<LayoutRectangle>(null!);
  return (
    <SafeAreaView
      className="flex flex-1 justify-center items-center"
      onLayout={({ nativeEvent: { layout } }) => setLayout(layout)}
    >
      {layoutProps && (
        <DragReanimated {...layoutProps} decay={true}>
          <View className="flex w-full bg-rose-400">
            <MyReadInput
              onChangeText={() => {}}
              leftIcon={
                <MaterialCommunityIcons
                  name="content-duplicate"
                  size={42}
                  color="black"
                />
              }
              name="title"
              label="counter"
              type="text"
              placeholder="counter"
              value={count.toString()}
            />
            <MyButton onPress={inc}>count</MyButton>
          </View>
        </DragReanimated>
      )}
    </SafeAreaView>
  );
}
