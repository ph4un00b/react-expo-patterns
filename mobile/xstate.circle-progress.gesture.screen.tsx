import Svg, { Circle } from "react-native-svg";

import {
    Dimensions,
    PixelRatio,
    SafeAreaView,
    StyleSheet,
    View,
} from "react-native";

import React from "react";
import Animated, {
    interpolateColor,
    SharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
    canvas2Polar,
    clamp,
    polar2Canvas,
    PolarPoint,
    Vector,
} from "react-native-redash";

const { width, height } = Dimensions.get("window");

const size = width - 32;
const STROKE_WIDTH = 40;
const r = PixelRatio.roundToNearestPixel(size / 2);
const center = { x: r, y: r };
const defaultTheta = canvas2Polar({ x: 0, y: 0 }, center).theta;

console.log({ defaultTheta, size, stroke: STROKE_WIDTH, r });

export function GestureCircleProgress() {
    const theta = useSharedValue(defaultTheta);
    const backgroundColor = useDerivedValue(() => {
        return interpolateColor(
            theta.value,
            [0, Math.PI, Math.PI * 2],
            ["green", "gray", "brown"],
        );
    });

    const style = useAnimatedStyle(() => ({
        backgroundColor: backgroundColor.value,
    }));

    return (
        <SafeAreaView className="flex flex-1 bg-purple-400">
            <View className="flex items-center justify-center flex-1">
                <Animated.View style={[{ width }, style]}>
                    <Svg
                        height={width}
                        width={width}
                    // viewBox={`0 0 ${size} ${size}`}
                    >
                        <CircularProgress
                            strokeWidth={STROKE_WIDTH}
                            theta={theta}
                            r={r}
                        />
                    </Svg>
                    <Cursor
                        strokeWidth={STROKE_WIDTH}
                        r={r - STROKE_WIDTH / 2}
                        theta={theta}
                        backgroundColor={backgroundColor}
                    />
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const { PI } = Math;

type CircularProgressProps = {
    theta: Animated.SharedValue<number>;
    r: number;
    strokeWidth: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
function CircularProgress({ r, strokeWidth, theta }: CircularProgressProps) {
    const radius = r - strokeWidth / 2;
    const circumference = radius * 2 * PI;
    const props = useAnimatedProps(() => {
        return { strokeDashoffset: theta.value * radius };
    });

    return (
        <>
            <Circle
                cx={r}
                cy={r}
                fill="transparent"
                stroke="white"
                r={radius}
                strokeWidth={strokeWidth}
            />
            <AnimatedCircle
                /**
                 * @abstract hack `onPress={() => { }}`
                 * workaround in order to render
                 */
                animatedProps={props}
                onPress={() => { }}
                cx={r}
                cy={r}
                fill="transparent"
                r={radius}
                stroke={"peru"}
                strokeDasharray={`${circumference}, ${circumference}`}
                strokeWidth={strokeWidth}
            />
        </>
    );
}

const THRESHOLD = 0.001;

type CursorProps = {
    r: number;
    strokeWidth: number;
    theta: SharedValue<number>;
    backgroundColor: Animated.SharedValue<string | number>;
};

function Cursor({ r, strokeWidth, theta, backgroundColor }: CursorProps) {
    const center: Vector = { x: r, y: r };
    const ctx = useSharedValue({ x: 0, y: 0 });
    const gesture = Gesture.Pan()
        .onStart((e) => {
            /**
             * drag pattern
             * @abstract remember position
             */
            const p: PolarPoint = { theta: theta.value, radius: r };
            /**
             * @description
             * beware of multiple assignments
             * they maybe trigger side effects
             * we refactor the code below
             * to a single assignment shape
             * to prevent flickering on animation styles!
             */
            // const { x, y } = polar2Canvas(p, center);
            // ctx.value.x = x;
            // ctx.value.y = y;
            /**
             * @refactor
             */
            ctx.value = polar2Canvas(p, center);
        })
        .onUpdate((e) => {
            const originX = r;
            const x = ctx.value.x + e.translationX;
            let y = ctx.value.y + e.translationY;
            /**
             * @abstract limit the cursor path
             */
            if (x < originX) {
                /** noop */
            } else if (theta.value < PI) {
                y = clamp(y, 0, r - THRESHOLD);
            } else {
                y = clamp(y, r, 2 * r);
            }
            /**
             * @abstract this returns [0, PI] until 180 degrees
             *  then from [-PI, 0] the next 180 degrees
             */
            const value = canvas2Polar({ x, y }, center).theta;
            /**
             * we proceed to normalize to radians [0, 2 * PI]
             */
            theta.value = value > 0 ? value : 2 * PI + value;
        })
        .onFinalize((e) => {
            // console.log(e.translationX)
        });

    const style = useAnimatedStyle(() => {
        const p: PolarPoint = { theta: theta.value, radius: r };
        const { x: translateX, y: translateY } = polar2Canvas(p, center);
        return {
            backgroundColor: backgroundColor.value,
            transform: [{ translateX }, { translateY }],
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    style,
                    {
                        ...StyleSheet.absoluteFillObject,
                        width: strokeWidth,
                        height: strokeWidth,
                        borderRadius: strokeWidth / 2,
                        borderColor: "white",
                        borderWidth: 5,
                        backgroundColor: "#3884ff",
                    },
                ]}
            />
        </GestureDetector>
    );
}
