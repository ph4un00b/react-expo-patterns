import { Dimensions, SafeAreaView, Text } from "react-native";
import React, { useRef } from "react";
import a, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { assign } from "xstate";
import { useMachine } from "@xstate/react";
import { PanelMachine } from "./xstate.panel";
import {
  Gesture,
  GestureDetector,
  GestureTouchEvent,
} from "react-native-gesture-handler";
import { clamp } from "react-native-redash";

const { width } = Dimensions.get("window");
const PANEL_WIDTH = width * 0.5;
const MIN_WIDTH = 55; // px
const MAX_WIDTH = PANEL_WIDTH; // px

export function XSM_Panel() {
  const panelRef = useRef<a.View>(null!);
  const sharedWidth = useSharedValue(PANEL_WIDTH);
  const [machine, send] = usePanelMachine(sharedWidth);
  const isCollapsed = machine.hasTag("collapsed");

  const gesture = Gesture.Manual()
    .onTouchesDown((evt) => {
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

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: isCollapsed ? MIN_WIDTH : sharedWidth.value,
    };
  });

  return (
    <SafeAreaView className="flex flex-row flex-1 bg-purple-400">
      <GestureDetector gesture={gesture}>
        <a.View
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
            panel
          </Text>
          <Text className="text-2xl text-slate-100">
            {JSON.stringify(machine.context, null, 2)}
          </Text>
        </a.View>
      </GestureDetector>
      <a.View className="flex-1 bg-rose-300">
        <Text className="text-2xl text-slate-100">
          state
        </Text>
        <Text className="text-2xl text-black">
          {JSON.stringify(machine.value, null, 2)}
        </Text>
      </a.View>
    </SafeAreaView>
  );
}

function usePanelMachine(sharedWidth: SharedValue<number>): any {
  return useMachine(PanelMachine, {
    context: {
      width: PANEL_WIDTH,
      pointerId: null,
      prevWidth: PANEL_WIDTH,
    },
    services: {
      cancel: () => (sendBack) => {
        const handler = (e: KeyboardEvent) => {
          if (e.key == "Escape") {
            sendBack("cancel");
          }
        };

        /** for web */
        window.addEventListener("keydown", handler);
        return () => {
          window.removeEventListener("keydown", handler);
        };
      },
    },
    actions: {
      setWidth: assign({
        width: (ctx) => {
          sharedWidth.value = ctx.prevWidth;
          return sharedWidth.value;
        },
      }),
      setPreviousWidth: assign({
        prevWidth: (ctx) => ctx.width,
      }),
      updatePanelWidth: assign({
        width: (_ctx, evt) => {
          sharedWidth.value = clamp(
            (evt as unknown as GestureTouchEvent).allTouches[0].x,
            MIN_WIDTH,
            MAX_WIDTH,
          );
          return sharedWidth.value;
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
      "ctx.width < 100px": (ctx) => ctx.width < 100,
      "ctx.width >= 100px": (ctx) => ctx.width >= 100,
    },
  });
}
