import { Dimensions, SafeAreaView, Text } from "react-native";
import { useRef } from "react";
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

export function XSMPanel() {
  const panelRef = useRef<a.View>(null!);
  const ctx = useSharedValue({ width: PANEL_WIDTH, prevWidth: PANEL_WIDTH });
  const sharedWidth = useSharedValue(PANEL_WIDTH);
  const [machine, send] = usePanelMachine(sharedWidth, ctx);
  const isCollapsed = machine.hasTag("collapsed");

  const gesture = Gesture.Manual();
  gesture.onTouchesDown((evt) => {
    send({ ...evt, type: "pointerdown" });
  });
  gesture.onTouchesMove((evt, _m) => {
    send({ ...evt, type: "pointermove" });
  });
  gesture.onTouchesCancelled((evt, _m) => {
    send({ ...evt, type: "pointercancel" });
  });
  gesture.onTouchesUp((evt, _m) => {
    send({ ...evt, type: "pointerup" });
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: isCollapsed ? MIN_WIDTH : sharedWidth.value,
      // width: isCollapsed ? MIN_WIDTH : machine.context.width,
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

function usePanelMachine(
  sharedWidth: SharedValue<number>,
  ctx: SharedValue<any>,
): any {
  'worklet'
  return useMachine(PanelMachine, {
    context: {
      // width: useSharedValue(PANEL_WIDTH).value,
      pointerId: null,
      // prevWidth: useSharedValue(PANEL_WIDTH).value,
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
      // setWidth: assign({
      //   width: (ctx) => {
      //     "worklet";
      //     // sharedWidth.value = ctx.prevWidth;
      //     // return sharedWidth.value;
      //     // return ctx.prevWidth;
      //   },
      // }),
      setWidth: () => {
        "worklet";
        sharedWidth.value = ctx.value.prevWidth;
      },
      // setPreviousWidth: assign({
      //   prevWidth: (ctx) => ctx.width,
      // }),
      setPreviousWidth: () => {
        "worklet";
        ctx.value.prevWidth = sharedWidth.value;
      },
      // updatePanelWidth: assign({
      //   width: (_ctx, evt) => {
      //     sharedWidth.value = clamp(
      //       (evt as unknown as GestureTouchEvent).allTouches[0].x,
      //       MIN_WIDTH,
      //       MAX_WIDTH,
      //     );
      //     return sharedWidth.value;
      //   },
      // }),
      updatePanelWidth: (_, evt) => {
        "worklet";
        sharedWidth.value = clamp(
          (evt as unknown as GestureTouchEvent).allTouches[0].x,
          MIN_WIDTH,
          MAX_WIDTH,
        );
      },
      // setPointerCapture: assign({
      //   pointerId: (_, e) => {
      //     "worklet";
      //     return (e as unknown as GestureTouchEvent).allTouches[0].id;
      //   },
      // }),
      "setPointerCapture": () => { },
      // releasePointerCapture: assign({
      //   pointerId: (ctx) => {
      //     "worklet";
      //     return (ctx.pointerId = null);
      //   },
      // }),
      "releasePointerCapture": () => { },
    },
    guards: {
      "ctx.width < 100px": () => {
        "worklet";
        return sharedWidth.value < 100;
      },
      "ctx.width >= 100px": () => {
        "worklet";
        return sharedWidth.value >= 100;
      },
    },
  });
}
