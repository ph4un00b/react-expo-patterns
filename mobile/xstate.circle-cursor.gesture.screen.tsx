import Svg, { Circle } from "react-native-svg";

import {
    Dimensions,
    PixelRatio,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import React from "react";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
    canvas2Polar,
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

export function GestureCircleCursor() {
    const theta = useSharedValue(defaultTheta);
    return (
        <SafeAreaView className="flex flex-1 bg-purple-400">
            <View className="flex items-center justify-center flex-1">
                <View style={{ width }} className="bg-green-400 ">
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
                    />
                </View>
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

function CircularProgress({ r, strokeWidth }: CircularProgressProps) {
    const radius = r - strokeWidth / 2;
    const circumference = radius * 2 * PI;
    return (
        <>
            <Circle
                cx={r}
                cy={r}
                fill="transparent"
                stroke="white"
                r={radius}
                {...{ strokeWidth }}
            />
            <Circle
                cx={r}
                cy={r}
                fill="transparent"
                r={radius}
                stroke={"#3884ff"}
                strokeDasharray={`${circumference}, ${circumference}`}
                {...{ strokeWidth }}
            />
        </>
    );
}

type CursorProps = {
    r: number;
    strokeWidth: number;
    theta: SharedValue<number>;
};

function Cursor({ r, strokeWidth, theta }: CursorProps) {
    const center: Vector = { x: r, y: r };
    const ctx = useSharedValue({ offsetX: 0, offsetY: 0 });
    const gesture = Gesture.Pan()
        .onStart((e) => {
            /**
             * drag pattern
             * @abstract remember position
             */
            const p: PolarPoint = { theta: theta.value, radius: r };
            const { x, y } = polar2Canvas(p, center);
            ctx.value.offsetX = x;
            ctx.value.offsetY = y;
        })
        .onUpdate((e) => {
            const { translationX, translationY } = e;
            const x = ctx.value.offsetX + translationX;
            const y = ctx.value.offsetY + translationY;
            const point: Vector = { x, y };
            /**
             * @abstract this returns [0, PI] until 180 degrees
             *  then from [-PI, 0] the next 180 degrees
             */
            const value = canvas2Polar(point, center).theta;
            /**
             * we proceed to normalize to radians [0, 2 * PI]
             */
            theta.value = value > 0 ? value : 2 * PI + value;
        });

    const style = useAnimatedStyle(() => {
        const p: PolarPoint = { theta: theta.value, radius: r };
        const { x: translateX, y: translateY } = polar2Canvas(p, center);
        return {
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
