/** from @see https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/sticker-app/src/GestureHandler.tsx */
import type {
  SkiaMutableValue,
  SkMatrix,
  SkRect,
} from "@shopify/react-native-skia";
import { Skia, useSharedValueEffect } from "@shopify/react-native-skia";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { toMatrix3, identity4, Matrix4 as m4 } from "react-native-redash";

import type { Matrix4, Transforms3d, Vec3 } from "react-native-redash";
import { multiply4, processTransform3d } from "react-native-redash";

export const vec3 = (x: number, y: number, z: number) => [x, y, z] as const;

export const transformOrigin3d = (
  origin: Vec3,
  transform: Transforms3d
): Transforms3d => {
  "worklet";
  return [
    { translateX: origin[0] },
    { translateY: origin[1] },
    { translateZ: origin[2] },
    ...transform,
    { translateX: -origin[0] },
    { translateY: -origin[1] },
    { translateZ: -origin[2] },
  ];
};

export const concat = (m: Matrix4, origin: Vec3, transform: Transforms3d) => {
  "worklet";
  return multiply4(m, processTransform3d(transformOrigin3d(origin, transform)));
};

interface GestureHandlerProps {
  matrix: SkiaMutableValue<SkMatrix>;
  dimensions: SkRect;
  debug?: boolean;
}

export const MatrixGestureHandler = ({
  matrix: skMatrix,
  dimensions,
  debug,
}: GestureHandlerProps) => {
  const { x, y, width, height } = dimensions;
  const origin = useSharedValue(vec3(0, 0, 0));
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);

  useSharedValueEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skMatrix.current = Skia.Matrix(toMatrix3(matrix.value) as any);
  }, matrix);

  const pan = Gesture.Pan().onChange((e) => {
    matrix.value = multiply4(
      m4.translate(e.changeX, e.changeY, 0),
      matrix.value
    );
  });

  const rotate = Gesture.Rotation()
    .onBegin((e) => {
      origin.value = [e.anchorX, e.anchorY, 0];
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [
        { rotateZ: e.rotation },
      ]);
    });

  const scale = Gesture.Pinch()
    .onBegin((e) => {
      origin.value = [e.focalX, e.focalY, 0];
      offset.value = matrix.value;
    })
    .onChange((e) => {
      matrix.value = concat(offset.value, origin.value, [{ scale: e.scale }]);
    });

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: y,
    width,
    height,
    backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
    transform: [
      { translateX: -width / 2 },
      { translateY: -height / 2 },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { matrix: matrix.value as any },
      { translateX: width / 2 },
      { translateY: height / 2 },
    ],
  }));
  return (
    <GestureDetector gesture={Gesture.Race(scale, rotate, pan)}>
      <Animated.View style={style} />
    </GestureDetector>
  );
};
