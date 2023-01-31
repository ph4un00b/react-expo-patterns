import { Dimensions, SafeAreaView, Text } from "react-native";
import React, { useRef } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { assign } from "xstate";
import { useMachine } from "@xstate/react";
import { PanelMachine } from "./xstate.panel";
import {
  Gesture,
  GestureDetector,
  GestureTouchEvent,
} from "react-native-gesture-handler";
import { clamp, mix } from "react-native-redash";

const { width } = Dimensions.get("window");
const PANEL_WIDTH = width * 0.5;
const MIN_WIDTH = 55; // px
const MAX_WIDTH = PANEL_WIDTH; // px

export function XSM_Panel() {
  const panelRef = useRef<Animated.View>(null!);
  const isPressed = useSharedValue(false);
  const sharedWidth = useSharedValue(PANEL_WIDTH);

  // gesture stuff
  const gesture = Gesture.Manual()
    .onTouchesDown((evt, _manager) => {
      send({ ...evt, type: "pointerdown" });
    })
    .onTouchesMove((evt, _m) => {
      send({ ...evt, type: "pointermove" });
    })
    .onTouchesCancelled((evt, _m) => {
      send({ ...evt, type: "pointercancel" });
    })
    .onTouchesUp((evt, _m) => {
      send({ ...evt, type: "pointerup" });
    });

  // machine stuff
  const [current, send] = useMachine(PanelMachine, {
    context: {
      width: PANEL_WIDTH,
      pointerId: null,
    },
    actions: {
      setWidth: assign({}),
      setPreviousWidth: assign({}),
      updatePanelWidth: assign({
        width: (_ctx, evt) => {
          sharedWidth.value = clamp(
            (evt as unknown as GestureTouchEvent).allTouches[0].x,
            MIN_WIDTH,
            MAX_WIDTH,
          );
          const x = sharedWidth.value;
          return x;
        },
      }),
      setPointerCapture: assign({
        pointerId: (_, e) =>
          (e as unknown as GestureTouchEvent).allTouches[0].id,
      }),
      releasePointerCapture: assign({
        pointerId: (ctx) => (ctx.pointerId = null),
      }),
    },
    guards: {
      "ctx.width < 100px": () => false,
      "ctx.width >= 100px": () => true,
    },
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

  return (
    <SafeAreaView className="flex flex-row flex-1 bg-purple-400">
      <GestureDetector gesture={gesture}>
        <Animated.View
          ref={panelRef}
          // className="flex min-w-[80px] /* this will yield console errors, this might be fixed on nativewind 3.0*/"
          style={[
            // this is like double secure boundaries
            {
              minWidth: MIN_WIDTH,
              maxWidth: MAX_WIDTH,
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
        <Text className="text-2xl text-black">
          {JSON.stringify(current.value, null, 2)}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
