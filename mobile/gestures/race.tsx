import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { identity4 } from "react-native-redash";
import { Matrix4, multiply4 } from "react-native-redash";

type DragProps = {
  children?: React.ReactNode;
};

export function ActionsDetector({ children }: DragProps) {
  const mat = useSharedValue(identity4);
  const start = useSharedValue({ x: 0, y: 0 });
  const offset = useSharedValue({ x: 0, y: 0 });

  const pan = Gesture.Pan()
    .onBegin((e) => {
      // isPressed.value = true;
      // console.log("🚶‍♂️", e.translationX, e.translationY);
    })
    // .onChange((e) => {
    //     mat.value = multiply4(mat.value, Matrix4.translate(e.changeX, e.changeY, 0))
    // })
    .onUpdate((e) => {
      console.log("init pan");
      // console.log("💪", e.translationX, e.translationY);
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd((e) => {
      // console.log("⛔", e.translationX, e.translationY);
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    })
    .onFinalize(() => {
      // isPressed.value = false;
    });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const pin = Gesture.Pinch()
    .onBegin(() => {})
    .onUpdate((event) => {
      console.log("init zoom");
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const rot = Gesture.Rotation()
    .onBegin(() => {})
    .onUpdate((event) => {
      console.log("init rotation");
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        // { matrix: mat.value as unknown as number[]  },
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: scale.value },
        // { scale: withSpring(isPressed.value ? 1.2 : 1) },
        { rotateZ: `${rotation.value}rad` },
      ],
      // backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });

  return (
    <GestureDetector gesture={Gesture.Race(pin, pan, rot)}>
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
