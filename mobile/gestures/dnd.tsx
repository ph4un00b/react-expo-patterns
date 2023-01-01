import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";
import { Pressable, Text, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";

type DragProps = {
  children?: React.ReactNode;
  decay?: boolean;
  width?: number;
  height?: number;
};

export function DragDetector({ children }: DragProps) {
  const start = useSharedValue({ x: 0, y: 0 });
  const offset = useSharedValue({ x: 0, y: 0 });
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        // { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      // backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      // isPressed.value = true;
      console.log("🚶‍♂️", e.translationX, e.translationY);
    })
    .onUpdate((e) => {
      console.log("💪", e.translationX, e.translationY);
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd((e) => {
      console.log("⛔", e.translationX, e.translationY);
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      // isPressed.value = false;
    });
  return (
    <GestureDetector gesture={Gesture.Race(gesture)}>
      <Animated.View
        style={[
          animatedStyles,
          {
            aspectRatio: 1,
            borderColor: "red",
            borderWidth: 2,
          },
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export function DragReanimated({
  children,
  width,
  height,
  decay = false,
}: DragProps) {
  if (!width || !height) throw new Error("you forgot to pass dimensions!");
  const [openOpts, setOpenOpts] = useState(false);
  const [decayOp, setDecayOp] = useState(decay);
  const [decay2Op, setDecay2Op] = useState(decay);
  const [decay3Op, setDecay3Op] = useState(decay);
  // const move = useSharedValue({ x: 0, y: 0 });
  const mx = useSharedValue(0);
  const my = useSharedValue(0);
  const boundX = width >> 1;
  const boundY = height >> 1;
  console.log({ width, height, boundX, boundY });
  const drag = useAnimatedGestureHandler({
    onStart: (e, ctx: Record<string, any>) => {
      remember_last_position: {
        ctx.offsetX = mx.value;
        ctx.offsetY = my.value;
      }
    },
    onActive: (e, ctx) => {
      mx.value = clamp(e.translationX + ctx.offsetX, -boundX, boundX);
      // x: e.translationX + ctx.offsetX,
      // y: e.translationY + ctx.offsetY
      my.value = clamp(e.translationY + ctx.offsetY, -boundY, boundY);
    },
    onEnd: (e) => {
      if (!decayOp) return;
      mx.value = withDecay({ velocity: e.velocityX, clamp: [-boundX, boundX] });
      my.value = withDecay({ velocity: e.velocityY, clamp: [-boundY, boundY] });
      // move.value.x = withDecay({ velocity: e.velocityX, clamp: [0, width - 50] });
      // move.value.y = withDecay({ velocity: e.velocityY, clamp: [0, height - 50] });
      console.log({ x: mx.value, y: my.value });
    },
  });

  const dragStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: mx.value },
        { translateY: my.value },
        // { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      // backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });

  return (
    <PanGestureHandler onGestureEvent={drag}>
      <Animated.View
        style={[
          dragStyles,
          {
            // aspectRatio: 1,
            borderColor: "purple",
            borderWidth: 2,
          },
        ]}
      >
        {/*
         * @see https://docs.swmansion.com/react-native-gesture-handler/docs/api/components/touchables/
         * TouchableWithoutFeedback from reanimated
         * seems to not respect z-index
         * todo: research more!
         * */}
        <TouchableWithoutFeedback onLongPress={() => setOpenOpts(!openOpts)}>
          <Animated.View className="z-10">
            {/* @see https://reactnative.dev/docs/stylesheet.html#absolutefill-vs-absolutefillobject */}
            <Pressable onPress={() => setDecayOp(!decayOp)}>
              <Text
                className="w-18 absolute -top-4 left-0 rounded-lg border-3 border-slate-900 shadow-lg px-4 transform origin-[0%_50%]"
                style={{
                  /** || -24deg */
                  transform: [{ rotate: openOpts ? "336deg" : "0deg" }],
                  backgroundColor: decayOp ? "peru" : "",
                }}
              >
                decay
              </Text>
            </Pressable>
            <Text
              className="bg-slate-200 w-17 absolute -top-4 left-0  rounded-md border-2 border-slate-800 shadow-md px-3 transform origin-[0%_50%]"
              style={{ transform: [{ rotate: openOpts ? "24deg" : "0deg" }] }}
            >
              decay
            </Text>
            <Text
              className="bg-slate-300 w-16 absolute -top-4 rounded-sm border-1 border-slate-700 shadow-sm px-2 transform origin-[0%_50%]"
              style={{ transform: [{ rotate: openOpts ? "0deg" : "0deg" }] }}
            >
              -decay
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}
