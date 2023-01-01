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
      if (!decay) return;
      mx.value = withDecay({ velocity: e.velocityX, clamp: [-boundX, boundX] });
      my.value = withDecay({ velocity: e.velocityY, clamp: [-boundY, boundY] });
      // move.value.x = withDecay({ velocity: e.velocityX, clamp: [0, width - 50] });
      // move.value.y = withDecay({ velocity: e.velocityY, clamp: [0, height - 50] });
      console.log({ x: mx.value, y: my.value });
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
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
          animatedStyles,
          {
            // aspectRatio: 1,
            borderColor: "purple",
            borderWidth: 2,
          },
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}
