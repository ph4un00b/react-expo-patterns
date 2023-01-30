import { Dimensions, SafeAreaView, Text } from "react-native";
import { atom, useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

const COUNT = atom(0);
const $count = atom(
  (r) => r(COUNT),
  (_, w) => w(COUNT, (v) => v + 1),
);

const { width, height } = Dimensions.get("window");

export function Gesture_Panel() {
  const panelRef = useRef<Animated.View>(null!);
  const hostRef = useRef<SafeAreaView>(null!);

  const isPressed = useSharedValue(false);
  const sharedWidth = useSharedValue(width * 0.5);

  // gesture stuff

  const gesture = Gesture.Manual()
    .onTouchesDown((evt, _manager) => {
      // send({ ...evt, type: "pointerdown" });
    })
    .onTouchesMove((evt, _m) => {
      sharedWidth.value = evt.allTouches[0].x;
      console.log(sharedWidth.value);
      // send({ ...evt, type: "pointermove" });
    })
    .onTouchesCancelled((evt, _m) => {
      // send({ ...evt, type: "pointercancel" });
    })
    .onTouchesUp((evt, _m) => {
      // send({ ...evt, type: "pointerup" });
    });

  // animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: sharedWidth.value,
      transform: [
        // { translateX: offset.value.x },
        // { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      backgroundColor: isPressed.value ? "yellow" : "blue",
    };
  });

  useTestMeasurements(panelRef, hostRef);

  return (
    <SafeAreaView className="flex flex-row flex-1 bg-purple-400">
      <GestureDetector gesture={gesture}>
        <Animated.View
          ref={panelRef}
          // className="flex min-w-[80px]"
          style={[
            {
              minWidth: 80,
              maxWidth: width * 0.5,
            },
            animatedStyles,
          ]}
        >
          <Text className="text-2xl text-slate-100">
            {JSON.stringify(sharedWidth.value, null, 2)}
          </Text>
        </Animated.View>
      </GestureDetector>
      <Animated.View className="flex-1 bg-rose-300">
        <Text>{JSON.stringify(sharedWidth.value, null, 2)}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

interface ToggleContext {
  count: number;
}

type ToggleEvents = { type: "TOGGLE" };

function useTestMeasurements(
  panelRef: React.MutableRefObject<Animated.View>,
  hostRef: React.MutableRefObject<SafeAreaView>,
) {
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.measure((x, y, w, h, pw, ph) => {
        console.log(x, y, w, h, pw, ph);
      });
    }
  }, []);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.measureInWindow((x, y, w, h) => {
        console.log(x, y, w, h);
      });
    }
  }, []);

  useEffect(() => {
    if (panelRef.current && hostRef.current) {
      panelRef.current.measureLayout(hostRef.current as any, (l, t, w, h) => {
        console.log(l, t, w, h);
      }, console.error);
    }
  }, []);
}

function jamon(
  offset: SharedValue<{ x: number; y: number }>,
  e: any,
  start: SharedValue<{ x: number; y: number }>,
) {
  "worklet";
  offset.value = {
    x: e.translationX + start.value.x,
    y: e.translationY + start.value.y,
  };
}
