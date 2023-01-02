import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { clamp, mix } from "react-native-redash";
import {
  Button,
  Pressable,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState } from "react";

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

// const origin = -(width / 2);

export function DragReanimated({
  children,
  width,
  height,
  decay = false,
}: DragProps) {
  if (!width || !height) throw new Error("you forgot to pass dimensions!");
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

  /**
   * transition form state
   */
  // const [openOpts, setOpenOpts] = useState(false);
  // const openTransition = useToggleTransition({ state: openOpts });

  /**
   * transition form from sharedValue
   */
  const open = useSharedValue(false);
  const openTransition = useDerivedValue(() => {
    if (open.value) {
      return withSpring(Number(open.value) /**, optional config */);
    }
    return withTiming(Number(open.value) /**, optional config */);
  });

  const transitionStyleA = useAnimatedStyle(() => {
    const rotate = -1 * mix(openTransition.value, 0, 360 / 6);
    // console.log({ rotate });
    return {
      transform: [
        { translateX: -30 },
        { rotate: rotate + "deg" },
        { translateX: 70 },
      ],
    };
  });

  const transitionStyleB = useAnimatedStyle(() => {
    const rotate = 0 * mix(openTransition.value, 0, 360 / 6);
    // console.log({ rotate });
    return {
      transform: [
        { translateX: -30 },
        { rotate: rotate + "deg" },
        { translateX: 70 },
      ],
    };
  });

  const transitionStyleC = useAnimatedStyle(() => {
    const rotate = 1 * mix(openTransition.value, 0, 360 / 6);
    // console.log({ rotate });
    return {
      transform: [
        { translateX: -30 },
        { rotate: rotate + "deg" },
        { translateX: 70 },
      ],
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
         * TouchableWithoutFeedback | TouchableOpacity from reanimated
         * seems to not respect z-index
         * todo: research more!
         *
         * even classnames from nativewind
         * throws some errors on runtime!
         * in  order  to bail out console errors
         * i fallback to style objects! atm
         * */}
        <TouchableOpacity
          style={{ top: -96 }}
          // onLongPress={() => setOpenOpts(!openOpts)}
          onLongPress={() => (open.value = !open.value)}
        >
          <Animated.View>
            {/* @see https://reactnative.dev/docs/stylesheet.html#absolutefill-vs-absolutefillobject */}
            <Animated.View
              style={[
                /**
                 * this works on web: transform origin-[0%_50%]
                 * won't work on mobile!
                 *
                 * then we use this trick
                 * { translateX: -30 },
                 * { rotate ... },
                 * { translateX: 70 },
                 */
                {
                  // bg-slate-200 w-20 absolute -top-4 left-0  rounded-md border-2 border-slate-800 shadow-md px-3 py-2
                  backgroundColor: "rgb(203 213 225)",
                  width: 90,
                  position: "absolute",
                  top: "-1rem",
                  left: 0,
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: "red",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  // todo: shadows!
                  zIndex: 10,
                },
                transitionStyleA,
              ]}
            >
              <Text>decay A</Text>
            </Animated.View>

            <Pressable onPress={() => setDecayOp(!decayOp)}>
              <Animated.View
                style={[
                  /**
                   * this works on web: transform origin-[0%_50%]
                   * won't work on mobile!
                   *
                   * then we use this trick
                   * { translateX: -30 },
                   * { rotate ... },
                   * { translateX: 70 },
                   */
                  {
                    // bg-slate-200 w-20 absolute -top-4 left-0  rounded-md border-2 border-slate-800 shadow-md px-3 py-2
                    backgroundColor: decayOp ? "peru" : "",
                    width: 90,
                    position: "absolute",
                    top: "-1rem",
                    left: 0,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: "red",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    // todo: shadows!
                    zIndex: 10,
                  },
                  transitionStyleB,
                ]}
              >
                <Text>decay B</Text>
              </Animated.View>
            </Pressable>

            <Animated.View
              style={[
                /**
                 * this works on web: transform origin-[0%_50%]
                 * won't work on mobile!
                 *
                 * then we use this trick
                 * { translateX: -30 },
                 * { rotate ... },
                 * { translateX: 70 },
                 */
                {
                  // bg-slate-200 w-20 absolute -top-4 left-0  rounded-md border-2 border-slate-800 shadow-md px-3 py-2
                  backgroundColor: "rgb(203 213 225)",
                  width: 90,
                  position: "absolute",
                  top: "-1rem",
                  left: 0,
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: "red",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  // todo: shadows!
                  zIndex: 10,
                },
                transitionStyleC,
              ]}
            >
              <Text>decay C</Text>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
        {children}
        <>
          <Button title="reset" onPress={() => (open.value = !open.value)} />
        </>
      </Animated.View>
    </PanGestureHandler>
  );
}

function useToggleTransition({ state }: { state: boolean }) {
  const isToggled = useSharedValue(false);
  useEffect(() => {
    isToggled.value = state;
    return () => {};
  }, [state, isToggled]);

  const optTransition = useDerivedValue(() => {
    if (isToggled.value) {
      return withSpring(Number(isToggled.value) /**, optional config */);
    }
    return withTiming(Number(isToggled.value) /**, optional config */);
  });

  return optTransition;
}
